import {
	ListRenderItemInfo,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import { Store, LoginDrawerProps } from "../../interfaces";
import { FlatList, TouchableHighlight } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";

interface StoreSelectorProps {
	setStoreId: React.Dispatch<React.SetStateAction<number>>;
	stores: Store[];
	drawerProps: LoginDrawerProps;
}

const StoreSelector = ({
	setStoreId,
	stores,
	drawerProps,
}: StoreSelectorProps) => {
	const renderRow = (storeInfo: ListRenderItemInfo<Store>) => {
		const store = storeInfo.item;
		return (
			<TouchableHighlight
				style={styles.button}
				onPress={() => {
					setStoreId(store.store_id);
				}}
			>
				<Text style={styles.buttonText}>{store.address}</Text>
			</TouchableHighlight>
		);
	};

	return (
		<View style={styles.mainContainer}>
			<TouchableOpacity
				style={{ paddingLeft: 12, paddingTop: 9 }}
				onPress={drawerProps.navigation.openDrawer}
			>
				<Ionicons
					name="menu"
					size={40}
					color="#333"
				/>
			</TouchableOpacity>
			<Text style={styles.titleText}>Válassz raktárat:</Text>
			<FlatList
				data={stores.sort((a, b) => a.address.localeCompare(b.address))}
				keyExtractor={(store) => store.store_id.toString()}
				renderItem={renderRow}
			/>
		</View>
	);
};

export default StoreSelector;

const styles = StyleSheet.create({
	mainContainer: {
		flex: 1,
	},
	titleText: {
		marginTop: "20%",
		marginBottom: 30,
		fontSize: 24,
		textAlign: "center",
	},
	button: {
		height: 40,
		alignSelf: "center",
		width: "80%",
		justifyContent: "center",
		marginVertical: 10,
		backgroundColor: "green",
		borderRadius: 15,
	},
	buttonText: {
		textAlign: "center",
		color: "white",
	},
});
