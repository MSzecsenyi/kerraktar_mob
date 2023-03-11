import { StyleSheet, Text, TouchableHighlight, View } from "react-native";
import { Item, TakeOutButtonProps } from "../../interfaces";
import TakeOutUniqueSelectorButton from "../atoms/TakeOutUniqueSelectorButton";
import TakeOutCommonSelectorButton from "../atoms/TakeOutCommonSelectorButton";

const TakeOutSelectItemButton = ({
	item,
	dispatchItems,
	setCameraIsActive,
}: TakeOutButtonProps) => {
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
								<TakeOutCommonSelectorButton
									item={item}
									dispatchItems={dispatchItems}
								/>
							)}
						</View>
					) : (
						<TouchableHighlight
							style={styles.active_add_button}
							onPress={() => {
								item.is_unique && setCameraIsActive
									? setCameraIsActive(true)
									: dispatchItems({
											type: "ADD_ITEM",
											payload: { id: item.id },
									  });
							}}
						>
							<Text style={styles.light_text}>Add</Text>
						</TouchableHighlight>
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
