import { View } from "react-native";
import { useGetItems } from "../../query-hooks/UseItems";
import { useContext, useEffect, useReducer, useState } from "react";
import { itemReducer } from "../../contexts/ItemReducer";
import { UserDataContext } from "../../contexts/UserDataContext";
import TakeOutListCreatorMain from "./TakeOutListCreatorMain";
import StoreSelector from "../organisms/StoreSelector";
import { DrawerScreenProps } from "@react-navigation/drawer";
import { CompositeScreenProps } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import {
    LoginDrawerParamList,
    TakeOutStackParams,
} from "../../navigation/ParamStacks";

export type TakeOutListCreatorManagerProps = CompositeScreenProps<
    NativeStackScreenProps<TakeOutStackParams, "TakeOutCreatorScreen">,
    DrawerScreenProps<LoginDrawerParamList>
>;

const TakeOutListCreatorManager = (
    navigationProps: TakeOutListCreatorManagerProps
) => {
    const stores = useContext(UserDataContext).loggedInUser.stores; // Necessary to get available stores
    const [storeId, setStoreId] = useState(
        stores.length == 1 ? stores[0].store_id : -1
    );
    const [items, dispatchItems] = useReducer(itemReducer, []); // Mutates selected items

    const getItems = useGetItems(storeId);

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
                    openDrawer={navigationProps.navigation.openDrawer}
                />
            ) : (
                <TakeOutListCreatorMain
                    items={items}
                    storeId={storeId}
                    navigationProps={navigationProps}
                    dispatchItems={dispatchItems}
                    getItems={getItems}
                    setStoreId={setStoreId}
                />
            )}
        </View>
    );
};

export default TakeOutListCreatorManager;
