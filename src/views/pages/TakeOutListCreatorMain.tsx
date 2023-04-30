import {
	BackHandler,
	Keyboard,
	ListRenderItemInfo,
	RefreshControl,
	Text,
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
import BottomButtonContainer from "../atoms/bottomButtons/BottomButtonContainer";
import WarningModalContent from "../organisms/ModalContents/WarningModalContent";
import { TakeOutListCreatorManagerProps } from "./TakeOutListCreatorManager";
import BottomButton from "../atoms/bottomButtons/BottomButton";
import { COLORS } from "../../colors";
import { useFocusEffect } from "@react-navigation/native";

interface TakeOutListCreatorMainProps {
	items: Item[];
	storeId: number;
	navigationProps: TakeOutListCreatorManagerProps;
	dispatchItems: React.Dispatch<TakeOutItemAction>;
	getItems: UseQueryResult<Item[], unknown>;
}

const TakeOutListCreatorMain = ({
	items,
	storeId,
	navigationProps,
	dispatchItems,
	getItems,
}: TakeOutListCreatorMainProps) => {
	const [modalIsVisible, setModalIsVisible] = useState(false); // Decides wether the final accept modal is displayed
	const [warningModalIsVisible, setWarningModalIsVisible] = useState(false); // Decides wether the final accept modal is displayed
	const [searchTerm, setSearchTerm] = useState(""); // The text typed in the header search bar. SHown items are filtered by name based on this
	const [filteredItems, setFilteredItems] = useState<Item[]>([]); // Displayed data
	const [selectedItemAmount, _setSelectedItemAmount] = useState(0); // Counts selected items
	const [cameraIsActive, setCameraIsActive] = useState(false); // Sets the qr scanner screen active/inactive
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
		filtered.sort((a, b) => a.item_name.localeCompare(b.item_name));
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
						closeFn={() => setWarningModalIsVisible(false)}>
						<WarningModalContent
							acceptModal={() =>
								navigationProps.navigation.navigate("TakeOutSelectorScreen")
							}
							closeModal={() => setWarningModalIsVisible(false)}
							explainText="A megkezdett eszközlista nem lesz elmentve!"
						/>
					</DefaultModal>

					<DefaultModal
						visible={modalIsVisible}
						closeFn={() => setModalIsVisible(false)}>
						<>
							<View>
								<Text style={modalStyles.mainText}>Kiválasztott eszközök:</Text>
							</View>
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
								placeholder="Mi legyen az eszközkivétel neve?"
							/>
							<View style={{ marginTop: 20 }}>
								{postTakeOut.isLoading ? (
									<LoadingSpinner />
								) : (
									<>
										<View style={modalStyles.buttonContainer}>
											<TouchableOpacity
												style={modalStyles.buttonReject}
												onPress={() => setModalIsVisible(false)}>
												<Text style={modalStyles.buttonRejectText}>Mégse</Text>
											</TouchableOpacity>
											<TouchableOpacity
												style={
													takeOutList.take_out_name.length != 0
														? modalStyles.buttonAccept
														: modalStyles.buttonDisabled
												}
												onPress={() => {
													postTakeOut.mutate();
												}}>
												<Text style={modalStyles.buttonAcceptText}>
													Kivétel
												</Text>
											</TouchableOpacity>
										</View>
										{postTakeOut.isError && (
											<Text>Duplikált eszközkivétel nem lehetséges!</Text>
										)}
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
						title="Új eszközkivétel"
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
							<BottomButtonContainer>
								<>
									<BottomButton //Enable QRScanner
										buttonOnPress={() => setCameraIsActive(true)}>
										<Ionicons
											name="camera"
											size={24}
											color={COLORS.white}
										/>
									</BottomButton>
									<BottomButton //Accept changes
										buttonIsActive={selectedItemAmount > 0}
										buttonOnPress={acceptButtonOnPress}
									/>
								</>
							</BottomButtonContainer>
						</>
					)}
				</>
			)}
		</>
	);
};

export default TakeOutListCreatorMain;
