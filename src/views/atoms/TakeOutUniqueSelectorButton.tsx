import { StyleSheet, Text, TouchableHighlight, View } from "react-native";
import { TakeOutItemButtonProps } from "../../interfaces";
import { Ionicons } from "@expo/vector-icons";
import DefaultModal from "../molecules/DefaultModal";
import { useState } from "react";
import { modalStyles } from "../../styles";

const TakeOutUniqueSelectorButton = ({
	item,
	dispatchItems,
	setCameraIsActive,
}: TakeOutItemButtonProps) => {
	const [deleteModalVisible, setDeletModalVisible] = useState(false);
	return (
		<View style={styles.horizontal_flex}>
			<Text>{item.selected_amount}</Text>
			<TouchableHighlight
				onPress={() => {
					if (setCameraIsActive) setCameraIsActive(true);
				}}
				style={styles.photo_button}
			>
				<Ionicons
					name="camera"
					size={14}
					color="#fff"
				/>
			</TouchableHighlight>
			<TouchableHighlight
				onPress={() => {
					setDeletModalVisible(true);
				}}
				style={styles.discard_button}
			>
				<Text style={styles.light_text}>X</Text>
			</TouchableHighlight>
			<DefaultModal
				visible={deleteModalVisible}
				closeFn={() => setDeletModalVisible(false)}
			>
				<>
					<Text style={modalStyles.mainText}>
						Biztosan törölni szeretnéd a listából az összes eddig hozzáadott
						<Text style={modalStyles.boldText}>{` ${item.item_name}`}</Text>
						-t?
					</Text>
					<Text style={modalStyles.infoText}>
						Ha csak egyet szeretnél kivenni a listából, szkenneld be a konkrét
						eszközt újból.
					</Text>
					<View style={modalStyles.buttonContainer}>
						<TouchableHighlight
							style={modalStyles.buttonRejectDelete}
							onPress={() => setDeletModalVisible(false)}
						>
							<Text style={modalStyles.buttonRejectText}>Mégse</Text>
						</TouchableHighlight>
						<TouchableHighlight
							style={modalStyles.buttonDelete}
							onPress={() => {
								setDeletModalVisible(false);
								dispatchItems({
									type: "DELETE_UNIQUE_ITEM",
									payload: { id: item.id },
								});
							}}
						>
							<Text style={modalStyles.buttonAcceptText}>Törlés</Text>
						</TouchableHighlight>
					</View>
				</>
			</DefaultModal>
		</View>
	);
};

export default TakeOutUniqueSelectorButton;

const styles = StyleSheet.create({
	horizontal_flex: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-around",
	},
	discard_button: {
		width: 30,
		height: 30,
		backgroundColor: "red",
		borderRadius: 50,
		alignItems: "center",
		justifyContent: "center",
	},
	photo_button: {
		width: 30,
		height: 30,
		backgroundColor: "green",
		borderRadius: 50,
		alignItems: "center",
		justifyContent: "center",
	},
	light_text: {
		color: "white",
	},
});
