import {
	ListRenderItemInfo,
	StyleSheet,
	Text,
	View,
	TouchableOpacity,
} from "react-native";
import { Store } from "../../interfaces";
import { FlatList } from "react-native-gesture-handler";
import HeaderWithSearchBar from "../molecules/HeaderWithSearchBar";
import EmptyList from "../atoms/EmptyList";
import { COLORS } from "../../colors";

interface StoreSelectorProps {
	setStoreId: React.Dispatch<React.SetStateAction<number>>;
	stores: Store[];
	openDrawer: () => void;
	title?: string;
}

const StoreSelector = ({
	setStoreId,
	stores,
	openDrawer,
	title = "",
}: StoreSelectorProps) => {
	const renderRow = (storeInfo: ListRenderItemInfo<Store>) => {
		const store = storeInfo.item;
		return (
			<TouchableOpacity
				style={styles.button}
				onPress={() => {
					setStoreId(store.store_id);
				}}>
				<Text style={styles.buttonText}>{store.address}</Text>
			</TouchableOpacity>
		);
	};

	return (
		<View style={styles.mainContainer}>
			<HeaderWithSearchBar
				openDrawer={openDrawer}
				title={title}
			/>
			<Text style={styles.titleText}>Válassz raktárat:</Text>
			<FlatList
				data={stores.sort((a, b) => a.address.localeCompare(b.address))}
				keyExtractor={(store) => store.store_id.toString()}
				renderItem={renderRow}
				ListEmptyComponent={() => (
					<EmptyList text="Jelenleg nincs hozzádrendelve egy raktár sem." />
				)}
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
		backgroundColor: COLORS.mainColor,
		borderRadius: 15,
	},
	buttonText: {
		textAlign: "center",
		color: COLORS.white,
	},
});
