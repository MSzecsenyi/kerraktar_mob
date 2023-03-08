import { View, StyleSheet, TouchableHighlight, Text } from "react-native";
import { useGetItems } from "../../query-hooks/UseItems";
import ItemTile from "../organisms/ItemTile";
import { TakeOutListContext } from "../../contexts/TakeOutListContext";
import { Ionicons } from "@expo/vector-icons";
import { FlatList, TouchableOpacity } from "react-native-gesture-handler";
import SearchBar from "../atoms/SearchBar";
import { useContext, useEffect, useState } from "react";
import QRScanner from "../organisms/QRScanner";
import LoadingSpinner from "../atoms/LoadingSpinner";
// import ItemFilterBar from "../organisms/ItemFilterBar";
import { Item, TakeOutDrawerProps } from "../../interfaces";
import DefaultModal from "../molecules/DefaultModal";
import TakeOutAcceptListItem from "../atoms/TakeOutAcceptListItem";

const TakeOutListCreator = ({ navigation }: TakeOutDrawerProps) => {
	const getItems = useGetItems();
	const [searchTerm, setSearchTerm] = useState("");
	const [filteredData, setFilteredData] = useState<Item[]>([]);
	const [selectedItems, setSelectedItems] = useState<Item[]>([]);
	const [cameraIsActive, setCameraIsActive] = useState(false);
	const [modalIsVisible, setModalIsVisible] = useState(false);
	const takeOutList = useContext(TakeOutListContext);

	useEffect(() => {
		const filtered = getItems.data?.filter((item) => {
			return item.item_name.toLowerCase().includes(searchTerm.toLowerCase());
		});
		if (filtered) setFilteredData(filtered);
	}, [searchTerm, getItems.data]);

	useEffect(() => {
		getSelectedItems;
	}, [takeOutList.state, getItems.data]);

	const getSelectedItems = () => {
		if (getItems.isSuccess) {
			const selectedUniqueItems = takeOutList.state.uniqueItems.map((item) => {
				return {
					id: item.item_id,
					amount: item.unique_items.length,
				};
			});
			const selectedItemIds =
				takeOutList.state.items.concat(selectedUniqueItems);

			const selectedItems = getItems.data.filter((item) => {
				selectedItemIds.some((selectedItem) => selectedItem.id === item.id);
			});
			setSelectedItems(selectedItems);
		}
	};

	return (
		<View style={{ flex: 1 }}>
			{cameraIsActive && getItems.isSuccess ? (
				<QRScanner
					setCameraIsActive={setCameraIsActive}
					items={getItems.data}
				/>
			) : (
				<>
					<DefaultModal visible={modalIsVisible}>
						<>
							<TouchableHighlight onPress={() => setModalIsVisible(false)}>
								<Text>Kiválasztott eszközök:</Text>
							</TouchableHighlight>
							<FlatList
								data={selectedItems}
								renderItem={TakeOutAcceptListItem}
							/>
						</>
					</DefaultModal>
					<View style={styles.headerContainer}>
						<TouchableOpacity
							style={styles.menuIconStyle}
							onPress={navigation.openDrawer}
						>
							<Ionicons
								name="menu"
								size={40}
								color="#333"
							/>
						</TouchableOpacity>
						<SearchBar
							style={styles.searchBarContainer}
							searchTerm={searchTerm}
							setSearchTerm={setSearchTerm}
						/>
					</View>
					{getItems.isLoading && <LoadingSpinner />}
					{getItems.isSuccess && (
						<>
							{/* <ItemFilterBar
									filteredData={filteredData}
									setFilteredData={setFilteredData}
								/> */}
							<FlatList
								data={filteredData}
								style={{ flex: 1 }}
								keyExtractor={(item) => item.id.toString()}
								getItemLayout={(data, index) => ({
									length: 80,
									offset: 80 * (index + 1),
									index,
								})}
								renderItem={({ item }) => (
									<ItemTile
										item={item}
										setIsCameraActive={setCameraIsActive}
									/>
								)}
								extraData={setCameraIsActive}
							/>
						</>
					)}
					<View style={styles.bottomContainer}>
						<TouchableHighlight
							style={styles.leftButton}
							onPress={() => setCameraIsActive(true)}
						>
							<Ionicons
								name="camera"
								size={24}
								color="#fff"
							/>
						</TouchableHighlight>
						<TouchableHighlight
							style={styles.rightButton}
							onPress={() => setModalIsVisible(true)}
						>
							<Ionicons
								name="checkmark"
								size={35}
								color="#fff"
							/>
						</TouchableHighlight>
					</View>
				</>
			)}
		</View>
	);
};

export default TakeOutListCreator;

const styles = StyleSheet.create({
	headerContainer: {
		flexDirection: "row",
		alignItems: "center",
	},
	menuIconStyle: {
		paddingLeft: 12,
	},
	searchBarContainer: {
		padding: 10,
		flex: 1,
		backgroundColor: "#f2f2f2",
	},
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
