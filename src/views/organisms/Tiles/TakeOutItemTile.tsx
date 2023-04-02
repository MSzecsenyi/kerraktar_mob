import { View, StyleSheet, Text } from "react-native";
import { TakeOutItemButtonProps } from "../../../interfaces";
import TakeOutSelectItemButton from "../../molecules/TakeOutSelectItemButton";
import { memo } from "react";

const TakeOutItemTile = ({
	item,
	dispatchItems,
	setCameraIsActive,
}: TakeOutItemButtonProps) => {
	return (
		<View style={styles.card_template}>
			<View style={styles.info_part}>
				<View style={styles.info_row}>
					<Text style={styles.card_title}> {item.item_name} </Text>
				</View>
				<View style={styles.info_row}>
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
	button_part: {
		flex: 0.3,
		alignItems: "flex-end",
		justifyContent: "center",
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
});

export default memo(TakeOutItemTile);