import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import CommonItemSelectorButton from "../atoms/CommonItemSelectorButton";
import { RequestItem } from "../../interfaces";
import { RequestItemAction } from "../../contexts/RequestItemReducer";
import { COLORS } from "../../colors";
interface RequestSelectItemButtonProps {
	item: RequestItem;
	dispatchRequestItems: React.Dispatch<RequestItemAction>;
}

const RequestSelectItemButton = ({
	item,
	dispatchRequestItems,
}: RequestSelectItemButtonProps) => {
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
							})
						}
						onPressDelete={() => {
							dispatchRequestItems({
								type: "DELETE_ITEM",
								payload: { id: item.id },
							});
						}}
					/>
				</View>
			) : (
				<TouchableOpacity
					style={styles.active_add_button}
					onPress={() => {
						dispatchRequestItems({
							type: "ADD_ITEM",
							payload: { id: item.id },
						});
					}}>
					<Text style={styles.light_text}>Hozzáad</Text>
				</TouchableOpacity>
			)}
		</View>
	);
};

export default RequestSelectItemButton;

const styles = StyleSheet.create({
	active_add_button: {
		width: 80,
		height: 40,
		backgroundColor: COLORS.mainColor,
		borderRadius: 10,
		alignItems: "center",
		justifyContent: "center",
	},
	light_text: {
		fontSize: 12,
		color: COLORS.white,
	},
});
