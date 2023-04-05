import { BackHandler, View } from "react-native";
import { useGetRequestItems } from "../../query-hooks/UseItems";
import { useContext, useEffect, useReducer, useState } from "react";
import { UserDataContext } from "../../contexts/UserDataContext";
import RequestListCreatorMain from "../organisms/RequestListCreatorMain";
import StoreSelector from "../organisms/StoreSelector";
import DateSelector from "../organisms/DateSelector";
import { requestItemReducer } from "../../contexts/RequestItemReducer";
import { DrawerScreenProps } from "@react-navigation/drawer";
import { CompositeScreenProps } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RequestStackParamList, LoginDrawerParamList } from "../../navigation/ParamStacks";

export type RequestListCreatorManagerNavigationProps = CompositeScreenProps<
	NativeStackScreenProps<RequestStackParamList, "RequestCreatorScreen">,
	DrawerScreenProps<LoginDrawerParamList>
>

const RequestListCreatorManager = (navigationProps:RequestListCreatorManagerNavigationProps) => {
    const stores = useContext(UserDataContext).loggedInUser.stores; // Necessary to get available stores
    const [dateRange, setDateRange] = useState({
        startDate: "",
        endDate: "",
    });
    const [dateIsSelected, setDateIsSelected] = useState(false);
    const [storeId, setStoreId] = useState(
        stores.length == 1 ? stores[0].store_id : -1
    );
    const [requestItems, dispatchRequestItems] = useReducer(requestItemReducer, []); // Mutates selected items

    const getRequestItems = useGetRequestItems(storeId, dateRange, dateIsSelected);

    useEffect(() => {
        if (getRequestItems.isSuccess)
            dispatchRequestItems({
                type: "CREATE_ITEMS",
                payload: { items: getRequestItems.data },
            });
    }, [getRequestItems.data]);

    return (
        <View style={{ flex: 1 }}>
            {storeId === -1 ? (
                <StoreSelector
                    stores={stores}
                    setStoreId={setStoreId}
                    openDrawer={() => navigationProps.navigation.openDrawer()}
                />
            ) : !dateIsSelected ? (
                <DateSelector
                    stringDateRange={dateRange}
                    setStringDateRange={setDateRange}
                    setDateIsSelected={setDateIsSelected}
                    openDrawer={() => navigationProps.navigation.openDrawer()}
                />
            ) : (
                <RequestListCreatorMain
                            requestItems={requestItems}
                            storeId={storeId} 
                            navigationProps={navigationProps}
                            dispatchRequestItems={dispatchRequestItems} 
                            getRequestItems={getRequestItems}
                            dateRange={dateRange}
                />
            )}
        </View>
    );
};

export default RequestListCreatorManager;
