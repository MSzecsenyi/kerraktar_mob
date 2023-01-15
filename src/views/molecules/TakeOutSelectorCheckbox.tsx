import { StyleSheet, Text, View } from "react-native";
import { Item } from "../../interfaces";
import { TouchableHighlight } from "react-native-gesture-handler";
import { useState } from "react";
import TakeOutCommonCheckbox from "../atoms/TakeOutCommonCheckBox";
import TakeOutUniqueCheckbox from "../atoms/TakeOutUniqueCheckbox";

interface TakeOutSelectorCheckboxProps {
	item: Item;
}

const TakeOutSelectorCheckbox = ({ item }: TakeOutSelectorCheckboxProps) => {
	const [isActivated, setIsActivated] = useState(false);

	return (
		<View>
			{/* ONLY ACTIVE IF THERE ARE ITEMS IN THE STORE */}
			{item.in_store_amount !== 0 ? (
				<View>
					{!isActivated ? (
						<TouchableHighlight
							onPress={() => {
								setIsActivated((prevState) => !prevState);
							}}
							style={styles.active_add_button}
						>
							<Text style={styles.light_text}>Add</Text>
						</TouchableHighlight>
					) : (
						<View>
							{/* ON BUTTON PRESS THE BUTTON TRANSFORMS BASED ON THE UNIQUENESS OF THE ITEM */}
							{item.is_unique ? (
								<TakeOutUniqueCheckbox
									setCBIsActive={setIsActivated}
									item={item}
								/>
							) : (
								<TakeOutCommonCheckbox
									setCBIsActive={setIsActivated}
									item={item}
								/>
							)}
						</View>
					)}
				</View>
			) : (
				<View style={styles.inactive_add_button}>
					<Text style={styles.light_text}>GOMB</Text>
				</View>
			)}
		</View>
	);
};

export default TakeOutSelectorCheckbox;

const styles = StyleSheet.create({
	active_add_button: {
		width: 60,
		height: 40,
		backgroundColor: "green",
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
