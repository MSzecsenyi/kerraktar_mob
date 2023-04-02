import { StyleSheet, Text, TouchableHighlight, View } from "react-native";
import CommonItemSelectorButton from "../atoms/CommonItemSelectorButton";
import { RequestItemButtonProps } from "../../interfaces";

const RequestSelectItemButton = ({
	item,
	dispatchRequestItems,
}: RequestItemButtonProps) => {
	return (
				<View>
					{item.is_selected ? (
						<View>
								<CommonItemSelectorButton
									maxAmount={item.amount}
									selectedAmount={item.selected_amount}
									onValueChange={(itemValue: number) =>
										dispatchRequestItems({
											type: "MODIFY_ITEM",
											payload: { id: item.id, amount: itemValue },
										})}
									onPressDelete={() => {
										dispatchRequestItems({ type: "DELETE_ITEM", payload: { id: item.id } });
									}}
								/>
						</View>
					) : (
						<TouchableHighlight
							style={styles.active_add_button}
							onPress={() => {
									console.log(item)
									dispatchRequestItems({
											type: "ADD_ITEM",
											payload: { id: item.id },
									  });
							}}
						>
							<Text style={styles.light_text}>Add</Text>
						</TouchableHighlight>
					)}
				</View>
	);
};

export default RequestSelectItemButton;

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
