import {
	FlatList,
	ListRenderItemInfo,
	StyleSheet,
	Text,
	TouchableWithoutFeedback,
	View,
} from "react-native";
import {
	useGetItemHistory,
	useGetUniqueItemHistory,
} from "../../query-hooks/UseItems";
import { COLORS } from "../../colors";
import LoadingSpinner from "../atoms/LoadingSpinner";
import { ItemHistoryData, TakeOut } from "../../interfaces";
import { useCallback } from "react";
import { displayDate } from "../../functions";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import EmptyList from "../atoms/EmptyList";

interface ItemHistoryListProps {
	itemId?: number;
	uniqueItemId?: number;
	visible: boolean;
}

const ItemHistoryList = ({
	itemId = -1,
	uniqueItemId = -1,
	visible,
}: ItemHistoryListProps) => {
	const getItemHistory =
		itemId !== -1
			? useGetItemHistory(itemId, visible)
			: useGetUniqueItemHistory(uniqueItemId, visible);

	const renderRow = useCallback(
		({ item }: ListRenderItemInfo<ItemHistoryData | TakeOut>) => {
			return (
				<TouchableWithoutFeedback>
					<View style={styles.history_data_container}>
						<View style={styles.title_row}>
							<Text style={styles.card_title}>{item.user}</Text>
							<Text>{item.take_out_name}</Text>
						</View>
						<View style={styles.info_row}>
							<Text>{displayDate(item.start_date)}</Text>
							<MaterialIcons
								name="arrow-right-alt"
								size={30}
								color={COLORS.border}
							/>
							<Text>
								{item.end_date ? displayDate(item.end_date) : `Még kint van`}
							</Text>
							{item.amount && (
								<>
									<Text>{item.amount} db</Text>
								</>
							)}
						</View>
					</View>
				</TouchableWithoutFeedback>
			);
		},
		[]
	);

	const keyExtractor = (historyData: ItemHistoryData | TakeOut) =>
		historyData.id.toString();

	return (
		<View>
			{visible && (
				<>
					{getItemHistory.isSuccess ? (
						<View style={styles.history_container}>
							<FlatList
								data={getItemHistory.data.sort((a, b) => b.id - a.id)}
								keyExtractor={keyExtractor}
								ItemSeparatorComponent={() => (
									<View
										style={{
											height: 1,
											backgroundColor: COLORS.inactive,
										}}
									/>
								)}
								renderItem={renderRow}
								ListEmptyComponent={
									<EmptyList text={"Még senki nem vette ki ezt az eszközt."} />
								}
							/>
						</View>
					) : (
						<LoadingSpinner />
					)}
				</>
			)}
		</View>
	);
};

export default ItemHistoryList;

const styles = StyleSheet.create({
	history_container: {
		borderColor: COLORS.border,
		borderTopWidth: 1,
		borderBottomWidth: 1,
	},
	history_data_container: {
		margin: 5,
		height: 45,
	},
	card_title: {
		fontSize: 18,
		fontWeight: "bold",
	},
	info_row: {
		flexDirection: "row",
		justifyContent: "space-around",
		alignItems: "center",
	},
	title_row: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
});
