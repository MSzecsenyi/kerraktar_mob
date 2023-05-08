import {
	Platform,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { COLORS } from "../../colors";
import NumberPicker from "./NumberPicker";
import { useEffect, useState } from "react";

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
	const [itemValue, setItemValue] = useState(selectedAmount);

	useEffect(() => {
		onValueChange(itemValue, 0);
	}, [itemValue]);

	return (
		<View style={styles.horizontal_flex}>
			{Platform.OS === "android" ? (
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
			) : (
				<NumberPicker
					setAmount={setItemValue}
					minInput={0}
					maxInput={maxAmount}
					value={selectedAmount}
				/>
			)}
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
		backgroundColor: COLORS.mainColor,
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
		backgroundColor: COLORS.white,
	},
	light_text: {
		color: COLORS.white,
	},
	picker: {
		width: 30,
	},
	pickerItem: {
		width: 70,
	},
});
