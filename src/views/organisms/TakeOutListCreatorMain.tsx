import {
	BackHandler,
	Keyboard,
	ListRenderItemInfo,
	StyleSheet,
	Text,
	TouchableHighlight,
	TouchableOpacity,
	View,
} from "react-native";
import { useCallback, useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import DefaultModal from "../molecules/DefaultModal";
import { modalStyles } from "../../styles";
import { Item, LoginDrawerProps, TakeOutList } from "../../interfaces";
import { FlatList, TextInput } from "react-native-gesture-handler";
import LoadingSpinner from "../atoms/LoadingSpinner";
// import ItemFilterBar from "../organisms/ItemFilterBar";
import TakeOutAcceptListItem from "../atoms/TakeOutAcceptListItem";
import ItemTile from "./Tiles/ItemTile";
import { ItemAction } from "../../contexts/ItemReducer";
import { usePostTakeOut } from "../../query-hooks/UseTakeOuts";
import { UseQueryResult } from "react-query";
import QRScanner from "./QRScanner";
import HeaderWithSearchBar from "../pages/HeaderWithSearchBar";
import BottomControlButtons from "./BottomControlButtons";
import BottomCheckButton from "../atoms/BottomCheckButton";

interface TakeOutListCreatorMainProps {
	items: Item[];
	storeId: number;
	drawerProps: LoginDrawerProps;
	dispatchItems: React.Dispatch<ItemAction>;
	getItems: UseQueryResult<Item[], unknown>;
	setStoreId: React.Dispatch<React.SetStateAction<number>>;
}

const TakeOutListCreatorMain = ({
	items,
	storeId,
	drawerProps,
	dispatchItems,
	getItems,
	setStoreId,
}: TakeOutListCreatorMainProps) => {
	const [modalIsVisible, setModalIsVisible] = useState(false); // Decides wether the final accept modal is displayed
	const [searchTerm, setSearchTerm] = useState(""); // The text typed in the header search bar. SHown items are filtered by name based on this
	const [filteredItems, setFilteredItems] = useState<Item[]>([]); // Displayed data
	const [selectedItemAmount, setSelectedItemAmount] = useState(0); // Counts selected items
	const [cameraIsActive, setCameraIsActive] = useState(false); // Sets the qr scanner screen active/inactive
	const [listSendLoading, setListSentLoading] = useState(false);
	const [takeOutList, setTakeOutList] = useState<TakeOutList>({
		// Final accept data
		items: [],
		uniqueItems: [],
		store_id: storeId,
		take_out_name: "",
	});

	const postTakeOut = usePostTakeOut({
		takeOutList,
		drawerProps,
		setStoreId,
		storeId,
	}); // Sends finalized data to the server

	useEffect(() => {
		setSelectedItemAmount(items.filter((item) => item.is_selected).length);
		const filtered = items.filter((item) => {
			return item.item_name.toLowerCase().includes(searchTerm.toLowerCase());
		});
		if (filtered) setFilteredItems(filtered);
	}, [searchTerm, items]);

	useEffect(() => {
		const kListener = Keyboard.addListener("keyboardDidHide", () => {
			Keyboard.dismiss();
		});
		const backAction = () => {
			setStoreId(-1);
			return true;
		};
		const backHandler = BackHandler.addEventListener(
			"hardwareBackPress",
			backAction
		);
		return () => {
			kListener.remove();
			backHandler.remove();
		};
	}, []);

	const renderRow = useCallback(({ item }: ListRenderItemInfo<Item>) => {
		return (
			<ItemTile
				item={item}
				dispatchItems={dispatchItems}
				setCameraIsActive={setCameraIsActive}
			/>
		);
	}, []);

	const keyExtractor = (item: Item) => item.id.toString();

	const acceptButtonOnPress = () => {
		const selectedItems = items
			.filter((item) => item.is_selected && !item.is_unique)
			.map((item) => ({
				id: item.id,
				amount: item.selected_amount,
			}));

		const selectedUniqueItems = items
			.filter((item) => item.is_selected && item.is_unique)
			.flatMap((item) => item.selected_unique_items);

		console.log(selectedItems);
		console.log(selectedUniqueItems);

		setTakeOutList((prev) => {
			return {
				...prev,
				uniqueItems: selectedUniqueItems,
				items: selectedItems,
			};
		});

		setModalIsVisible(selectedItemAmount > 0 ? true : false);
	};

	return (
		<>
			{cameraIsActive && getItems.isSuccess ? (
				<QRScanner
					setCameraIsActive={setCameraIsActive}
					dispatchItems={dispatchItems}
					items={items}
				/>
			) : (
				<>
					<DefaultModal
						visible={modalIsVisible}
						closeFn={() => setModalIsVisible(false)}
					>
						<>
							<TouchableOpacity onPress={() => setModalIsVisible(false)}>
								<Text style={modalStyles.mainText}>Kiválasztott eszközök:</Text>
							</TouchableOpacity>
							<FlatList
								data={items
									.filter((item) => item.is_selected)
									.sort((a, b) => a.item_name.localeCompare(b.item_name))}
								keyExtractor={(item) => item.id.toString()}
								renderItem={(item) => (
									<TakeOutAcceptListItem ListItemData={item} />
								)}
							/>
							<TextInput
								style={modalStyles.textInput}
								defaultValue={takeOutList.take_out_name}
								onChangeText={(text) =>
									setTakeOutList((prev) => {
										return { ...prev, take_out_name: text };
									})
								}
								placeholder="Hol használod az eszközöket?"
							/>
							<View style={modalStyles.buttonContainer}>
								{listSendLoading ? (
									<LoadingSpinner />
								) : (
									<>
										<TouchableHighlight
											style={modalStyles.buttonReject}
											onPress={() => setModalIsVisible(false)}
										>
											<Text style={modalStyles.buttonRejectText}>Mégse</Text>
										</TouchableHighlight>
										<TouchableHighlight
											style={
												takeOutList.take_out_name.length != 0
													? modalStyles.buttonAccept
													: modalStyles.buttonDisabled
											}
											onPress={() => {
												postTakeOut.mutate();
												setListSentLoading(true);
											}}
										>
											<Text style={modalStyles.buttonAcceptText}>Kivétel</Text>
										</TouchableHighlight>
									</>
								)}
							</View>
						</>
					</DefaultModal>
					<HeaderWithSearchBar
						drawerProps={drawerProps}
						setSearchTerm={setSearchTerm}
						searchTerm={searchTerm}
					/>
					{(getItems.isLoading || getItems.isIdle) && <LoadingSpinner />}
					{getItems.isSuccess && (
						<>
							{/* <ItemFilterBar
									filteredItems={filteredItems}
									setFilteredItems={setFilteredItems}
								/> */}
							<FlatList
								data={filteredItems}
								style={{ flex: 1 }}
								keyExtractor={keyExtractor}
								getItemLayout={(data, index) => ({
									length: 80,
									offset: 80 * (index + 1),
									index,
								})}
								renderItem={renderRow}
							/>
						</>
					)}
					<BottomControlButtons setCameraIsActive={setCameraIsActive}>
						<>
							<TouchableOpacity
								style={styles.footerButton}
								onPress={() => setCameraIsActive(true)}
							>
								<Ionicons
									name="camera"
									size={24}
									color="#fff"
								/>
							</TouchableOpacity>
							<BottomCheckButton
								acceptButtonIsActive={selectedItemAmount > 0}
								acceptButtonOnPress={acceptButtonOnPress}
							/>
						</>
					</BottomControlButtons>
				</>
			)}
		</>
	);
};

export default TakeOutListCreatorMain;

const styles = StyleSheet.create({
	footerButton: {
		backgroundColor: "#007aff",
		width: 60,
		height: 60,
		borderRadius: 30,
		justifyContent: "center",
		alignItems: "center",
		marginHorizontal: 20,
	},
});
