import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { TakeOut } from "../../../interfaces";
import { Ionicons } from "@expo/vector-icons";
import { memo, useContext } from "react";
import { UserDataContext } from "../../../contexts/UserDataContext";
import { TakeOutListSelectorProps } from "../../pages/TakeOutListSelector";
import { displayDate } from "../../../functions";

interface TakeOutTileProps {
	takeOut: TakeOut;
	navigationProps: TakeOutListSelectorProps;
}

const TakeOutTile = ({ takeOut, navigationProps }: TakeOutTileProps) => {
	const loggedInUser = useContext(UserDataContext);
	const getTextColor = (color: string) =>
		takeOut.end_date ? { color: "gray" } : { color: color };
	return (
		<TouchableOpacity
			style={
				takeOut.end_date ? styles.card_container_done : styles.card_container_ip
			}
			onPress={() =>
				navigationProps.navigation.navigate("TakeOutDetailsScreen", {
					takeOut: takeOut,
				})
			}>
			<>
				<View style={styles.info_part}>
					<View style={styles.info_row}>
						<Text style={[styles.card_title, getTextColor("white")]}>
							{takeOut.take_out_name}
						</Text>
					</View>
					<View style={styles.info_row}>
						<Text style={getTextColor("white")}>
							{displayDate(takeOut.start_date) + "  |"}
						</Text>
						<Text style={[getTextColor("white"), { maxWidth: "40%" }]}>
							{loggedInUser.loggedInUser.user.is_group
								? takeOut.store
								: takeOut.user}
						</Text>
						<Text style={getTextColor("white")}>{"|  "}</Text>
						<Text style={getTextColor("#00000000")}>
							{takeOut.end_date
								? displayDate(takeOut.end_date)
								: displayDate(takeOut.start_date)}
						</Text>
					</View>
				</View>
				<View style={styles.button_part}>
					<Ionicons
						name="arrow-forward"
						size={40}
						color={takeOut.end_date ? "gray" : "white"}
					/>
				</View>
			</>
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	card_container_ip: {
		padding: 10,
		margin: 5,
		height: 70,
		borderRadius: 15,
		backgroundColor: "green",
		flex: 1,
		flexDirection: "row",
	},
	card_container_done: {
		padding: 10,
		margin: 5,
		height: 70,
		borderRadius: 15,
		backgroundColor: "#F4FFF0",
		flex: 1,
		flexDirection: "row",
	},
	info_part: {
		flex: 0.9,
		justifyContent: "space-between",
		alignContent: "center",
	},
	info_row: {
		flexDirection: "row",
		justifyContent: "space-around",
	},
	text_color_ip: {
		color: "white",
	},
	card_title: {
		fontSize: 18,
		fontWeight: "bold",
	},
	button_part: {
		flex: 0.1,
		alignItems: "flex-end",
		justifyContent: "center",
	},
});

export default memo(TakeOutTile);
