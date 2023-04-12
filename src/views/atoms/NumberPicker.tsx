import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface NumberPickerProps {
	setAmount: React.Dispatch<React.SetStateAction<number>>;
	minInput: number;
	maxInput: number;
	value: number;
}

const NumberPicker = ({
	setAmount,
	minInput,
	maxInput,
	value,
}: NumberPickerProps) => {
	return (
		<View style={styles.rowContainer}>
			<TouchableOpacity
				onPress={() =>
					value <= (minInput !== 0 ? minInput : 1)
						? 1
						: setAmount((prev) => prev - 1)
				}>
				<Ionicons
					name="chevron-back"
					size={30}
					color={
						value <= (minInput !== 0 ? minInput : 1) ? "lightgray" : "green"
					}
				/>
			</TouchableOpacity>
			<TextInput
				style={styles.amountInput}
				maxLength={3}
				textAlign="center"
				value={value.toString()}
				onChangeText={(inputString) => {
					const input = parseInt(inputString);
					(isNaN(input) || input < minInput) && setAmount(minInput);
					input > maxInput && setAmount(maxInput);
					minInput <= input && input <= maxInput && setAmount(input);
				}}
				keyboardType="numeric"
			/>
			<TouchableOpacity
				onPress={() =>
					value === maxInput ? 1 : setAmount((prev) => prev + 1)
				}>
				<Ionicons
					name="chevron-forward"
					size={30}
					color={value === maxInput ? "lightgray" : "green"}
				/>
			</TouchableOpacity>
		</View>
	);
};

export default NumberPicker;

const styles = StyleSheet.create({
	rowContainer: {
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
	},
	amountInput: {
		fontSize: 20,
		height: 40,
		borderBottomColor: "gray",
		borderBottomWidth: 1,
		width: 40,
	},
});
