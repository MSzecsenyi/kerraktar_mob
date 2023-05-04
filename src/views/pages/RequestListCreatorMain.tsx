import { BackHandler, Keyboard, ListRenderItemInfo } from "react-native";
import { useCallback, useEffect, useRef, useState } from "react";
import DefaultModal from "../molecules/DefaultModal";
import { RequestItem, RequestList, StringDateRange } from "../../interfaces";
import { FlatList } from "react-native-gesture-handler";
import LoadingSpinner from "../atoms/LoadingSpinner";
// import ItemFilterBar from "../organisms/ItemFilterBar";
import { UseQueryResult } from "react-query";
import HeaderWithSearchBar from "../molecules/HeaderWithSearchBar";
import { RequestItemAction } from "../../contexts/RequestItemReducer";
import RequestItemTile from "../organisms/Tiles/RequestItemTile";
import RequestAcceptList from "../organisms/ModalContents/RequestAcceptList";
import { usePostRequest } from "../../query-hooks/UseRequests";
import WarningModalContent from "../organisms/ModalContents/WarningModalContent";
import { RequestListCreatorManagerNavigationProps } from "./RequestCreatorManager";
import BottomButton from "../atoms/bottomButtons/BottomButton";
import BottomButtonContainer from "../atoms/bottomButtons/BottomButtonContainer";

interface RequestListCreatorMainProps {
	requestItems: RequestItem[];
	storeId: number;
	navigationProps: RequestListCreatorManagerNavigationProps;
	dispatchRequestItems: React.Dispatch<RequestItemAction>;
	getRequestItems: UseQueryResult<RequestItem[], unknown>;
	dateRange: StringDateRange;
}

const RequestListCreatorMain = ({
	requestItems,
	storeId,
	navigationProps,
	dispatchRequestItems,
	getRequestItems,
	dateRange,
}: RequestListCreatorMainProps) => {
	const [acceptModalIsVisible, setAcceptModalIsVisible] = useState(false); // Decides wether the final accept modal is displayed
	const [warningModalIsVisible, setWarningModalIsVisible] = useState(false); // Decides wether the final accept modal is displayed
	const [searchTerm, setSearchTerm] = useState(""); // The text typed in the header search bar. SHown items are filtered by name based on this
	const [filteredItems, setFilteredItems] = useState<RequestItem[]>([]); // Displayed data
	const [selectedItemAmount, _setSelectedItemAmount] = useState(0); // Counts selected items
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
		navigationProps,
	}); // Sends finalized data to the server

	const selectedItemAmountRef = useRef(selectedItemAmount);
	const setSelectedItemAmount = (data: number) => {
		selectedItemAmountRef.current = data;
		_setSelectedItemAmount(data);
	};

	useEffect(() => {
		setSelectedItemAmount(
			requestItems.filter((item) => item.is_selected).length
		);
		const filtered = requestItems.filter((item) => {
			return item.item_name.toLowerCase().includes(searchTerm.toLowerCase());
		});
		filtered.sort((a, b) => a.item_name.localeCompare(b.item_name));
		if (filtered) setFilteredItems(filtered);
	}, [searchTerm, requestItems]);

	useEffect(() => {
		const kListener = Keyboard.addListener("keyboardDidHide", () => {
			Keyboard.dismiss();
		});
		const backAction = () => {
			if (selectedItemAmountRef.current > 0) {
				setWarningModalIsVisible(true);
			} else {
				navigationProps.navigation.navigate("RequestSelectorScreen");
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

	const renderRow = useCallback(({ item }: ListRenderItemInfo<RequestItem>) => {
		return (
			<RequestItemTile
				item={item}
				dispatchRequestItems={dispatchRequestItems}
			/>
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

		setAcceptModalIsVisible(true);
	};

	return (
		<>
			{/* MODALS */}
			<DefaultModal // Warning modal
				visible={warningModalIsVisible}
				closeFn={() => setWarningModalIsVisible(false)}>
				<WarningModalContent
					acceptModal={() =>
						navigationProps.navigation.navigate("RequestSelectorScreen")
					}
					closeModal={() => setWarningModalIsVisible(false)}
				/>
			</DefaultModal>

			<DefaultModal // Accept modal
				visible={acceptModalIsVisible}
				closeFn={() => setAcceptModalIsVisible(false)}>
				<RequestAcceptList
					items={requestItems
						.filter((item) => item.is_selected)
						.sort((a, b) => a.item_name.localeCompare(b.item_name))}
					listName={requestList.request_name}
					setModalIsVisible={setAcceptModalIsVisible}
					onChangeText={(text: string) =>
						setRequestList((prev) => {
							return { ...prev, request_name: text };
						})
					}
					onPressAccept={() => postRequest.mutate()}
				/>
			</DefaultModal>

			{/* PAGE CONTENT */}
			<HeaderWithSearchBar
				openDrawer={() => navigationProps.navigation.openDrawer()}
				setSearchTerm={setSearchTerm}
				searchTerm={searchTerm}
				title="Új foglalás"
			/>
			{(getRequestItems.isLoading || getRequestItems.isIdle) && (
				<LoadingSpinner />
			)}
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
			<BottomButtonContainer>
				<BottomButton //Accept changes
					buttonIsActive={selectedItemAmount > 0}
					buttonOnPress={acceptButtonOnPress}
				/>
			</BottomButtonContainer>
		</>
	);
};

export default RequestListCreatorMain;
