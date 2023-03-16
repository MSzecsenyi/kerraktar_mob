import {
	FlatList,
	ListRenderItemInfo,
	StyleSheet,
	Text,
	View,
} from "react-native";
import { useGetDetailedTakeOut } from "../../query-hooks/UseTakeOuts";
import { TakeOutButtonProps, TakenOutItem } from "../../interfaces";
import { useCallback, useEffect, useState } from "react";

const TakeOutDetails = ({ takeOut }: TakeOutButtonProps) => {
	const [itemList, setItemList] = useState<TakenOutItem[]>([]);

	const getTakeOutItems = useGetDetailedTakeOut(takeOut.id);

	useEffect(() => {
		if (getTakeOutItems.isSuccess) setItemList(getTakeOutItems.data);
	}, [getTakeOutItems.data]);

	const renderRow = useCallback(
		({ item }: ListRenderItemInfo<TakenOutItem>) => {
			return <Text> {item.name} </Text>;
		},
		[]
	);

	const keyExtractor = (item: TakenOutItem) => item.id.toString();

	return (
		<View style={{ flex: 1 }}>
			<Text style={styles.mainTitle}> {takeOut.take_out_name} </Text>
			<FlatList
				data={getTakeOutItems.data}
				style={{ flex: 1 }}
				keyExtractor={keyExtractor}
				renderItem={renderRow}
			/>
			<Text>Visszavétel az összes eszköz ellenőrzése után lehetséges</Text>
		</View>
	);
};

export default TakeOutDetails;

const styles = StyleSheet.create({
	mainTitle: {
		fontWeight: "bold",
		textAlign: "center",
		fontSize: 18,
		paddingTop: 10,
	},
});
