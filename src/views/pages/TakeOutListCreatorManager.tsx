import { View } from "react-native";
import { useGetItems } from "../../query-hooks/UseItems";
import { useContext, useEffect, useReducer, useState } from "react";
import QRScanner from "../organisms/QRScanner";
import { TakeOutDrawerProps } from "../../interfaces";
import { itemReducer } from "../../contexts/ItemReducer";
import { UserDataContext } from "../../contexts/UserDataContext";
import TakeOutListCreatorMain from "../organisms/TakeOutListCreatorMain";
import StoreSelector from "../organisms/StoreSelector";

const TakeOutListCreatorManager = (drawerProps: TakeOutDrawerProps) => {
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
					drawerProps={drawerProps}
				/>
			) : (
				<TakeOutListCreatorMain
					items={items}
					storeId={storeId}
					drawerProps={drawerProps}
					dispatchItems={dispatchItems}
					getItems={getItems}
					setStoreId={setStoreId}
				/>
			)}
		</View>
	);
};

export default TakeOutListCreatorManager;
