import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { TakeOutItemButtonProps } from "../../interfaces";
import TakeOutUniqueSelectorButton from "../atoms/TakeOutUniqueSelectorButton";
import CommonItemSelectorButton from "../atoms/CommonItemSelectorButton";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../colors";

const TakeOutSelectItemButton = ({
	item,
	dispatchItems,
	setCameraIsActive,
}: TakeOutItemButtonProps) => {
	return (
		<View>
			{item.in_store_amount !== 0 ? (
				<View>
					{item.is_selected ? (
						<View>
							{item.is_unique ? (
								<TakeOutUniqueSelectorButton
									item={item}
									dispatchItems={dispatchItems}
									setCameraIsActive={setCameraIsActive}
								/>
							) : (
								<CommonItemSelectorButton
									maxAmount={item.in_store_amount}
									selectedAmount={item.selected_amount}
									onValueChange={(itemValue: number) =>
										dispatchItems({
											type: "MODIFY_ITEM",
											payload: {
												id: item.id,
												amount: itemValue,
											},
										})
									}
									onPressDelete={() => {
										dispatchItems({
											type: "DELETE_ITEM",
											payload: { id: item.id },
										});
									}}
								/>
							)}
						</View>
					) : (
						<TouchableOpacity
							style={styles.active_add_button}
							onPress={() => {
								item.is_unique && setCameraIsActive
									? setCameraIsActive(true)
									: dispatchItems({
											type: "ADD_ITEM",
											payload: { id: item.id },
									  });
							}}>
							<View style={styles.button_flex_row}>
								{item.is_unique && (
									<Ionicons
										name="camera"
										size={18}
										color={COLORS.white}
									/>
								)}
								{/* <Ionicons
									name="add"
									size={35}
									color={COLORS.white}
								/> */}
								<Text style={styles.light_text}> Hozzáad</Text>
							</View>
						</TouchableOpacity>
					)}
				</View>
			) : (
				<View style={styles.inactive_add_button}>
					<Text style={styles.light_text}>Nincs raktáron</Text>
				</View>
			)}
		</View>
	);
};

export default TakeOutSelectItemButton;

const styles = StyleSheet.create({
	active_add_button: {
		width: 80,
		height: 40,
		backgroundColor: COLORS.mainColor,
		borderRadius: 10,
		alignItems: "center",
		justifyContent: "center",
	},
	inactive_add_button: {
		width: 80,
		height: 40,
		backgroundColor: "gainsboro",
		borderRadius: 10,
		alignItems: "center",
		justifyContent: "center",
	},
	light_text: {
		color: COLORS.white,
		fontSize: 12,
	},
	button_flex_row: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
});
