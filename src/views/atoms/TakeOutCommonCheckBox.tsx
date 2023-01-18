import { StyleSheet, Text, View } from "react-native";
import { Item } from "../../interfaces";
import { TouchableHighlight } from "react-native-gesture-handler";
import AmountSelector from "./AmountSelector";
import { useState } from "react";

interface TakeOutCommonCheckboxProps {
	setCBIsActive: React.Dispatch<React.SetStateAction<boolean>>;
	selectedAmount: number;
	setSelectedAmount: React.Dispatch<React.SetStateAction<number>>;
	setSavedSelectedAmount: React.Dispatch<React.SetStateAction<number>>;
	item: Item;
}

export default function TakeOutCommonCheckbox({
	setCBIsActive,
	item,
	selectedAmount,
	setSelectedAmount,
	setSavedSelectedAmount,
}: TakeOutCommonCheckboxProps) {
	return (
		<View style={styles.horizontal_flex}>
			<Text> {selectedAmount} </Text>
			<View>
				{item.in_store_amount > 1 ? (
					<AmountSelector
						item={item}
						setSelectedAmount={setSelectedAmount}
						selectedAmount={selectedAmount}
						setSavedSelectedAmount={setSavedSelectedAmount}
					/>
				) : (
					<View style={{ width: 35 }} />
				)}
			</View>
			<View>
				<TouchableHighlight
					onPress={() => {
						setCBIsActive(false);
					}}
					style={styles.discard_button}
				>
					<Text style={styles.light_text}>X</Text>
				</TouchableHighlight>
			</View>
		</View>
	);
}

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
