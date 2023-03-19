import {
	BackHandler,
	FlatList,
	ListRenderItemInfo,
	StyleSheet,
	Text,
	View,
} from "react-native";
import { useGetDetailedTakeOut } from "../../query-hooks/UseTakeOuts";
import { TakeOutButtonProps, TakenOutItem } from "../../interfaces";
import { useCallback, useEffect, useState } from "react";
import TakeOutDeatilsItemTile from "./Tiles/TakeOutDeatilsItemTile";
import HeaderWithSearchBar from "../pages/HeaderWithSearchBar";
import BottomControlButtons from "./BottomControlButtons";
import DefaultModal from "../molecules/DefaultModal";
import ReturnTakeOutModalContent from "../molecules/ReturnTakeOutModalContent";
import BottomCheckButton from "../atoms/BottomCheckButton";

const TakeOutDetails = ({
	takeOut,
	setChosenTakeOut,
	drawerProps,
}: TakeOutButtonProps) => {
	const [itemList, setItemList] = useState<TakenOutItem[]>([]);
	const [allItemsChecked, setAllItemsChecked] = useState(false);
	const [modalIsVisible, setModalIsVisible] = useState(false);

	const getTakeOutItems = useGetDetailedTakeOut(takeOut.id);

	useEffect(() => {
		if (getTakeOutItems.isSuccess) setItemList(getTakeOutItems.data);
	}, [getTakeOutItems.data]);

	useEffect(() => {
		setAllItemsChecked(
			!itemList.some((listItem) => listItem.is_checked === false)
		);
	}, [itemList]);

	useEffect(() => {
		const backAction = () => {
			setChosenTakeOut(-1);
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
			<HeaderWithSearchBar
				drawerProps={drawerProps}
				title={takeOut.take_out_name}
			/>
			<Text style={styles.headerInfoText}>Kivett eszközök:</Text>
			<FlatList
				data={itemList}
				style={{ flex: 1 }}
				keyExtractor={keyExtractor}
				renderItem={renderRow}
				extraData={setItemList}
			/>
			<BottomControlButtons>
				<BottomCheckButton
					acceptButtonIsActive={allItemsChecked}
					acceptButtonOnPress={() => setModalIsVisible(true)}
				/>
			</BottomControlButtons>
			<DefaultModal
				visible={modalIsVisible}
				closeFn={() => setModalIsVisible(false)}
			>
				<ReturnTakeOutModalContent
					closeFn={() => setModalIsVisible(false)}
					takeOutId={takeOut.id}
					setChosenTakeOut={setChosenTakeOut}
				/>
			</DefaultModal>
		</View>
	);
};

export default TakeOutDetails;

const styles = StyleSheet.create({
	headerInfoText: {
		paddingHorizontal: 20,
		paddingBottom: 3,
		fontSize: 16,
	},
});
