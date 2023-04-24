import {
	StyleSheet,
	Text,
	TouchableOpacity,
	TouchableWithoutFeedback,
	View,
} from "react-native";
import { UniqueItem } from "../../../interfaces";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { COLORS } from "../../../colors";
import { useState } from "react";
import ItemHistoryList from "../ItemHistoryList";

interface UniqueItemDetailTileProps {
	uniqueItem: UniqueItem;
}

const UniqueItemDetailTile = ({ uniqueItem }: UniqueItemDetailTileProps) => {
	const [historyVisible, setHistoryVisible] = useState(false);

	const styles = StyleSheet.create({
		uitem_container: {
			justifyContent: "space-between",
			flexDirection: "row",
			padding: 10,
			height: 40,
			backgroundColor: historyVisible ? COLORS.secondaryColor : COLORS.white,
		},
		buttonSide: {
			flexDirection: "row",
			justifyContent: "flex-end",
			alignItems: "center",
		},
	});

	return (
		<>
			<TouchableOpacity onPress={() => setHistoryVisible((prev) => !prev)}>
				<View style={styles.uitem_container}>
					<Text>{uniqueItem.alt_name}</Text>
					<View style={styles.buttonSide}>
						<Text>
							{uniqueItem.taken_out_by == "-1"
								? "Raktárban"
								: uniqueItem.taken_out_by}
						</Text>
						<MaterialIcons
							name={historyVisible ? "expand-less" : "expand-more"}
							size={20}
							color={COLORS.border}
						/>
					</View>
				</View>
			</TouchableOpacity>
			<View
				style={{
					alignItems: "center",
					backgroundColor: COLORS.secondaryColor,
				}}>
				<View
					style={{
						width: "95%",
						backgroundColor: "white",
					}}>
					<ItemHistoryList
						uniqueItemId={uniqueItem.id}
						visible={historyVisible}
					/>
				</View>
			</View>
		</>
	);
};

export default UniqueItemDetailTile;
