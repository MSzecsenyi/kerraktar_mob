import {
	View,
	StyleSheet,
	TouchableOpacity,
	Text,
	ListRenderItemInfo,
} from "react-native";
import { useGetItems } from "../../query-hooks/UseItems";
import ItemTile from "../organisms/ItemTile";
import { Ionicons } from "@expo/vector-icons";
import { FlatList } from "react-native-gesture-handler";
import SearchBar from "../atoms/SearchBar";
import { useCallback, useEffect, useReducer, useState } from "react";
import QRScanner from "../organisms/QRScanner";
import LoadingSpinner from "../atoms/LoadingSpinner";
// import ItemFilterBar from "../organisms/ItemFilterBar";
import { Item, TakeOutDrawerProps } from "../../interfaces";
import DefaultModal from "../molecules/DefaultModal";
import TakeOutAcceptListItem from "../atoms/TakeOutAcceptListItem";
import { itemReducer } from "../../contexts/ItemReducer";

const TakeOutListCreator = ({ navigation }: TakeOutDrawerProps) => {
	const getItems = useGetItems();
	const [searchTerm, setSearchTerm] = useState("");
	const [filteredItems, setFilteredItems] = useState<Item[]>([]);
	const [cameraIsActive, setCameraIsActive] = useState(false);
	const [modalIsVisible, setModalIsVisible] = useState(false);
	const [items, dispatchItems] = useReducer(itemReducer, []);

	useEffect(() => {
		const filtered = items.filter((item) => {
			return item.item_name.toLowerCase().includes(searchTerm.toLowerCase());
		});
		if (filtered) setFilteredItems(filtered);
	}, [searchTerm, items]);

	useEffect(() => {
		if (getItems.isSuccess)
			dispatchItems({
				type: "CREATE_ITEMS",
				payload: { items: getItems.data },
			});
	}, [getItems.data]);

	const renderRow = useCallback(({ item }: ListRenderItemInfo<Item>) => {
		return (
			<ItemTile
				item={item}
				dispatchItems={dispatchItems}
				setCameraIsActive={setCameraIsActive}
			/>
		);
	}, []);

	const keyExtractor = (item: Item) => item.id.toString();

	return (
		<View style={{ flex: 1 }}>
			{cameraIsActive && getItems.isSuccess ? (
				<QRScanner
					setCameraIsActive={setCameraIsActive}
					dispatchItems={dispatchItems}
					items={items}
				/>
			) : (
				<>
					<DefaultModal visible={modalIsVisible}>
						<>
							<TouchableOpacity onPress={() => setModalIsVisible(false)}>
								<Text>Kiválasztott eszközök:</Text>
							</TouchableOpacity>
							<FlatList
								data={items}
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
									filteredItems={filteredItems}
									setFilteredItems={setFilteredItems}
								/> */}
							<FlatList
								data={filteredItems}
								style={{ flex: 1 }}
								keyExtractor={keyExtractor}
								getItemLayout={(data, index) => ({
									length: 80,
									offset: 80 * (index + 1),
									index,
								})}
								renderItem={renderRow}
							/>
						</>
					)}
					<View style={styles.bottomContainer}>
						<TouchableOpacity
							style={styles.leftButton}
							onPress={() => setCameraIsActive(true)}
						>
							<Ionicons
								name="camera"
								size={24}
								color="#fff"
							/>
						</TouchableOpacity>
						<TouchableOpacity
							style={styles.rightButton}
							onPress={() => setModalIsVisible(true)}
						>
							<Ionicons
								name="checkmark"
								size={35}
								color="#fff"
							/>
						</TouchableOpacity>
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
