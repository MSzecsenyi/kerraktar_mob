import { View, Text, StyleSheet, TouchableHighlight } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { memo, useContext } from "react";
import { UserDataContext } from "../../../contexts/UserDataContext";
import { ItemRequest } from "../../../interfaces";
import { displayDate } from "../../../functions";

interface RequestButtonProps {
	request: ItemRequest;
	onTilePress: () => void;
}

const RequestTile = ({ request, onTilePress }: RequestButtonProps) => {
	const started =
		new Date(request.start_date) < new Date(new Date().setHours(0, 0, 0, 0));
	const loggedInUser = useContext(UserDataContext);
	const getTextColor = (color: string) =>
		started ? { color: "gray" } : { color: color };
	return (
		<TouchableHighlight
			style={
				started
					? styles.card_container_started
					: styles.card_container_not_started
			}
			onPress={onTilePress}>
			<>
				<View style={styles.info_part}>
					<View style={styles.info_row}>
						<Text style={[styles.card_title, getTextColor("white")]}>
							{request.request_name}
						</Text>
					</View>
					<View style={styles.info_row}>
						<Text style={getTextColor("white")}>
							{displayDate(request.start_date) + "  |"}
						</Text>
						<Text style={[getTextColor("white"), { maxWidth: "40%" }]}>
							{loggedInUser.loggedInUser.user.is_group
								? request.store
								: request.user}
						</Text>

						<Text style={getTextColor("white")}>
							{"|  " + displayDate(request.end_date)}
						</Text>
					</View>
				</View>
				<View style={styles.button_part}>
					<Ionicons
						name={request.is_conflicted ? "alert" : "arrow-forward"}
						size={40}
						color={started ? "gray" : request.is_conflicted ? "red" : "white"}
					/>
				</View>
			</>
		</TouchableHighlight>
	);
};

const styles = StyleSheet.create({
	card_container_not_started: {
		padding: 10,
		margin: 5,
		height: 70,
		borderRadius: 15,
		backgroundColor: "green",
		flex: 1,
		flexDirection: "row",
	},
	card_container_conflicted: {
		padding: 10,
		margin: 5,
		height: 70,
		borderRadius: 15,
		backgroundColor: "#ffcccb",
		flex: 1,
		flexDirection: "row",
	},
	card_container_started: {
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

export default memo(RequestTile);
