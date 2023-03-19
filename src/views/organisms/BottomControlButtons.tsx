import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface BottomControlButtonsProps {
	setCameraIsActive?: React.Dispatch<React.SetStateAction<boolean>>;

	children: JSX.Element;
}

const BottomControlButtons = ({
	setCameraIsActive,
	children,
}: BottomControlButtonsProps) => {
	return <View style={styles.bottomContainer}>{children}</View>;
};

export default BottomControlButtons;

const styles = StyleSheet.create({
	bottomContainer: {
		position: "absolute",
		bottom: 20,
		left: 0,
		right: 0,
		flexDirection: "row",
		justifyContent: "center",
	},
});
