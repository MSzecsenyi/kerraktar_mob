import {
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
	TouchableWithoutFeedback,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import QRModifier from "../QRModifier";
import { useState } from "react";
import FullScreenModal from "../../molecules/FullScreenModal";
import { SaveUniqueItemData } from "../../../interfaces";
import DefaultModal from "../../molecules/DefaultModal";
import WarningModalContent from "../ModalContents/WarningModalContent";
import { COLORS } from "../../../colors";

interface CreateItemUItemTileProps {
	scannedUuids: string[];
	item: SaveUniqueItemData;
	index: number;
	uuids: string[];
	updateUniqueItem: (
		key: number,
		alt_name?: string,
		uuid?: string,
		id?: -1
	) => void;
	deleteUniqeItem: (index: number) => void;
}

const CreateItemUItemTile = ({
	scannedUuids,
	item,
	index,
	uuids,
	updateUniqueItem,
	deleteUniqeItem,
}: CreateItemUItemTileProps) => {
	const [cameraIsActive, setCameraIsActive] = useState(false);
	const [deleteWarning, setDeleteWarning] = useState(false);

	const deleteUniqueItem = () => {
		updateUniqueItem(index, "", "", -1);
		deleteUniqeItem(index);
	};
	return (
		<>
			{/* MODALS */}
			<DefaultModal
				visible={deleteWarning}
				closeFn={() => setDeleteWarning(false)}>
				<WarningModalContent
					closeModal={() => setDeleteWarning(false)}
					acceptModal={() => {
						setDeleteWarning(false);
						deleteUniqueItem();
					}}
					mainText="Biztosan törlöd?"
					explainText="Historikus adatok veszhetnek el!"
				/>
			</DefaultModal>

			{/* PAGE CONTENT */}
			<FullScreenModal
				visible={cameraIsActive}
				closeFn={() => setCameraIsActive(false)}>
				<QRModifier
					scannedUuids={scannedUuids}
					item={item}
					index={index}
					uuids={uuids}
					updateUniqueItem={updateUniqueItem}
					setCameraIsActive={setCameraIsActive}
				/>
			</FullScreenModal>

			<TouchableWithoutFeedback>
				<View style={styles.renderRowContainer}>
					<View style={{ flex: 1 }}>
						<TextInput
							placeholder={`${index + 1}. leltári szám`}
							editable={item.id !== -1 ? false : true}
							style={styles.altNameInput}
							value={item.alt_name}
							onChangeText={(text) => {
								updateUniqueItem(index, text, item.uuid);
							}}
						/>
					</View>
					<View style={styles.buttonRowContainer}>
						<TouchableOpacity
							onPress={() => {
								setCameraIsActive(true);
							}}
							style={styles.photo_button}>
							<>
								<Ionicons
									name="camera"
									size={18}
									color={item.uuid == "" ? COLORS.white : "black"}
								/>
							</>
						</TouchableOpacity>
						<TouchableOpacity
							onPress={() => {
								item.id === -1 ? deleteUniqueItem() : setDeleteWarning(true);
							}}
							style={styles.discard_button}>
							<Text style={styles.light_text}>X</Text>
						</TouchableOpacity>
					</View>
				</View>
			</TouchableWithoutFeedback>
		</>
	);
};

export default CreateItemUItemTile;

const styles = StyleSheet.create({
	altNameInput: {
		fontSize: 14,
		height: 25,
		borderBottomColor: COLORS.border,
		borderBottomWidth: 1,
		width: "70%",
	},
	renderRowContainer: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
	},
	buttonRowContainer: {
		width: 70,
		flexDirection: "row",
		paddingVertical: 10,
	},
	discard_button: {
		width: 30,
		height: 30,
		backgroundColor: COLORS.warning,
		borderTopRightRadius: 10,
		borderBottomRightRadius: 10,
		alignItems: "center",
		justifyContent: "center",
	},
	photo_button: {
		width: 40,
		height: 30,
		backgroundColor: COLORS.mainColor,
		borderTopLeftRadius: 10,
		borderBottomLeftRadius: 10,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-evenly",
	},
	light_text: {
		color: COLORS.white,
	},
});
