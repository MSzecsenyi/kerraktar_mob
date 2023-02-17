import { View, Text, StyleSheet, TouchableHighlight } from "react-native";
import { useGetItems } from "../../query-hooks/UseItems";
import ItemTile from "../organisms/ItemTile";
import { TakeOutListProvider } from "../../contexts/TakeOutListContext";
import { Ionicons } from "@expo/vector-icons";
import { FlatList } from "react-native-gesture-handler";
import SearchBar from "../atoms/SearchBar";
import { useEffect, useState } from "react";

const TakeOutListMaker = () => {
	const getItems = useGetItems();
	const [searchTerm, setSearchTerm] = useState("");
	const [filteredData, setFilteredData] = useState(getItems.data);

	useEffect(() => {
		const filtered = getItems.data?.filter((item) => {
			return item.item_name.toLowerCase().includes(searchTerm.toLowerCase());
		});
		setFilteredData(filtered);
	}, [searchTerm, getItems.data]);

	return (
		<View style={{ flex: 1 }}>
			<TakeOutListProvider>
				<SearchBar
					searchTerm={searchTerm}
					setSearchTerm={setSearchTerm}
				/>
				{getItems.isLoading && <Text>Loading...</Text>}
				{getItems.isSuccess && (
					<FlatList
						data={filteredData}
						style={{ flex: 1 }}
						keyExtractor={(item) => item.id.toString()}
						getItemLayout={(data, index) => ({
							length: 80,
							offset: 80 * (index + 1),
							index,
						})}
						renderItem={ItemTile}
					/>
				)}
				<View style={styles.bottomContainer}>
					<TouchableHighlight style={styles.leftButton}>
						<Ionicons
							name="ios-search"
							size={24}
							color="#fff"
						/>
					</TouchableHighlight>
					<TouchableHighlight style={styles.rightButton}>
						<Ionicons
							name="ios-arrow-forward"
							size={24}
							color="#fff"
						/>
					</TouchableHighlight>
				</View>
			</TakeOutListProvider>
		</View>
	);
};

export default TakeOutListMaker;

const styles = StyleSheet.create({
	bottomContainer: {
		position: "absolute",
		bottom: 20,
		left: 0,
		right: 0,
		flexDirection: "row",
		justifyContent: "center",
	},
	leftButton: {
		backgroundColor: "#007aff",
		width: 60,
		height: 60,
		borderRadius: 30,
		justifyContent: "center",
		alignItems: "center",
		marginRight: 20,
	},
	rightButton: {
		backgroundColor: "#007aff",
		width: 60,
		height: 60,
		borderRadius: 30,
		justifyContent: "center",
		alignItems: "center",
		marginLeft: 20,
	},
});
