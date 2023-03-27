import { BackHandler, View } from "react-native";
import { useGetItems } from "../../query-hooks/UseItems";
import { useContext, useEffect, useReducer, useState } from "react";
import { DateRange, LoginDrawerProps } from "../../interfaces";
import { itemReducer } from "../../contexts/ItemReducer";
import { UserDataContext } from "../../contexts/UserDataContext";
import RequestListCreatorMain from "../organisms/RequestListCreatorMain";
import StoreSelector from "../organisms/StoreSelector";
import DateSelector from "../organisms/DateSelector";

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
    const [items, dispatchItems] = useReducer(itemReducer, []); // Mutates selected items

    const getItems = useGetItems(storeId);

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
        if (getItems.isSuccess)
            dispatchItems({
                type: "CREATE_ITEMS",
                payload: { items: getItems.data },
            });
    }, [getItems.data]);

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
                // items={items}
                // storeId={storeId}
                // drawerProps={drawerProps}
                // dispatchItems={dispatchItems}
                // getItems={getItems}
                // setStoreId={setStoreId}
                />
            )}
        </View>
    );
};

export default RequestListCreatorManager;
