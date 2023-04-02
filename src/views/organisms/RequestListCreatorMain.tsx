import {
	BackHandler,
	Keyboard,
	ListRenderItemInfo,
	StyleSheet,
	Text,
	TouchableOpacity,
} from "react-native";
import { useCallback, useEffect, useState } from "react";
import DefaultModal from "../molecules/DefaultModal";
import { modalStyles } from "../../styles";
import { LoginDrawerProps, RequestItem } from "../../interfaces";
import { FlatList } from "react-native-gesture-handler";
import LoadingSpinner from "../atoms/LoadingSpinner";
// import ItemFilterBar from "../organisms/ItemFilterBar";
// import { usePostRequest } from "../../query-hooks/UseRequests";
import { UseQueryResult } from "react-query";
import HeaderWithSearchBar from "../pages/HeaderWithSearchBar";
import BottomControlButtons from "./BottomControlButtons";
import BottomCheckButton from "../atoms/BottomCheckButton";
import { RequestItemAction } from "../../contexts/RequestItemReducer";
import RequestItemTile from "./Tiles/RequestItemTile";

interface RequestListCreatorMainProps {
	requestItems: RequestItem[];
	storeId: number;
	drawerProps: LoginDrawerProps;
	dispatchRequestItems: React.Dispatch<RequestItemAction>;
	getRequestItems: UseQueryResult<RequestItem[], unknown>;
	setStoreId: React.Dispatch<React.SetStateAction<number>>;
}

const RequestListCreatorMain = ({
	requestItems,
	storeId,
	drawerProps,
	dispatchRequestItems,
	getRequestItems,
	setStoreId,
}: RequestListCreatorMainProps) => {
	const [modalIsVisible, setModalIsVisible] = useState(false); // Decides wether the final accept modal is displayed
	const [searchTerm, setSearchTerm] = useState(""); // The text typed in the header search bar. SHown items are filtered by name based on this
	const [filteredItems, setFilteredItems] = useState<RequestItem[]>([]); // Displayed data
	const [selectedItemAmount, setSelectedItemAmount] = useState(0); // Counts selected items
	const [listSendLoading, setListSentLoading] = useState(false);
	// const [requestList, setRequestList] = useState<RequestList>({
	// 	// Final accept data
	// 	items: [],
	// 	uniqueItems: [],
	// 	store_id: storeId,
	// 	take_out_name: "",
	// });

	// const postRequest = usePostRequest({
	// 	requestList,
	// 	drawerProps,
	// 	setStoreId,
	// 	storeId,
	// }); // Sends finalized data to the server

	useEffect(() => {
		setSelectedItemAmount(requestItems.filter((item) => item.is_selected).length);
		const filtered = requestItems.filter((item) => {
			return item.item_name.toLowerCase().includes(searchTerm.toLowerCase());
		});
		if (filtered) setFilteredItems(filtered);
	}, [searchTerm, requestItems]);

	useEffect(() => {
		const kListener = Keyboard.addListener("keyboardDidHide", () => {
			Keyboard.dismiss();
		});
		// const backAction = () => {
		// 	setStoreId(-1); //TODO: időt állítani???
		// 	return true;
		// };
		// const backHandler = BackHandler.addEventListener(
		// 	"hardwareBackPress",
		// 	backAction
		// );
		return () => {
			kListener.remove();
			// backHandler.remove();
		};
	}, []);

	const renderRow = useCallback(({ item }: ListRenderItemInfo<RequestItem>) => {
		return (
			<RequestItemTile item={item} dispatchRequestItems={dispatchRequestItems} />
		);
	}, []);

	const keyExtractor = (item: RequestItem) => item.id.toString();

	const acceptButtonOnPress = () => {
		console.log("Accept button pressed")

		// setRequestList((prev) => {
		// 	return {
		// 		...prev,
		// 		uniqueItems: selectedUniqueItems,
		// 		items: selectedItems,
		// 	};
		// });

		setModalIsVisible(selectedItemAmount > 0 ? true : false);
	};

	return (
				<>
					<DefaultModal
						visible={modalIsVisible}
						closeFn={() => setModalIsVisible(false)}
					>
						<>
							<TouchableOpacity onPress={() => setModalIsVisible(false)}>
								<Text style={modalStyles.mainText}>Kiválasztott eszközök:</Text>
							</TouchableOpacity>
						</>
					</DefaultModal>
					<HeaderWithSearchBar
						drawerProps={drawerProps}
						setSearchTerm={setSearchTerm}
						searchTerm={searchTerm}
					/>
					{(getRequestItems.isLoading || getRequestItems.isIdle) && <LoadingSpinner />}
					{getRequestItems.isSuccess && (
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
							<BottomCheckButton
								acceptButtonIsActive={selectedItemAmount > 0}
								acceptButtonOnPress={acceptButtonOnPress}
							/>
						</>
					</BottomControlButtons>
				</>
	);
};

export default RequestListCreatorMain;

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
