import { Picker } from "@react-native-picker/picker";
import { StyleSheet } from "react-native";
import { Item, ItemButtonProps } from "../../interfaces";
import { useContext } from "react";
import { TakeOutListContext } from "../../contexts/TakeOutListContext";

export default function AmountSelector({
	item,
	dispatchItems,
}: ItemButtonProps) {
	return (
		<Picker
			selectedValue={item.selected_amount}
			onValueChange={(itemValue) =>
				dispatchItems({
					type: "MODIFY_ITEM",
					payload: { id: item.id, amount: itemValue },
				})
			}
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
