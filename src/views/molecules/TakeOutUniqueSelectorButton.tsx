import { StyleSheet, Text, View } from "react-native";
import { Item } from "../../interfaces";
import { TouchableHighlight } from "react-native-gesture-handler";
import { useContext, useState } from "react";
import TakeOutUniqueCheckbox from "../atoms/TakeOutUniqueSelector";
import { TakeOutListContext } from "../../contexts/TakeOutListContext";

interface TakeOutUniqueSelectorButtonProps {
	item: Item;
	setCameraIsActive: React.Dispatch<React.SetStateAction<boolean>>;
}

const TakeOutUniqueSelectorButton = ({
	item,
	setCameraIsActive,
}: TakeOutUniqueSelectorButtonProps) => {
	const takeOutList = useContext(TakeOutListContext);
	// Activated by default if the item has already been added to the list
	const [isActivated, setIsActivated] = useState(
		takeOutList.state.uniqueItems.some(
			(listItem) => listItem.item_id === item.id
		)
	);

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
									type: "ADD_UNIQUE_ITEM",
									payload: item.id,
								});
							}}
							style={styles.active_add_button}
						>
							<Text style={styles.light_text}>Add</Text>
						</TouchableHighlight>
					) : (
						<View>
							<TakeOutUniqueCheckbox
								setIsActive={setIsActivated}
								setCameraIsActive={setCameraIsActive}
								item={item}
							/>
						</View>
					)}
				</View>
			) : (
				<View style={styles.inactive_add_button}>
					<Text style={styles.light_text}>Add</Text>
				</View>
			)}
		</View>
	);
};

export default TakeOutUniqueSelectorButton;

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
