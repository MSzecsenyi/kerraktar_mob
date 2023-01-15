import { View, Text, StyleSheet } from "react-native";
import { Item } from "../../interfaces";
import { TouchableHighlight } from "react-native-gesture-handler";
import TakeOutSelectorCheckbox from "../molecules/TakeOutSelectorCheckbox";

interface ItemProps {
	item: Item;
}

const ItemTile = ({ item }: ItemProps) => {
	return (
		<View style={styles.card_template}>
			<View style={styles.info_part}>
				<View style={styles.info_row}>
					<Text style={styles.card_title}> {item.item_name} </Text>
					<Text> District: {item.district} </Text>
				</View>
				<View style={styles.info_row}>
					<Text> In store: {item.in_store_amount} </Text>
					<Text> Unique: {item.is_unique ? "True" : "False"} </Text>
				</View>
			</View>
			<View style={styles.button_part}>
				<TouchableHighlight>
					<TakeOutSelectorCheckbox item={item} />
				</TouchableHighlight>
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
		flex: 1,
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

export default ItemTile;
