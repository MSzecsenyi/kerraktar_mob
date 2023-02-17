import { StyleSheet, Text, View } from "react-native";
import { Item } from "../../interfaces";
import { TouchableHighlight } from "react-native-gesture-handler";
import { useContext } from "react";
import { TakeOutListContext } from "../../contexts/TakeOutListContext";

interface TakeOutUniqueSelectorProps {
	setIsActive: React.Dispatch<React.SetStateAction<boolean>>;
	item: Item;
}

export default function TakeOutUniqueSelector({
	setIsActive,
	item,
}: TakeOutUniqueSelectorProps) {
	const takeOutList = useContext(TakeOutListContext);
	let itemInList = takeOutList.state.uniqueItems.find(
		(listItem) => listItem.item_id === item.id
	);

	return (
		<View style={styles.horizontal_flex}>
			<Text>{itemInList?.unique_items.length}</Text>
			<TouchableHighlight
				onPress={() => {
					setIsActive(false);
					takeOutList.dispatch({
						type: "DELETE_UNIQUE_ITEM",
						payload: item.id,
					});
				}}
				style={styles.discard_button}
			>
				<Text style={styles.light_text}>X</Text>
			</TouchableHighlight>
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
