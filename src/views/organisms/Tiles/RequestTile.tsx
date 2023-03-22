import { View, Text, StyleSheet, TouchableHighlight } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { memo, useContext, useState } from "react";
import { UserDataContext } from "../../../contexts/UserDataContext";
import { ItemRequest } from "../../../interfaces";

interface RequestButtonProps {
    request: ItemRequest
    setChosenRequest: React.Dispatch<React.SetStateAction<number>>
}

const RequestTile = ({ request, setChosenRequest }: RequestButtonProps) => {
	const loggedInUser = useContext(UserDataContext);
	const getTextColor = (color: string) =>
		request.end_date ? {} : { color: color };
	return (
		<TouchableHighlight
			style={
				request.end_date ? styles.card_container_done : styles.card_container_ip
			}
			onPress={() => setChosenRequest(request.id)}
		>
			<>
				<View style={styles.info_part}>
					<View style={styles.info_row}>
						<Text style={[styles.card_title, getTextColor("white")]}>
							{request.request_name}
						</Text>
					</View>
					<View style={styles.info_row}>
						<Text style={getTextColor("white")}>
							{request.start_date.toString()}
						</Text>
						<Text style={[getTextColor("white"), { maxWidth: "40%" }]}>
							{loggedInUser.loggedInUser.user.is_group
								? request.store
								: request.user}
						</Text>

						<Text style={getTextColor("green")}>
							{request.end_date
								? request.end_date.toString()
								: request.start_date.toString()}
						</Text>
					</View>
				</View>
				<View style={styles.button_part}>
					<Ionicons
						name="arrow-forward"
						size={40}
						color={request.end_date ? "black" : "white"}
					/>
				</View>
			</>
		</TouchableHighlight>
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
		backgroundColor: "gray",
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
