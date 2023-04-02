import { View, StyleSheet, Text } from "react-native";
import { RequestItem, RequestItemButtonProps } from "../../../interfaces";
import { memo, useEffect, useState } from "react";
import RequestSelectItemButton from "../../molecules/RequestSelectItemButton";
import RequestWarningButton from "../../atoms/RequestWarningButton";

const RequestItemTile = ({
	item,
	dispatchRequestItems,
}: RequestItemButtonProps) => {
	const [isConflicted, setIsConflicted] = useState(false)

	useEffect(() => {
		setIsConflicted(item.is_selected && getTotalSelectedAmount(item) > item.amount);
	}, [item.is_selected, item.selected_amount])

	
	function getTotalSelectedAmount(item: RequestItem): number {
			let totalAmount = item.selected_amount;
			if (item.other_requests && item.other_requests.length > 0) {
			totalAmount += item.other_requests.reduce((acc, otherRequest) => {
				return acc + otherRequest.amount;
			}, 0);
			}
			return totalAmount;
	  }

	return (
		<View style={styles.card_template}>
			<View style={styles.info_part}>
				<View style={styles.info_row}>
					<Text style={styles.card_title}> {item.item_name} </Text>
				</View>
				<View style={styles.info_row}>
					<Text> Id: {item.id} </Text>
					<Text> U.pcs: {item.category} </Text>
				</View>
			</View>
			<View style={styles.warning_part}>
				{isConflicted && 
				<RequestWarningButton item={item} dispatchRequestItems={dispatchRequestItems}/>
				}
			</View>
			<View style={styles.button_part}>
				<RequestSelectItemButton item={item} dispatchRequestItems={dispatchRequestItems} />
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
	info_part: {
		flex: 0.6,
		justifyContent: "space-between",
	},
	info_row: {
		flexDirection: "row",
		justifyContent: "space-between",
	},
	card_title: {
		fontSize: 16,
		fontWeight: "bold",
	},
	warning_part: {
		flex: 0.1,
		alignItems: "flex-end",
		justifyContent: "center",
	},
	button_part: {
		flex: 0.3,
		alignItems: "flex-end",
		justifyContent: "center",
	},
});

export default memo(RequestItemTile);
