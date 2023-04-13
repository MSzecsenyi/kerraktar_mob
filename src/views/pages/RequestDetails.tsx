import { BackHandler, Keyboard, ListRenderItemInfo } from "react-native";
import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import DefaultModal from "../molecules/DefaultModal";
import { AcceptListCommonItem, RequestItem } from "../../interfaces";
import { FlatList } from "react-native-gesture-handler";
import LoadingSpinner from "../atoms/LoadingSpinner";
// import ItemFilterBar from "../organisms/ItemFilterBar";
import HeaderWithSearchBar from "../molecules/HeaderWithSearchBar";
import BottomButtonContainer from "../atoms/bottomButtons/BottomButtonContainer";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Feather from "react-native-vector-icons/Feather";
import { requestItemReducer } from "../../contexts/RequestItemReducer";
import RequestItemTile from "../organisms/Tiles/RequestItemTile";
import RequestAcceptList from "../organisms/ModalContents/RequestAcceptList";
import {
	useDeleteRequest,
	useGetDetailedRequest,
	useUpdateRequest,
} from "../../query-hooks/UseRequests";
import WarningModalContent from "../organisms/ModalContents/WarningModalContent";
import { DrawerScreenProps } from "@react-navigation/drawer";
import { CompositeScreenProps } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import isEqual from "lodash/isEqual";
import {
	RequestStackParamList,
	LoginDrawerParamList,
} from "../../navigation/ParamStacks";
import BottomButton from "../atoms/bottomButtons/BottomButton";
import EmptyList from "../atoms/EmptyList";

export type RequestDetailsProps = CompositeScreenProps<
	NativeStackScreenProps<RequestStackParamList, "RequestDetailsScreen">,
	DrawerScreenProps<LoginDrawerParamList>
>;

