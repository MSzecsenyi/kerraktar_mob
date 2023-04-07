import { StyleSheet, View } from "react-native";

interface BottomButtonContainerProps {
	children: JSX.Element;
}

const BottomButtonContainer = ({ children }: BottomButtonContainerProps) => {
	return <View style={styles.bottomContainer}>{children}</View>;
};

export default BottomButtonContainer;

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
