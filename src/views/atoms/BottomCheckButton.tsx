import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface BottomCheckButtonProps {
	acceptButtonIsActive: boolean;
	acceptButtonOnPress: () => void;
}

const BottomCheckButton = ({
	acceptButtonIsActive,
	acceptButtonOnPress,
}: BottomCheckButtonProps) => {
	return (
		<TouchableOpacity
			style={
				acceptButtonIsActive ? styles.footerButton : styles.inactiveFooterButton
			}
			onPress={acceptButtonIsActive ? acceptButtonOnPress : () => null}
		>
			<Ionicons
				name="checkmark"
				size={35}
				color="#fff"
			/>
		</TouchableOpacity>
	);
};

export default BottomCheckButton;

const styles = StyleSheet.create({
	footerButton: {
		backgroundColor: "#007aff",
		width: 60,
		height: 60,
		borderRadius: 30,
		justifyContent: "center",
		alignItems: "center",
		marginHorizontal: 20,
	},
	inactiveFooterButton: {
		backgroundColor: "lightgray",
		width: 60,
		height: 60,
		borderRadius: 30,
		justifyContent: "center",
		alignItems: "center",
		marginHorizontal: 20,
	},
});
