import { StyleSheet, Text, View } from "react-native";
import { Item } from "../../interfaces";
import { TouchableHighlight } from "react-native-gesture-handler";
import { useState } from "react";

interface TakeOutCommonCheckboxProps {
	setCBIsActive: React.Dispatch<React.SetStateAction<boolean>>;
	item: Item;
}

export default function TakeOutCommonCheckbox({
	setCBIsActive,
	item,
}: TakeOutCommonCheckboxProps) {
	const [isFinalised, setIsFinalised] = useState(false);

	return (
		<TouchableHighlight
			onPress={() => {
				setCBIsActive(false);
				setIsFinalised(false);
			}}
			style={styles.active_add_button}
		>
			<Text style={styles.light_text}>common</Text>
		</TouchableHighlight>
	);
}

const styles = StyleSheet.create({
	active_add_button: {
		width: 60,
		height: 40,
		backgroundColor: "red",
		borderRadius: 40,
		alignItems: "center",
		justifyContent: "center",
	},
	inactive_add_button: {
		width: 60,
		height: 40,
		backgroundColor: "gainsboro",
		borderRadius: 40,
		alignItems: "center",
		justifyContent: "center",
	},
	light_text: {
		color: "white",
	},
});