const RequestDetails = ({ navigation, route }: RequestDetailsProps) => {
	//GENERAL CONSTS
	const [requestItems, dispatchRequestItems] = useReducer(
		requestItemReducer,
		[]
	);
	const [defaultItems, dispatchDefaultItems] = useReducer(
		requestItemReducer,
		[]
	);
	const [acceptModalIsVisible, setAcceptModalIsVisible] = useState(false);
	const [warningModalIsVisible, setWarningModalIsVisible] = useState(false);
	const [deleteModalIsVisible, setDeleteModalIsVisible] = useState(false);
	const [searchTerm, setSearchTerm] = useState("");
	const [filteredItems, setFilteredItems] = useState<RequestItem[]>([]);
	const [changed, _setChanged] = useState(true);
	const [itemsSelected, _setItemsSelected] = useState(true);
	const [editMode, setEditMode] = useState(false);
	const [updatedRequestList, setUpdatedRequestList] = useState<
		AcceptListCommonItem[]
	>([]);
	const request = route.params.request;
	const defaultSelected = defaultItems
		.filter((item) => item.is_selected)
		.map((item) => item.id);

	//SERVER CONNECTIONS
	const getRequestItems = useGetDetailedRequest(request.id);
	const updateRequest = useUpdateRequest(
		request.id,
		() => navigation.goBack(),
		updatedRequestList
	);
	const deleteRequest = useDeleteRequest(request.id, () => navigation.goBack());

	//REFS
	const changedRef = useRef(changed);
	const setChanged = (data: boolean) => {
		changedRef.current = data;
		_setChanged(data);
	};
	const itemsSelectedRef = useRef(itemsSelected);
	const setItemsSelected = (data: boolean) => {
		itemsSelectedRef.current = data;
		_setItemsSelected(data);
	};

	//EFFECTS
	useEffect(() => {
		setChanged(!isEqual(requestItems, defaultItems));
		if (getRequestItems.isSuccess)
			setItemsSelected(
				requestItems.filter((item) => item.is_selected).length > 0
			);
		//filtering based on searchbar
		let filtered = requestItems.filter((item) => {
			return item.item_name.toLowerCase().includes(searchTerm.toLowerCase());
		});
		//sorting based on default selected state
		filtered = filtered.sort((a, b) => {
			if (
				defaultSelected.some((id) => id === a.id) &&
				!defaultSelected.some((id) => id === b.id)
			) {
				return -1;
			} else if (
				!defaultSelected.some((id) => id === a.id) &&
				defaultSelected.some((id) => id === b.id)
			) {
				return 1;
			} else {
				return 0;
			}
		});
		//filtering based on selected state
		if (!editMode) {
			filtered = filtered.filter((item) => {
				return item.is_selected;
			});
		}
		setFilteredItems(filtered);
	}, [searchTerm, requestItems, editMode]);

	useEffect(() => {
		if (getRequestItems.isSuccess) {
			dispatchRequestItems({
				type: "CREATE_ITEMS",
				payload: { items: getRequestItems.data },
			});
			dispatchDefaultItems({
				type: "CREATE_ITEMS",
				payload: { items: getRequestItems.data },
			});
			setChanged(false);
		}
	}, [getRequestItems.data]);

	useEffect(() => {
		const kListener = Keyboard.addListener("keyboardDidHide", () => {
			Keyboard.dismiss();
		});
		const backAction = () => {
			if (changedRef.current || !itemsSelectedRef.current) {
				setWarningModalIsVisible(true);
			} else {
				navigation.navigate("RequestSelectorScreen");
			}
			return true;
		};
		const backHandler = BackHandler.addEventListener(
			"hardwareBackPress",
			backAction
		);
		getRequestItems.refetch();
		return () => {
			kListener.remove();
			backHandler.remove();
		};
	}, []);

	//OTHER FUNCTIONS
	const renderRow = useCallback(
		({ item }: ListRenderItemInfo<RequestItem>) => {
			return (
				<RequestItemTile
					item={item}
					dispatchRequestItems={dispatchRequestItems}
					editable={editMode}
				/>
			);
		},
		[editMode]
	);

	const keyExtractor = (item: RequestItem) => item.id.toString();

	const acceptButtonOnPress = () => {
		const selectedItems = requestItems
			.filter((item) => item.is_selected)
			.map((item) => ({
				id: item.id,
				amount: item.selected_amount,
			}));

		setUpdatedRequestList(selectedItems);

		setAcceptModalIsVisible(true);
	};

	return (
		<>
			{/* MODALS */}
			<DefaultModal //Warning on backbutton press
				visible={warningModalIsVisible}
				closeFn={() => setWarningModalIsVisible(false)}>
				<WarningModalContent
					acceptModal={() => navigation.navigate("RequestSelectorScreen")}
					closeModal={() => setWarningModalIsVisible(false)}
				/>
			</DefaultModal>

			<DefaultModal //Info on updating the data
				visible={acceptModalIsVisible}
				closeFn={() => setAcceptModalIsVisible(false)}>
				<RequestAcceptList
					items={requestItems
						.filter((item) => item.is_selected)
						.sort((a, b) => a.item_name.localeCompare(b.item_name))}
					setModalIsVisible={setAcceptModalIsVisible}
					onPressAccept={() => updateRequest.mutate()}
				/>
			</DefaultModal>

			<DefaultModal //Warning before deleting the list
				visible={deleteModalIsVisible}
				closeFn={() => setDeleteModalIsVisible(false)}>
				<WarningModalContent
					acceptModal={() => deleteRequest.mutate()}
					closeModal={() => setDeleteModalIsVisible(false)}
					mainText="Biztosan törlöd a foglalást?"
					explainText="A művelet nem visszavonható!"
				/>
			</DefaultModal>

			{/* PAGE CONTENT */}
			<HeaderWithSearchBar
				openDrawer={navigation.openDrawer}
				setSearchTerm={setSearchTerm}
				searchTerm={searchTerm}
				title={`Foglalás: ${request.request_name}`}
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
						ListEmptyComponent={() => (
							<EmptyList text="Válassz ki legalább egy elemet!" />
						)}
					/>
				</>
			)}
			{getRequestItems.isSuccess && (
				<BottomButtonContainer>
					<>
						<BottomButton //Enable or disable edit
							buttonOnPress={() => setEditMode((prev) => !prev)}>
							<MaterialIcons
								name={editMode ? "edit-off" : "edit"}
								size={35}
								color="white"
							/>
						</BottomButton>
						{editMode ? (
							itemsSelected ? (
								<BottomButton //Accept changes
									buttonIsActive={changed}
									buttonOnPress={() => acceptButtonOnPress()}
								/>
							) : (
								<BottomButton //Delete request
									buttonColor="red"
									buttonOnPress={() => setDeleteModalIsVisible(true)}>
									<Feather
										name={"trash-2"}
										size={35}
										color="white"
									/>
								</BottomButton>
							)
						) : (
							<>
								<BottomButton //Delete request
									buttonColor="red"
									buttonOnPress={() => setDeleteModalIsVisible(true)}>
									<Feather
										name={"trash-2"}
										size={35}
										color="white"
									/>
								</BottomButton>

								{changed && (
									<BottomButton //Accept changes
										buttonIsActive={changed}
										buttonOnPress={() => acceptButtonOnPress()}
									/>
								)}
							</>
						)}
					</>
				</BottomButtonContainer>
			)}
		</>
	);
};

export default RequestDetails;
