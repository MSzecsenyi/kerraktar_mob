import { View, StyleSheet, Text } from "react-native";
import TakeOutSelectItemButton from "../../molecules/TakeOutSelectItemButton";
import { memo } from "react";
import { Item } from "../../../interfaces";
import { TakeOutItemAction } from "../../../contexts/ItemReducer";
export interface TakeOutItemTileProps {
	item: Item;
	dispatchItems: React.Dispatch<TakeOutItemAction>;
	setCameraIsActive: React.Dispatch<React.SetStateAction<boolean>>;
}

const TakeOutItemTile = ({
	item,
	dispatchItems,
	setCameraIsActive,
}: TakeOutItemTileProps) => {
	return (
		<View style={styles.card_template}>
			<View style={styles.info_part}>
				<View style={styles.title_row}>
					<Text style={styles.card_title}> {item.item_name} </Text>
				</View>
				<View style={styles.info_row}>
					<Text> Raktáron összesen: {item.in_store_amount} </Text>
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
	title_row: {
		paddingLeft: 10,
		flexDirection: "row",
		justifyContent: "space-between",
	},
	info_row: {
		flexDirection: "row",
		justifyContent: "flex-end",
	},
	card_title: {
		fontSize: 16,
		fontWeight: "bold",
	},
});

export default memo(TakeOutItemTile);
