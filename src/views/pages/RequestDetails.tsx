import { BackHandler, Keyboard, ListRenderItemInfo } from "react-native";
import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import DefaultModal from "../molecules/DefaultModal";
import { RequestItem } from "../../interfaces";
import { FlatList } from "react-native-gesture-handler";
import LoadingSpinner from "../atoms/LoadingSpinner";
// import ItemFilterBar from "../organisms/ItemFilterBar";
import HeaderWithSearchBar from "../molecules/HeaderWithSearchBar";
import BottomControlButtons from "../organisms/BottomControlButtons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Feather from "react-native-vector-icons/Feather";
import { requestItemReducer } from "../../contexts/RequestItemReducer";
import RequestItemTile from "../organisms/Tiles/RequestItemTile";
import RequestAcceptList from "../organisms/RequestAcceptList";
import { useGetDetailedRequest } from "../../query-hooks/UseRequests";
import UnsavedListWarning from "../organisms/UnsavedListWarning";
import { DrawerScreenProps } from "@react-navigation/drawer";
import { CompositeScreenProps } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import isEqual from "lodash/isEqual";
import {
    RequestStackParamList,
    LoginDrawerParamList,
} from "../../navigation/ParamStacks";
import BottomUniversalButton from "../atoms/bottomButtons/BottomUniversalButton";

export type RequestDetailsProps = CompositeScreenProps<
    NativeStackScreenProps<RequestStackParamList, "RequestDetailsScreen">,
    DrawerScreenProps<LoginDrawerParamList>
>;

const RequestDetails = ({ navigation, route }: RequestDetailsProps) => {
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
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredItems, setFilteredItems] = useState<RequestItem[]>([]);
    const [changed, _setChanged] = useState(false);
    const [editMode, setEditMode] = useState(false);
    // const [requestList, setRequestList] = useState<RequestList>({
    // 	// Final accept data
    // 	items: [],
    // 	store_id: storeId,
    // 	request_name: "",
    // 	start_date: dateRange.startDate,
    // 	end_date: dateRange.endDate,
    // });
    const request = route.params.request;
    const getRequestItems = useGetDetailedRequest(request.id);

    const changedRef = useRef(changed);
    const setChanged = (data: boolean) => {
        changedRef.current = data;
        _setChanged(data);
    };
    //filtering data
    useEffect(() => {
        setChanged(!isEqual(requestItems, defaultItems));
        //filtering based on searchbar
        let filtered = requestItems.filter((item) => {
            return item.item_name
                .toLowerCase()
                .includes(searchTerm.toLowerCase());
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
        }
    }, [getRequestItems.data]);

    useEffect(() => {
        const kListener = Keyboard.addListener("keyboardDidHide", () => {
            Keyboard.dismiss();
        });
        const backAction = () => {
            if (changedRef.current) {
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
        return () => {
            kListener.remove();
            backHandler.remove();
        };
    }, []);

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
        // const selectedItems = requestItems
        // 	.filter((item) => item.is_selected)
        // 	.map((item) => ({
        // 		id: item.id,
        // 		amount: item.selected_amount,
        // 	}));

        // setRequestList((prev) => {
        // 	return {
        // 		...prev,
        // 		items: selectedItems,
        // 	};
        // });

        setAcceptModalIsVisible(changed ? true : false);
    };

    return (
        <>
            {/* MODALS */}
            <DefaultModal
                visible={warningModalIsVisible}
                closeFn={() => setWarningModalIsVisible(false)}>
                <UnsavedListWarning
                    acceptModal={() =>
                        navigation.navigate("RequestSelectorScreen")
                    }
                    closeModal={() => setWarningModalIsVisible(false)}
                />
            </DefaultModal>

            <DefaultModal
                visible={acceptModalIsVisible}
                closeFn={() => setAcceptModalIsVisible(false)}>
                <RequestAcceptList
                    items={requestItems
                        .filter((item) => item.is_selected)
                        .sort((a, b) => a.item_name.localeCompare(b.item_name))}
                    setModalIsVisible={setAcceptModalIsVisible}
                    onPressAccept={() => {}}
                />
            </DefaultModal>

            {/* PAGE CONTENT */}
            <HeaderWithSearchBar
                openDrawer={navigation.openDrawer}
                setSearchTerm={setSearchTerm}
                searchTerm={searchTerm}
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
            {getRequestItems.isSuccess && (
                <BottomControlButtons>
                    <>
                        <BottomUniversalButton //Enable / Disable edit
                            buttonOnPress={() => setEditMode((prev) => !prev)}>
                            <MaterialIcons
                                name={editMode ? "edit-off" : "edit"}
                                size={35}
                                color="white"
                            />
                        </BottomUniversalButton>
                        {editMode ? (
                            <BottomUniversalButton //Accept changes OR delete request
                                buttonIsActive={changed}
                                buttonOnPress={() => acceptButtonOnPress()}
                            />
                        ) : (
                            <>
                                <BottomUniversalButton //Accept changes OR delete request
                                    buttonColor="red"
                                    buttonOnPress={() => setEditMode(false)}>
                                    <Feather
                                        name={"trash-2"}
                                        size={35}
                                        color="white"
                                    />
                                </BottomUniversalButton>
                                {changed && (
                                    <BottomUniversalButton //Accept changes OR delete request
                                        buttonIsActive={changed}
                                        buttonOnPress={() =>
                                            acceptButtonOnPress()
                                        }
                                    />
                                )}
                            </>
                        )}
                    </>
                </BottomControlButtons>
            )}
        </>
    );
};

export default RequestDetails;
