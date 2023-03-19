import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { TakenOutItem } from "../../../interfaces";
import { Ionicons } from "@expo/vector-icons";

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
	console.log(editable);
	return (
		<View
			key={item.id}
			style={styles.tileContainer}
		>
			<View style={styles.infoPart}>
				<View style={styles.flexRow}>
					<Text style={styles.tileTitle}> {item.name} </Text>
					<Text> {`Darabszám: ${item.amount}`} </Text>
				</View>
				{item.unique_items.map((unique_item) => {
					return (
						<Text key={unique_item.unique_id}>
							{`-${unique_item.alt_name}`}
						</Text>
					);
				})}
			</View>
			<View style={styles.buttonPart}>
				{editable ? (
					<TouchableOpacity
						onPress={toggleItemChecked}
						style={item.is_checked && { paddingRight: 1 }}
					>
						<Ionicons
							name={item.is_checked ? "checkbox-outline" : "square-outline"}
							size={35}
							color="#000"
						/>
					</TouchableOpacity>
				) : (
					<View style={item.is_checked && { paddingRight: 1 }}>
						<Ionicons
							name="checkbox-outline"
							size={35}
							color="#000"
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
	flexRow: {
		flex: 1,
		flexDirection: "row",
		justifyContent: "space-between",
	},
	tileTitle: {
		fontSize: 18,
		fontWeight: "bold",
	},
	buttonPart: {
		flex: 0.2,
		alignItems: "flex-end",
	},
});
