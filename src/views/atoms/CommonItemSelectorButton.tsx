import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Picker } from "@react-native-picker/picker";

interface CommonItemSelectorButtonProps {
	maxAmount: number;
	selectedAmount: number;
	onPressDelete: () => void;
	onValueChange: (itemValue: number, itemIndex: number) => void;
}

const CommonItemSelectorButton = ({
	maxAmount,
	selectedAmount,
	onPressDelete,
	onValueChange,
}: CommonItemSelectorButtonProps) => {
	return (
		<View style={styles.horizontal_flex}>
			<View style={styles.selectedLeftSide}>
				<Text> {selectedAmount} </Text>
				{maxAmount > 1 && (
					<Picker
						selectedValue={selectedAmount}
						onValueChange={onValueChange}
						style={styles.picker}
						mode="dialog">
						{Array.from({ length: maxAmount }, (_, i) => i).map((value) => (
							<Picker.Item
								key={value + 1}
								label={(value + 1).toString()}
								value={value + 1}
								style={styles.pickerItem}
							/>
						))}
					</Picker>
				)}
			</View>
			<View>
				<TouchableOpacity
					onPress={onPressDelete}
					style={styles.discard_button}>
					<Text style={styles.light_text}>X</Text>
				</TouchableOpacity>
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
	picker: {
		width: 30,
	},
	pickerItem: {
		width: 70,
	},
});
