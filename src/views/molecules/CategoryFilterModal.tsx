import {
	FlatList,
	Modal,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";

interface CategoryModalProps {
	visible: boolean;
	categories: string[];
	onClose: () => void;
	onSelect: (categoryId: string) => void;
}

const CategoryFilterModal = ({
	visible,
	categories,
	onClose,
	onSelect,
}: CategoryModalProps) => {
	const renderItem = ({ item }: { item: string }) => (
		<TouchableOpacity
			style={styles.categoryItem}
			onPress={() => onSelect(item)}>
			<Text style={styles.categoryText}>{`${item}`}</Text>
		</TouchableOpacity>
	);

	return (
		<Modal
			visible={visible}
			animationType="slide"
			transparent
			onRequestClose={onClose}>
			<View style={styles.modalContent}>
				<FlatList
					data={categories}
					renderItem={renderItem}
					keyExtractor={(item) => item.toString()}
				/>
			</View>
		</Modal>
	);
};

export default CategoryFilterModal;

const styles = StyleSheet.create({
	modalContent: {
		backgroundColor: "white",
		borderTopLeftRadius: 20,
		borderTopRightRadius: 20,
		marginTop: "auto",
	},
	categoryList: {
		flexGrow: 1,
		paddingVertical: 20,
	},
	categoryItem: {
		paddingVertical: 10,
		paddingHorizontal: 20,
	},
	categoryText: {
		fontSize: 10,
	},
});
