import {
	BackHandler,
	FlatList,
	Keyboard,
	ListRenderItemInfo,
	RefreshControl,
	View,
} from "react-native";
import { useGetDetailedTakeOut } from "../../query-hooks/UseTakeOuts";
import { TakenOutItem } from "../../interfaces";
import { useCallback, useEffect, useRef, useState } from "react";
import TakeOutDeatilsItemTile from "../organisms/Tiles/TakeOutDeatilsItemTile";
import HeaderWithSearchBar from "../molecules/HeaderWithSearchBar";
import DefaultModal from "../molecules/DefaultModal";
import ReturnTakeOutModalContent from "../organisms/ModalContents/ReturnTakeOutModalContent";
import { DrawerScreenProps } from "@react-navigation/drawer";
import { CompositeScreenProps } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import {
	TakeOutStackParams,
	LoginDrawerParamList,
} from "../../navigation/ParamStacks";
import WarningModalContent from "../organisms/ModalContents/WarningModalContent";
import BottomButton from "../atoms/bottomButtons/BottomButton";
import BottomButtonContainer from "../atoms/bottomButtons/BottomButtonContainer";
import EmptyList from "../atoms/EmptyList";
import { COLORS } from "../../colors";

export type TakeOutDetailsProps = CompositeScreenProps<
	NativeStackScreenProps<TakeOutStackParams, "TakeOutDetailsScreen">,
	DrawerScreenProps<LoginDrawerParamList>
>;

const TakeOutDetails = ({ navigation, route }: TakeOutDetailsProps) => {
	const [itemList, setItemList] = useState<TakenOutItem[]>([]);
	const [allItemsChecked, setAllItemsChecked] = useState(false);
	const [searchTerm, setSearchTerm] = useState("");
	const [filteredItems, setFilteredItems] = useState<TakenOutItem[]>([]);
	const [listIsRefreshing, setListIsRefreshing] = useState(false);
	const [acceptModalIsVisible, setAcceptModalIsVisible] = useState(false);
	const [warningModalIsVisible, setWarningModalIsVisible] = useState(false);
	const takeOut = route.params.takeOut;

	const getTakeOutItems = useGetDetailedTakeOut(takeOut.id);

	const haveItemsCheckedRef = useRef(false);
	const setHaveItemsChecked = (data: boolean) => {
		haveItemsCheckedRef.current = data;
	};

	useEffect(() => {
		if (getTakeOutItems.isSuccess) setItemList(getTakeOutItems.data);
	}, [getTakeOutItems.data]);

	useEffect(() => {
		setAllItemsChecked(
			!itemList.some((listItem) => listItem.is_checked === false)
		);
		setHaveItemsChecked(
			itemList.some((listItem) => listItem.is_checked === true)
		);
		const filtered = itemList.filter((item) => {
			return item.name.toLowerCase().includes(searchTerm.toLowerCase());
		});
		setFilteredItems(filtered);
	}, [itemList, searchTerm]);

	useEffect(() => {
		const kListener = Keyboard.addListener("keyboardDidHide", () => {
			Keyboard.dismiss();
		});
		const backAction = () => {
			if (haveItemsCheckedRef.current) {
				setWarningModalIsVisible(true);
			} else {
				navigation.navigate("TakeOutSelectorScreen");
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

	const toggleItemChecked = (itemId: number) => {
		setItemList((prev) =>
			prev.map((item) =>
				item.id === itemId ? { ...item, is_checked: !item.is_checked } : item
			)
		);
	};

	const renderRow = useCallback(
		({ item }: ListRenderItemInfo<TakenOutItem>) => {
			return (
				<TakeOutDeatilsItemTile
					item={item}
					toggleItemChecked={() => toggleItemChecked(item.id)}
					editable={takeOut.end_date ? false : true}
				/>
			);
		},
		[]
	);
	const keyExtractor = (item: TakenOutItem) => item.id.toString();

	return (
		<View style={{ flex: 1 }}>
			{/* MODALS */}
			<DefaultModal
				visible={warningModalIsVisible}
				closeFn={() => setWarningModalIsVisible(false)}>
				<WarningModalContent
					acceptModal={() => navigation.navigate("TakeOutSelectorScreen")}
					closeModal={() => setWarningModalIsVisible(false)}
					explainText="A lista módosításai nem lesznek elmentve!"
				/>
			</DefaultModal>

			<DefaultModal
				visible={acceptModalIsVisible}
				closeFn={() => setAcceptModalIsVisible(false)}>
				<ReturnTakeOutModalContent
					closeFn={() => setAcceptModalIsVisible(false)}
					takeOutId={takeOut.id}
					acceptOnPress={() => navigation.navigate("TakeOutSelectorScreen")}
				/>
			</DefaultModal>

			{/* PAGE CONTENT */}
			<HeaderWithSearchBar
				openDrawer={navigation.openDrawer}
				setSearchTerm={setSearchTerm}
				searchTerm={searchTerm}
				title={`Eszközök visszaadása: ${takeOut.take_out_name}`}
			/>
			<FlatList
				data={filteredItems}
				style={{ flex: 1 }}
				keyExtractor={keyExtractor}
				renderItem={renderRow}
				extraData={setItemList}
				ListEmptyComponent={() => <EmptyList />}
				refreshControl={
					<RefreshControl
						refreshing={listIsRefreshing}
						onRefresh={() => {
							setListIsRefreshing(true);
							getTakeOutItems.refetch().then(() => {
								setListIsRefreshing(false);
							});
						}}
						colors={[COLORS.mainColor]}
						tintColor={COLORS.mainColor}
					/>
				}
			/>
			{!takeOut.end_date && (
				<BottomButtonContainer>
					<BottomButton //Accept changes
						buttonIsActive={allItemsChecked}
						buttonOnPress={() => setAcceptModalIsVisible(true)}
					/>
				</BottomButtonContainer>
			)}
		</View>
	);
};

export default TakeOutDetails;
