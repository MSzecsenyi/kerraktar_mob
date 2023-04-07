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
import { useCallback, useEffect, useRef, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import DefaultModal from "../molecules/DefaultModal";
import { modalStyles } from "../../styles";
import { Item, TakeOutList } from "../../interfaces";
import { FlatList, TextInput } from "react-native-gesture-handler";
import LoadingSpinner from "../atoms/LoadingSpinner";
// import ItemFilterBar from "../organisms/ItemFilterBar";
import TakeOutAcceptListItem from "../atoms/TakeOutAcceptListItem";
import TakeOutItemTile from "../organisms/Tiles/TakeOutItemTile";
import { TakeOutItemAction } from "../../contexts/ItemReducer";
import { usePostTakeOut } from "../../query-hooks/UseTakeOuts";
import { UseQueryResult } from "react-query";
import QRScanner from "../organisms/QRScanner";
import HeaderWithSearchBar from "../molecules/HeaderWithSearchBar";
import BottomControlButtons from "../atoms/bottomButtons/BottomButtonContainer";
import UnsavedListWarning from "../organisms/UnsavedListWarning";
import { TakeOutListCreatorManagerProps } from "./TakeOutListCreatorManager";
import BottomButton from "../atoms/bottomButtons/BottomButton";

interface TakeOutListCreatorMainProps {
	items: Item[];
	storeId: number;
	navigationProps: TakeOutListCreatorManagerProps;
	dispatchItems: React.Dispatch<TakeOutItemAction>;
	getItems: UseQueryResult<Item[], unknown>;
	setStoreId: React.Dispatch<React.SetStateAction<number>>;
}

const TakeOutListCreatorMain = ({
	items,
	storeId,
	navigationProps,
	dispatchItems,
	getItems,
	setStoreId,
}: TakeOutListCreatorMainProps) => {
	const [modalIsVisible, setModalIsVisible] = useState(false); // Decides wether the final accept modal is displayed
	const [warningModalIsVisible, setWarningModalIsVisible] = useState(false); // Decides wether the final accept modal is displayed
	const [searchTerm, setSearchTerm] = useState(""); // The text typed in the header search bar. SHown items are filtered by name based on this
	const [filteredItems, setFilteredItems] = useState<Item[]>([]); // Displayed data
	const [selectedItemAmount, _setSelectedItemAmount] = useState(0); // Counts selected items
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
		navigationProps,
		setStoreId,
	}); // Sends finalized data to the server

	const selectedItemAmountRef = useRef(selectedItemAmount);
	const setSelectedItemAmount = (data: number) => {
		selectedItemAmountRef.current = data;
		_setSelectedItemAmount(data);
	};

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
			if (selectedItemAmountRef.current > 0) {
				setWarningModalIsVisible(true);
			} else {
				navigationProps.navigation.navigate("TakeOutSelectorScreen");
			}
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
			<TakeOutItemTile
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
					{/* MODALS */}
					<DefaultModal
						visible={warningModalIsVisible}
						closeFn={() => setWarningModalIsVisible(false)}
					>
						<UnsavedListWarning
							acceptModal={() =>
								navigationProps.navigation.navigate("TakeOutSelectorScreen")
							}
							closeModal={() => setWarningModalIsVisible(false)}
						/>
					</DefaultModal>

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

					{/* PAGE CONTENT */}
					<HeaderWithSearchBar
						openDrawer={navigationProps.navigation.openDrawer}
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
					<BottomControlButtons>
						<>
							<BottomButton //Enable QRScanner
								buttonOnPress={() => setCameraIsActive(true)}
							>
								<Ionicons
									name="camera"
									size={24}
									color="#fff"
								/>
							</BottomButton>
							<BottomButton //Accept changes
								buttonIsActive={selectedItemAmount > 0}
								buttonOnPress={acceptButtonOnPress}
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
