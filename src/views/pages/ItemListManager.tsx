import {
	View,
	BackHandler,
	ListRenderItemInfo,
	FlatList,
	RefreshControl,
} from "react-native";
import { useGetItems } from "../../query-hooks/UseItems";
import {
	useCallback,
	useContext,
	useEffect,
	useReducer,
	useRef,
	useState,
} from "react";
import { itemReducer } from "../../contexts/ItemReducer";
import { UserDataContext } from "../../contexts/UserDataContext";
import StoreSelector from "../organisms/StoreSelector";
import { DrawerScreenProps } from "@react-navigation/drawer";
import { CompositeScreenProps } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import {
	ItemStackParamList,
	LoginDrawerParamList,
} from "../../navigation/ParamStacks";
import LoadingSpinner from "../atoms/LoadingSpinner";
import HeaderWithSearchBar from "../molecules/HeaderWithSearchBar";
import { Item } from "../../interfaces";
import ItemTile from "../organisms/Tiles/ItemTile";
import BottomButtonContainer from "../atoms/bottomButtons/BottomButtonContainer";
import BottomCreateNewButton from "../atoms/bottomButtons/BottomCreateNewButton";
import DefaultModal from "../molecules/DefaultModal";
import ItemCreator from "./ItemCreator";
import WarningModalContent from "../organisms/WarningModalContent";

export type ItemSelectorProps = CompositeScreenProps<
	NativeStackScreenProps<ItemStackParamList, "ItemListScreen">,
	DrawerScreenProps<LoginDrawerParamList>
>;

const ItemSelector = (navigationProps: ItemSelectorProps) => {
	const stores = useContext(UserDataContext).loggedInUser.stores; // Necessary to get available stores
	const [storeId, _setStoreId] = useState(
		stores.length == 1 ? stores[0].store_id : -1
	);
	const [listIsRefreshing, setListIsRefreshing] = useState(false);
	const [filteredItems, setFilteredItems] = useState<Item[]>([]);
	const [searchTerm, setSearchTerm] = useState(""); // The text typed in the header search bar. SHown items are filtered by name based on this
	const [items, dispatchItems] = useReducer(itemReducer, []); // Mutates selected items
	const { loggedInUser } = useContext(UserDataContext);
	const [closeModalWarning, setCloseModalWarning] = useState(false);
	const [closeModalWarningVisible, setCloseModalWarningVisible] =
		useState(false);
	const storeName = loggedInUser.stores.find(
		(store) => store.store_id === storeId
	)?.address;

	//REFS
	const storeIdRef = useRef(storeId);
	const setStoreId = (data: number | ((prevState: number) => number)) => {
		if (typeof data === "function") {
			_setStoreId((prevState) => data(prevState));
		} else {
			storeIdRef.current = data;
			_setStoreId(data);
		}
	};

	const getItems = useGetItems(storeId);

	//EFFECTS
	useEffect(() => {
		if (getItems.isSuccess)
			dispatchItems({
				type: "CREATE_ITEMS",
				payload: { items: getItems.data },
			});
	}, [getItems.data]);

	useEffect(() => {
		const filtered = items.filter((item) => {
			return item.item_name.toLowerCase().includes(searchTerm.toLowerCase());
		});
		filtered.sort((a, b) => a.item_name.localeCompare(b.item_name));
		if (filtered) setFilteredItems(filtered);
	}, [searchTerm, items]);

	useEffect(() => {
		const backAction = () => {
			if (storeIdRef.current !== -1 && stores.length != 1) {
				setStoreId(-1);
			} else {
				navigationProps.navigation.goBack();
				backHandler.remove();
			}
			return true;
		};
		const backHandler = BackHandler.addEventListener(
			"hardwareBackPress",
			backAction
		);
	}, [storeIdRef.current]);

	//OTHER FUNCTIONS

	const renderRow = useCallback(({ item }: ListRenderItemInfo<Item>) => {
		return (
			<ItemTile
				item={item}
				dispatchItems={dispatchItems}
			/>
		);
	}, []);

	const keyExtractor = (item: Item) => item.id.toString();
	const [addModal, setAddModal] = useState(false);

	return (
		<View style={{ flex: 1 }}>
			{storeId === -1 ? (
				<StoreSelector
					stores={stores}
					setStoreId={setStoreId}
					openDrawer={navigationProps.navigation.openDrawer}
					title="Eszközök kezelése"
				/>
			) : (
				<>
					{/* MODALS */}
					<DefaultModal
						visible={addModal}
						closeFn={() => {
							console.log(closeModalWarning);
							closeModalWarning
								? setCloseModalWarningVisible(true)
								: setAddModal(false);
						}}>
						<ItemCreator
							storeId={storeId}
							setCloseModalWarning={(value) => setCloseModalWarning(value)}
						/>
					</DefaultModal>

					<DefaultModal
						visible={closeModalWarningVisible}
						closeFn={() => setCloseModalWarningVisible(false)}>
						<WarningModalContent
							closeModal={() => setCloseModalWarningVisible(false)}
							acceptModal={() => {
								setCloseModalWarning(false);
								setCloseModalWarningVisible(false);
								setAddModal(false);
							}}
						/>
					</DefaultModal>

					{/* PAGE CONTENT */}
					<HeaderWithSearchBar
						openDrawer={navigationProps.navigation.openDrawer}
						setSearchTerm={setSearchTerm}
						searchTerm={searchTerm}
						title={`Eszközök: ${storeName}`}
					/>
					{(getItems.isLoading || getItems.isIdle) && <LoadingSpinner />}
					{getItems.isSuccess && (
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
								refreshControl={
									<RefreshControl
										refreshing={listIsRefreshing}
										onRefresh={() => {
											setListIsRefreshing(true);
											getItems.refetch().then(() => {
												setListIsRefreshing(false);
											});
										}}
										colors={["green"]}
										tintColor={"green"}
									/>
								}
							/>
							{loggedInUser.user.is_storekeeper && (
								<BottomButtonContainer>
									<BottomCreateNewButton
										text="Eszköz hozzáadása"
										onPress={() => setAddModal(true)}
									/>
								</BottomButtonContainer>
							)}
						</>
					)}
				</>
			)}
		</View>
	);
};

export default ItemSelector;
