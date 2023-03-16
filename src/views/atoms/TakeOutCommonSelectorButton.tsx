import { StyleSheet, Text, TouchableHighlight, View } from "react-native";
import { ItemButtonProps } from "../../interfaces";
import AmountSelector from "./AmountSelector";

const TakeOutCommonSelectorButton = ({
	item,
	dispatchItems,
}: ItemButtonProps) => {
	return (
		<View style={styles.horizontal_flex}>
			<Text> {item.selected_amount} </Text>
			<View>
				{item.in_store_amount > 1 ? (
					<AmountSelector
						item={item}
						dispatchItems={dispatchItems}
					/>
				) : (
					<View style={{ width: 35 }} />
				)}
			</View>
			<View>
				<TouchableHighlight
					onPress={() => {
						dispatchItems({ type: "DELETE_ITEM", payload: { id: item.id } });
					}}
					style={styles.discard_button}
				>
					<Text style={styles.light_text}>X</Text>
				</TouchableHighlight>
			</View>
		</View>
	);
};

export default TakeOutCommonSelectorButton;

const styles = StyleSheet.create({
	horizontal_flex: {
		flexDirection: "row",
		alignItems: "center",
	},
	discard_button: {
		width: 30,
		height: 30,
		backgroundColor: "red",
		borderRadius: 50,
		alignItems: "center",
		justifyContent: "center",
	},
	light_text: {
		color: "white",
	},
});
