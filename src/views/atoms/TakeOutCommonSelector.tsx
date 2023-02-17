import { StyleSheet, Text, View } from "react-native";
import { Item } from "../../interfaces";
import { TouchableHighlight } from "react-native-gesture-handler";
import AmountSelector from "./AmountSelector";
import React, { useContext, useState } from "react";
import { TakeOutListContext } from "../../contexts/TakeOutListContext";

interface TakeOutCommonSelectorProps {
	setCBIsActive: React.Dispatch<React.SetStateAction<boolean>>;
	setSavedSelectedAmount: React.Dispatch<React.SetStateAction<number>>;
	item: Item;
}

const TakeOutCommonSelector = ({
	setCBIsActive,
	item,
	setSavedSelectedAmount,
}: TakeOutCommonSelectorProps) => {
	const takeOutList = useContext(TakeOutListContext);
	let itemInList = takeOutList.state.items.find(
		(listItem) => listItem.id === item.id
	);

	return (
		<View style={styles.horizontal_flex}>
			<Text> {itemInList?.amount} </Text>
			<View>
				{item.in_store_amount > 1 ? (
					<AmountSelector
						item={item}
						setSavedSelectedAmount={setSavedSelectedAmount}
					/>
				) : (
					<View style={{ width: 35 }} />
				)}
			</View>
			<View>
				<TouchableHighlight
					onPress={() => {
						setCBIsActive(false);
						takeOutList.dispatch({ type: "DELETE_ITEM", payload: item.id });
					}}
					style={styles.discard_button}
				>
					<Text style={styles.light_text}>X</Text>
				</TouchableHighlight>
			</View>
		</View>
	);
};

export default TakeOutCommonSelector;

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
