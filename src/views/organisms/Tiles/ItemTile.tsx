import { View, Text, StyleSheet } from "react-native";
import { ItemButtonProps } from "../../../interfaces";
import TakeOutSelectItemButton from "../../molecules/TakeOutSelectItemButton";
import { memo } from "react";
import ItemTileInfo from "../../molecules/ItemTileInfo";

const ItemTile = ({
	item,
	dispatchItems,
	setCameraIsActive,
}: ItemButtonProps) => {
	return (
		<View style={styles.card_template}>
			<ItemTileInfo item={item} />
			<View style={styles.button_part}>
				<TakeOutSelectItemButton
					item={item}
					dispatchItems={dispatchItems}
					setCameraIsActive={setCameraIsActive}
				/>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	card_template: {
		padding: 10,
		margin: 5,
		height: 70,
		borderRadius: 15,
		borderColor: "black",
		borderWidth: 1,
		flex: 1,
		flexDirection: "row",
	},
	button_part: {
		flex: 0.3,
		alignItems: "flex-end",
		justifyContent: "center",
	},
});

export default memo(ItemTile);
