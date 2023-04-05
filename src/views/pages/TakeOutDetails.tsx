import {
	FlatList,
	ListRenderItemInfo,
	StyleSheet,
	Text,
	View,
} from "react-native";
import { useGetDetailedTakeOut } from "../../query-hooks/UseTakeOuts";
import { TakenOutItem } from "../../interfaces";
import { useCallback, useEffect, useState } from "react";
import TakeOutDeatilsItemTile from "../organisms/Tiles/TakeOutDeatilsItemTile";
import HeaderWithSearchBar from "../molecules/HeaderWithSearchBar";
import BottomControlButtons from "../organisms/BottomControlButtons";
import DefaultModal from "../molecules/DefaultModal";
import ReturnTakeOutModalContent from "../molecules/ReturnTakeOutModalContent";
import BottomCheckButton from "../atoms/BottomCheckButton";
import { DrawerScreenProps } from "@react-navigation/drawer";
import { CompositeScreenProps } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { TakeOutStackParams, LoginDrawerParamList } from "../../navigation/ParamStacks";

export type TakeOutDetailsProps = CompositeScreenProps<
	NativeStackScreenProps<TakeOutStackParams, "TakeOutDetailsScreen">,
	DrawerScreenProps<LoginDrawerParamList>
>

const TakeOutDetails = ({navigation, route}: TakeOutDetailsProps) => {
	const [itemList, setItemList] = useState<TakenOutItem[]>([]);
	const [allItemsChecked, setAllItemsChecked] = useState(false);
	const [modalIsVisible, setModalIsVisible] = useState(false);
	const takeOut = route.params.takeOut;

	const getTakeOutItems = useGetDetailedTakeOut(takeOut.id);

	useEffect(() => {
		if (getTakeOutItems.isSuccess) setItemList(getTakeOutItems.data);
	}, [getTakeOutItems.data]);

	useEffect(() => {
		setAllItemsChecked(
			!itemList.some((listItem) => listItem.is_checked === false)
		);
	}, [itemList]);

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
				openDrawer={navigation.openDrawer}
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
					acceptOnPress={navigation.goBack}
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
