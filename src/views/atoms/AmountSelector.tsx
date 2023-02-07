import { Picker } from "@react-native-picker/picker";
import { StyleSheet } from "react-native";
import { Item } from "../../interfaces";
import { useContext } from "react";
import { TakeOutListContext } from "../../contexts/TakeOutListContext";

interface AmountSelectorProps {
	setSavedSelectedAmount: React.Dispatch<React.SetStateAction<number>>;
	item: Item;
}

export default function AmountSelector({
	item,
	setSavedSelectedAmount,
}: AmountSelectorProps) {
	const takeOutList = useContext(TakeOutListContext);
	let itemInList = takeOutList.state.items.find(
		(listItem) => listItem.id === item.id
	);

	return (
		<Picker
			selectedValue={itemInList?.amount}
			onValueChange={(itemValue) => {
				takeOutList.dispatch({
					type: "MODIFY_ITEM",
					payload: { id: item.id, amount: itemValue },
				});
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
