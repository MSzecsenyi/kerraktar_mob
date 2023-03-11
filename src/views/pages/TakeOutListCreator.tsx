import {
	View,
	StyleSheet,
	TouchableOpacity,
	Text,
	ListRenderItemInfo,
	TouchableHighlight,
	Keyboard,
} from "react-native";
import { useGetItems } from "../../query-hooks/UseItems";
import ItemTile from "../organisms/ItemTile";
import { Ionicons } from "@expo/vector-icons";
import { FlatList, TextInput } from "react-native-gesture-handler";
import SearchBar from "../atoms/SearchBar";
import { useCallback, useEffect, useReducer, useState } from "react";
import QRScanner from "../organisms/QRScanner";
import LoadingSpinner from "../atoms/LoadingSpinner";
// import ItemFilterBar from "../organisms/ItemFilterBar";
import { Item, TakeOutDrawerProps, TakeOutList } from "../../interfaces";
import DefaultModal from "../molecules/DefaultModal";
import TakeOutAcceptListItem from "../atoms/TakeOutAcceptListItem";
import { itemReducer } from "../../contexts/ItemReducer";
import { modalStyles } from "../../styles";
import { usePostTakeOut } from "../../query-hooks/UseTakeOuts";

const TakeOutListCreator = ({ navigation }: TakeOutDrawerProps) => {
	const getItems = useGetItems(5);
	const [searchTerm, setSearchTerm] = useState("");
	const [filteredItems, setFilteredItems] = useState<Item[]>([]);
	const [cameraIsActive, setCameraIsActive] = useState(false);
	const [modalIsVisible, setModalIsVisible] = useState(false);
	const [selectedItemAmount, setSelectedItemAmount] = useState(0);
	const [takeOutList, setTakeOutList] = useState<TakeOutList>({
		items: [],
		uniqueItems: [],
		store_id: 5,
		take_out_name: "",
	});

	const [items, dispatchItems] = useReducer(itemReducer, []);

	const postTakeOut = usePostTakeOut(takeOutList);

	useEffect(() => {
		setSelectedItemAmount(items.filter((item) => item.is_selected).length);
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

	useEffect(() => {
		const kListener = Keyboard.addListener("keyboardDidHide", () => {
			Keyboard.dismiss();
		});

		return () => {
			kListener.remove();
		};
	}, []);

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
					<DefaultModal
						visible={modalIsVisible}
						closeFn={() => setModalIsVisible(false)}
					>
						<>
							<TouchableOpacity onPress={() => setModalIsVisible(false)}>
								<Text style={modalStyles.mainText}>Kiválasztott eszközök:</Text>
							</TouchableOpacity>
							<FlatList
								data={items
									.filter((item) => item.is_selected)
									.sort((a, b) => a.item_name.localeCompare(b.item_name))}
								keyExtractor={(item) => item.id}
								renderItem={(item) => (
									<TakeOutAcceptListItem ListItemData={item} />
								)}
							/>
							<TextInput
								style={modalStyles.textInput}
								onChangeText={(text) =>
									setTakeOutList((prev) => {
										return { ...prev, take_out_name: text };
									})
								}
								placeholder="Hol használod az eszközöket?"
							/>
							<View style={modalStyles.buttonContainer}>
								<TouchableHighlight
									style={modalStyles.buttonReject}
									onPress={() => setModalIsVisible(false)}
								>
									<Text style={modalStyles.buttonRejectText}>Mégse</Text>
								</TouchableHighlight>
								<TouchableHighlight
									style={
										takeOutList.take_out_name.length != 0
											? modalStyles.buttonAccept
											: modalStyles.buttonDisabled
									}
									onPress={() => {
										postTakeOut.mutate();
										setModalIsVisible(false);
									}}
								>
									<Text style={modalStyles.buttonAcceptText}>Kivétel</Text>
								</TouchableHighlight>
							</View>
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
							style={styles.footerButton}
							onPress={() => setCameraIsActive(true)}
						>
							<Ionicons
								name="camera"
								size={24}
								color="#fff"
							/>
						</TouchableOpacity>
						<TouchableOpacity
							style={
								selectedItemAmount > 0
									? styles.footerButton
									: styles.inactiveFooterButton
							}
							onPress={() =>
								setModalIsVisible(selectedItemAmount > 0 ? true : false)
							}
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
	footerButton: {
		backgroundColor: "#007aff",
		width: 60,
		height: 60,
		borderRadius: 30,
		justifyContent: "center",
		alignItems: "center",
		marginHorizontal: 20,
	},
	inactiveFooterButton: {
		backgroundColor: "lightgray",
		width: 60,
		height: 60,
		borderRadius: 30,
		justifyContent: "center",
		alignItems: "center",
		marginHorizontal: 20,
	},
});