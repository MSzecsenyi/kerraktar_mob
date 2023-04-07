import { StyleSheet, Text, TouchableHighlight, View } from "react-native";
import AmountSelector from "./AmountSelector";

interface CommonItemSelectorButtonProps {
	maxAmount: number;
	selectedAmount: number;
	onPressDelete: () => void;
	onValueChange: (itemValue: number, itemIndex: number) => void;
}

const CommonItemSelectorButton = (props: CommonItemSelectorButtonProps) => {
	return (
		<View style={styles.horizontal_flex}>
			<View style={styles.selectedLeftSide}>
				<Text> {props.selectedAmount} </Text>
				{props.maxAmount > 1 && <AmountSelector {...props} />}
			</View>
			<View>
				<TouchableHighlight
					onPress={props.onPressDelete}
					style={styles.discard_button}>
					<Text style={styles.light_text}>X</Text>
				</TouchableHighlight>
			</View>
		</View>
	);
};

export default CommonItemSelectorButton;

const styles = StyleSheet.create({
	horizontal_flex: {
		flexDirection: "row",
		alignItems: "center",
	},
	discard_button: {
		width: 30,
		height: 40,
		backgroundColor: "green",
		borderTopRightRadius: 10,
		borderBottomRightRadius: 10,
		alignItems: "center",
		justifyContent: "center",
	},
	selectedLeftSide: {
		borderTopLeftRadius: 10,
		borderBottomLeftRadius: 10,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-evenly",
		height: 40,
		width: 50,
		backgroundColor: "white",
	},
	light_text: {
		color: "white",
	},
});
