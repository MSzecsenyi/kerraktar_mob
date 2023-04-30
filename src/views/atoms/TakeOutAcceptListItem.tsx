import {
	ListRenderItemInfo,
	StyleSheet,
	Text,
	View,
	TouchableWithoutFeedback,
} from "react-native";
import { Item } from "../../interfaces";
import { COLORS } from "../../colors";

interface TakeOutAcceptListItemProps {
	ListItemData: ListRenderItemInfo<Item>;
}

const TakeOutAcceptListItem = ({
	ListItemData,
}: TakeOutAcceptListItemProps) => {
	const item = ListItemData.item;
	return (
		<TouchableWithoutFeedback>
			<View
				style={
					ListItemData.index % 2 == 0
						? styles.itemContainerEven
						: styles.itemContainerOdd
				}>
				<View style={styles.mainNameContainter}>
					<Text>{item.item_name}</Text>
					<Text>{item.selected_amount}</Text>
				</View>

				{item.unique_items.map((uniqueItem) => {
					if (item.selected_unique_items.includes(uniqueItem.uuid)) {
						return (
							<Text
								key={
									uniqueItem.uuid
								}>{`        -   ${uniqueItem.alt_name}`}</Text>
						);
					}
				})}
			</View>
		</TouchableWithoutFeedback>
	);
};

export default TakeOutAcceptListItem;

const styles = StyleSheet.create({
	itemContainerEven: {
		paddingHorizontal: 5,
	},
	itemContainerOdd: {
		paddingHorizontal: 5,
		backgroundColor: COLORS.secondaryColor,
	},
	mainNameContainter: {
		flexDirection: "row",
		justifyContent: "space-between",
	},
});
