import { StyleSheet, Text, View } from "react-native";
import { COLORS } from "../../colors";

interface EmptyListProps {
	text?: string;
}

const EmptyList = ({
	text = "Még nem kerültek elemek a listába...",
}: EmptyListProps) => {
	return (
		<View style={styles.container}>
			<Text style={styles.text}>{text}</Text>
		</View>
	);
};

export default EmptyList;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	text: {
		paddingTop: "70%",
		fontSize: 16,
		textAlign: "center",
		color: COLORS.inactive,
	},
});
