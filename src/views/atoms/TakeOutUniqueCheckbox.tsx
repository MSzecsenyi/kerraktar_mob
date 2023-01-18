import { StyleSheet, Text, View } from "react-native";
import { Item } from "../../interfaces";
import { TouchableHighlight } from "react-native-gesture-handler";

interface TakeOutUniqueCheckboxProps {
	setCBIsActive: React.Dispatch<React.SetStateAction<boolean>>;
	item: Item;
}

export default function TakeOutUniqueCheckbox({
	setCBIsActive,
	item,
}: TakeOutUniqueCheckboxProps) {
	return (
		<TouchableHighlight
			onPress={() => {
				setCBIsActive(true);
			}}
			style={styles.active_add_button}
		>
			<Text style={styles.light_text}>unique</Text>
		</TouchableHighlight>
	);
}

const styles = StyleSheet.create({
	active_add_button: {
		width: 60,
		height: 40,
		backgroundColor: "red",
		borderRadius: 10,
		alignItems: "center",
		justifyContent: "center",
	},
	inactive_add_button: {
		width: 60,
		height: 40,
		backgroundColor: "gainsboro",
		borderRadius: 10,
		alignItems: "center",
		justifyContent: "center",
	},
	light_text: {
		color: "white",
	},
});
