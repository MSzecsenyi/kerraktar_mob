import { Picker } from "@react-native-picker/picker";
import { StyleSheet } from "react-native";
import { Item } from "../../interfaces";

interface AmountSelectorProps {
	selectedAmount: number;
	setSelectedAmount: React.Dispatch<React.SetStateAction<number>>;
	setSavedSelectedAmount: React.Dispatch<React.SetStateAction<number>>;
	item: Item;
}

export default function AmountSelector({
	item,
	selectedAmount,
	setSelectedAmount,
	setSavedSelectedAmount,
}: AmountSelectorProps) {
	return (
		<Picker
			selectedValue={selectedAmount}
			onValueChange={(itemValue) => {
				setSelectedAmount(itemValue);
				setSavedSelectedAmount(itemValue);
			}}
			style={styles.picker}
			mode="dropdown"
		>
			{Array.from({ length: item.in_store_amount }, (_, i) => i).map(
				(value) => (
					<Picker.Item
						key={value + 1}
						label={(value + 1).toString()}
						value={value + 1}
					/>
				)
			)}
		</Picker>
	);
}

const styles = StyleSheet.create({
	picker: {
		width: 35,
	},
});
