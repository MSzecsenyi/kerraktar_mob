import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Item, ItemFilterBarProps } from "../../interfaces";
import ItemFilterButton from "../molecules/ItemFilterButton";
import { useState } from "react";
import CategoryFilterModal from "../molecules/CategoryFilterModal";

const ItemFilterBar = ({
	filteredData,
	setFilteredData,
}: ItemFilterBarProps) => {
	const [categoryModalVisible, setCategoryModalVisible] = useState(false);
	const [selectedCategory, setSelectedCategory] =
		useState<string>("Minden kategória");
	const [uniqueCategories, setUniqueCategories] = useState<string[]>([]);

	const categoryOnPress = ({
		filteredData,
		setFilteredData,
	}: ItemFilterBarProps) => {
		const uniqueCategories = [
			"Minden kategória",
			...new Set(filteredData.map((item) => item.category)),
		].sort();
		setUniqueCategories(uniqueCategories);
		console.error(uniqueCategories);
		setCategoryModalVisible(true);
	};

	const handleCategorySelect = (categoryId: string) => {
		setSelectedCategory(categoryId);
		setCategoryModalVisible(false);
		// TODO: Filter the items by selected category
	};

	return (
		<View style={styles.container}>
			<ItemFilterButton
				title={"Kategória"}
				onPress={() => categoryOnPress({ filteredData, setFilteredData })}
			/>
			<ItemFilterButton
				title={"Rendezés"}
				onPress={() => console.error("Rendezés")}
			/>
			<ItemFilterButton
				title={"Csak kiválasztottak"}
				onPress={() => console.error("Csak a kiválasztottak")}
			/>
			<CategoryFilterModal
				visible={categoryModalVisible}
				categories={uniqueCategories}
				onClose={() => setCategoryModalVisible(false)}
				onSelect={handleCategorySelect}
			/>
		</View>
	);
};

export default ItemFilterBar;

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		justifyContent: "space-evenly",
	},
});
