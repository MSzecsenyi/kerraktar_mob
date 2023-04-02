import { BackHandler, View } from "react-native";
import { useGetRequestItems } from "../../query-hooks/UseItems";
import { SetStateAction, useContext, useEffect, useReducer, useState } from "react";
import { DateRange, LoginDrawerProps } from "../../interfaces";
import { UserDataContext } from "../../contexts/UserDataContext";
import RequestListCreatorMain from "../organisms/RequestListCreatorMain";
import StoreSelector from "../organisms/StoreSelector";
import DateSelector from "../organisms/DateSelector";
import { requestItemReducer } from "../../contexts/RequestItemReducer";

const RequestListCreatorManager = (drawerProps: LoginDrawerProps) => {
    const stores = useContext(UserDataContext).loggedInUser.stores; // Necessary to get available stores
    const [dateRange, setDateRange] = useState<DateRange>({
        startDate: new Date(),
        endDate: new Date(),
    });
    const [dateIsSelected, setDateIsSelected] = useState(false);
    const [storeId, setStoreId] = useState(
        stores.length == 1 ? stores[0].store_id : -1
    );
    const [requestItems, dispatchRequestItems] = useReducer(requestItemReducer, []); // Mutates selected items

    const getRequestItems = useGetRequestItems(storeId, dateRange, dateIsSelected);

    useEffect(() => {
        const backAction = () => {
            drawerProps.navigation.navigate("RequestStack", {
                screen: "RequestSelectorScreen",
            });
            return true;
        };
        const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            backAction
        );
        return () => {
            backHandler.remove();
        };
    }, []);

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
                    drawerProps={drawerProps}
                />
            ) : !dateIsSelected ? (
                <DateSelector
                    dateRange={dateRange}
                    setDateRange={setDateRange}
                    setDateIsSelected={setDateIsSelected}
                    drawerProps={drawerProps}
                />
            ) : (
                <RequestListCreatorMain
                            requestItems={requestItems}
                            storeId={storeId} 
                            drawerProps={drawerProps}
                            dispatchRequestItems={dispatchRequestItems} 
                            getRequestItems={getRequestItems}
                            dateRange={dateRange}
                />
            )}
        </View>
    );
};

export default RequestListCreatorManager;
