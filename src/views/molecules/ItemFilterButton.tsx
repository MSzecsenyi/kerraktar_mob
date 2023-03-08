import { StyleSheet, Text } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

interface ItemFilterButtonProps {
	title: string;
	onPress: () => void;
}

const ItemFilterButton = ({ title, onPress }: ItemFilterButtonProps) => {
	return (
		<TouchableOpacity
			style={styles.filterButton}
			onPress={onPress}
		>
			<Text style={styles.filterButtonText}>{title}</Text>
		</TouchableOpacity>
	);
};

export default ItemFilterButton;

const styles = StyleSheet.create({
	filterButton: {
		paddingHorizontal: 10,
		height: 40,
		borderWidth: 2,
		borderColor: "green",
		borderRadius: 50,
		marginVertical: 5,
		justifyContent: "center",
		marginHorizontal: 5,
	},
	filterButtonText: {
		color: "green",
	},
});
