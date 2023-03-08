import { StyleSheet, Text, View } from "react-native";
import { Item } from "../../interfaces";
import { TouchableHighlight } from "react-native-gesture-handler";
import { useContext, useState } from "react";
import TakeOutCommonCheckbox from "../atoms/TakeOutCommonSelector";
import { TakeOutListContext } from "../../contexts/TakeOutListContext";

interface TakeOutCommonSelectorButtonProps {
	item: Item;
}

const TakeOutCommonSelectorButton = ({
	item,
}: TakeOutCommonSelectorButtonProps) => {
	const takeOutList = useContext(TakeOutListContext);
	let itemInList = takeOutList.state.items.find(
		(listItem) => listItem.id === item.id
	);

	// Activated by default if the item has already been added to the
	const [isActivated, setIsActivated] = useState<boolean>(
		itemInList ? true : false
	);
	const [savedSelectedAmount, setSavedSelectedAmount] = useState(1);

	return (
		<View>
			{/* ONLY ACTIVE IF THERE ARE ITEMS IN THE STORE */}
			{item.in_store_amount !== 0 ? (
				<View>
					{!isActivated ? (
						<TouchableHighlight
							onPress={() => {
								setIsActivated(true);

								takeOutList.dispatch({
									type: "ADD_ITEM",
									payload: { id: item.id, amount: savedSelectedAmount },
								});
							}}
							style={styles.active_add_button}
						>
							<Text style={styles.light_text}>Add</Text>
						</TouchableHighlight>
					) : (
						<View>
							<TakeOutCommonCheckbox
								setCBIsActive={setIsActivated}
								setSavedSelectedAmount={setSavedSelectedAmount}
								item={item}
							/>
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

export default TakeOutCommonSelectorButton;

const styles = StyleSheet.create({
	active_add_button: {
		width: 60,
		height: 40,
		backgroundColor: "green",
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
