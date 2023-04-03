import {
	BackHandler,
	Keyboard,
	ListRenderItemInfo,
	StyleSheet,
} from "react-native";
import { useCallback, useEffect, useState } from "react";
import DefaultModal from "../molecules/DefaultModal";
import { LoginDrawerProps, RequestItem, RequestList, StringDateRange } from "../../interfaces";
import { FlatList } from "react-native-gesture-handler";
import LoadingSpinner from "../atoms/LoadingSpinner";
// import ItemFilterBar from "../organisms/ItemFilterBar";
import { UseQueryResult } from "react-query";
import HeaderWithSearchBar from "../pages/HeaderWithSearchBar";
import BottomControlButtons from "./BottomControlButtons";
import BottomCheckButton from "../atoms/BottomCheckButton";
import { RequestItemAction } from "../../contexts/RequestItemReducer";
import RequestItemTile from "./Tiles/RequestItemTile";
import RequestAcceptList from "./RequestAcceptList";
import { usePostRequest } from "../../query-hooks/UseRequests";

interface RequestListCreatorMainProps {
	requestItems: RequestItem[];
	storeId: number;
	drawerProps: LoginDrawerProps;
	dispatchRequestItems: React.Dispatch<RequestItemAction>;
	getRequestItems: UseQueryResult<RequestItem[], unknown>;
	dateRange: StringDateRange
}

const RequestListCreatorMain = ({
	requestItems,
	storeId,
	drawerProps,
	dispatchRequestItems,
	getRequestItems,
	dateRange
}: RequestListCreatorMainProps) => {
	const [modalIsVisible, setModalIsVisible] = useState(false); // Decides wether the final accept modal is displayed
	const [searchTerm, setSearchTerm] = useState(""); // The text typed in the header search bar. SHown items are filtered by name based on this
	const [filteredItems, setFilteredItems] = useState<RequestItem[]>([]); // Displayed data
	const [selectedItemAmount, setSelectedItemAmount] = useState(0); // Counts selected items
	const [requestList, setRequestList] = useState<RequestList>({
		// Final accept data
		items: [],
		store_id: storeId,
		request_name: "",
		start_date: dateRange.startDate,
		end_date: dateRange.endDate,
	});

	const postRequest = usePostRequest({
		requestList,
		drawerProps,
	}); // Sends finalized data to the server

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
		const selectedItems = requestItems
			.filter((item) => item.is_selected)
			.map((item) => ({
				id: item.id,
				amount: item.selected_amount,
			}));

		setRequestList((prev) => {
			return {
				...prev,
				items: selectedItems,
			};
		});

		setModalIsVisible(selectedItemAmount > 0 ? true : false);
	};

	return (
				<>
					<DefaultModal
						visible={modalIsVisible}
						closeFn={() => setModalIsVisible(false)}
					>
						<RequestAcceptList 
							items={requestItems
								.filter((item) => item.is_selected)
								.sort((a, b) => a.item_name.localeCompare(b.item_name))} 
							listName={requestList.request_name}
							setModalIsVisible={setModalIsVisible}
							onChangeText={(text: string) =>
								setRequestList((prev) => {
									return { ...prev, request_name: text };
								})} 
							postRequest={postRequest} />
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
