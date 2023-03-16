import { View, Text, StyleSheet } from "react-native";
import { ItemButtonProps } from "../../../interfaces";
import TakeOutSelectItemButton from "../../molecules/TakeOutSelectItemButton";
import { memo } from "react";

const ItemTile = ({
	item,
	dispatchItems,
	setCameraIsActive,
}: ItemButtonProps) => {
	return (
		<View style={styles.card_template}>
			<View style={styles.info_part}>
				<View style={styles.info_row}>
					<Text style={styles.card_title}> {item.item_name} </Text>
					<Text> Store: {item.store} </Text>
					<Text> District: {item.district} </Text>
				</View>
				<View style={styles.info_row}>
					<Text> In store: {item.in_store_amount} </Text>
					<Text> Id: {item.id} </Text>
					<Text> U.pcs: {item.unique_items.length} </Text>
				</View>
			</View>
			<View style={styles.button_part}>
				<TakeOutSelectItemButton
					item={item}
					dispatchItems={dispatchItems}
					setCameraIsActive={setCameraIsActive}
				/>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	card_template: {
		padding: 10,
		margin: 5,
		height: 70,
		borderRadius: 15,
		borderColor: "black",
		borderWidth: 1,
		flex: 1,
		flexDirection: "row",
	},
	info_part: {
		flex: 0.7,
		justifyContent: "space-between",
	},
	info_row: {
		flexDirection: "row",
		justifyContent: "space-between",
	},
	card_title: {
		fontSize: 16,
		fontWeight: "bold",
	},
	button_part: {
		flex: 0.3,
		alignItems: "flex-end",
		justifyContent: "center",
	},
});

export default memo(ItemTile);
