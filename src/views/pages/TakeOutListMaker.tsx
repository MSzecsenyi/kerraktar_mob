import { View, StyleSheet, TouchableHighlight } from "react-native";
import { useGetItems } from "../../query-hooks/UseItems";
import ItemTile from "../organisms/ItemTile";
import { TakeOutListProvider } from "../../contexts/TakeOutListContext";
import { Ionicons } from "@expo/vector-icons";
import { FlatList, TouchableOpacity } from "react-native-gesture-handler";
import SearchBar from "../atoms/SearchBar";
import { useEffect, useState } from "react";
import { DrawerScreenProps } from "@react-navigation/drawer";
import { DrawerStackParamList } from "../../navigation/ParamStacks";
import QRScanner from "../organisms/QRScanner";
import LoadingSpinner from "../atoms/LoadingSpinner";

type TakeOutListMakerProps = DrawerScreenProps<
	DrawerStackParamList,
	"TakeOutListMaker"
>;

const TakeOutListMaker = ({ navigation }: TakeOutListMakerProps) => {
	const getItems = useGetItems();
	const [searchTerm, setSearchTerm] = useState("");
	const [filteredData, setFilteredData] = useState(getItems.data);
	const [cameraIsActive, setCameraIsActive] = useState(false);

	useEffect(() => {
		const filtered = getItems.data?.filter((item) => {
			return item.item_name.toLowerCase().includes(searchTerm.toLowerCase());
		});
		setFilteredData(filtered);
	}, [searchTerm, getItems.data]);

	return (
		<View style={{ flex: 1 }}>
			{cameraIsActive && getItems.isSuccess ? (
				<QRScanner
					setCameraIsActive={setCameraIsActive}
					items={getItems.data}
				/>
			) : (
				<TakeOutListProvider>
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
					)}
					<View style={styles.bottomContainer}>
						<TouchableHighlight style={styles.leftButton}>
							<Ionicons
								name="camera"
								size={24}
								color="#fff"
							/>
						</TouchableHighlight>
						<TouchableHighlight style={styles.rightButton}>
							<Ionicons
								name="checkmark"
								size={35}
								color="#fff"
							/>
						</TouchableHighlight>
					</View>
				</TakeOutListProvider>
			)}
		</View>
	);
};

export default TakeOutListMaker;

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
