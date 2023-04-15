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
			<View style={styles.center}>
				<Text style={styles.text}>{text}</Text>
			</View>
		</View>
	);
};

export default EmptyList;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		flexDirection: "column",
	},
	center: {
		justifyContent: "center",
		alignItems: "center",
	},
	text: {
		fontSize: 16,
		textAlign: "center",
		color: COLORS.inactive,
	},
});
