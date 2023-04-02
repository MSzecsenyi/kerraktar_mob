import { StyleSheet, Text, TouchableHighlight, View } from "react-native";
import AmountSelector from "./AmountSelector";

interface CommonItemSelectorButtonProps {
	maxAmount:number
	selectedAmount: number
	onPressDelete: () => void
	onValueChange: ((itemValue: number, itemIndex: number) => void)
}

const CommonItemSelectorButton = (props: CommonItemSelectorButtonProps) => {
	return (
		<View style={styles.horizontal_flex}>
			<Text> {props.selectedAmount} </Text>
			<View>
				{props.maxAmount > 1 ? (
					<AmountSelector {...props}

					/>
				) : (
					<View style={{ width: 35 }} />
				)}
			</View>
			<View>
				<TouchableHighlight
					onPress={props.onPressDelete}
					style={styles.discard_button}
				>
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
