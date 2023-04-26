import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { TakenOutItem } from "../../../interfaces";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../../colors";

interface TakeOutDeatilsItemTileProps {
	item: TakenOutItem;
	toggleItemChecked: () => void;
	editable: boolean;
}

const TakeOutDeatilsItemTile = ({
	item,
	toggleItemChecked,
	editable,
}: TakeOutDeatilsItemTileProps) => {
	return (
		<View
			key={item.id}
			style={styles.tileContainer}>
			<View style={styles.infoPart}>
				<View style={styles.title_row}>
					<Text style={styles.card_title}> {item.name} </Text>
				</View>
				<View style={styles.info_row}>
					<Text> Kivéve: {item.amount} </Text>
				</View>
				{item.unique_items.map((unique_item) => {
					return (
						<Text
							key={unique_item.uuid}>{`       -${unique_item.alt_name}`}</Text>
					);
				})}
			</View>
			<View style={styles.buttonPart}>
				{editable ? (
					<TouchableOpacity
						onPress={toggleItemChecked}
						style={item.is_checked && { paddingRight: 1 }}>
						<Ionicons
							name={item.is_checked ? "checkbox-outline" : "square-outline"}
							size={35}
							color={COLORS.black}
						/>
					</TouchableOpacity>
				) : (
					<View style={item.is_checked && { paddingRight: 1 }}>
						<Ionicons
							name="checkbox-outline"
							size={35}
							color={COLORS.black}
						/>
					</View>
				)}
			</View>
		</View>
	);
};

export default TakeOutDeatilsItemTile;

const styles = StyleSheet.create({
	tileContainer: {
		alignSelf: "center",
		width: "95%",
		minHeight: 60,
		borderWidth: 1.5,
		borderRadius: 15,
		padding: 10,
		margin: 3,
		flexDirection: "row",
	},
	infoPart: {
		flex: 0.8,
	},
	title_row: {
		paddingLeft: 10,
		flexDirection: "row",
		justifyContent: "space-between",
	},
	info_row: {
		flexDirection: "row",
		justifyContent: "flex-end",
	},
	card_title: {
		fontSize: 16,
		fontWeight: "bold",
	},
	buttonPart: {
		flex: 0.2,
		alignItems: "flex-end",
	},
});
