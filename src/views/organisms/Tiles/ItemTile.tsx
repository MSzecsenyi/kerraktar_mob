import {
	View,
	StyleSheet,
	Text,
	TouchableOpacity,
	ListRenderItemInfo,
	FlatList,
} from "react-native";
import { memo, useCallback, useState } from "react";
import { Item, UniqueItem } from "../../../interfaces";
import { TakeOutItemAction } from "../../../contexts/ItemReducer";
import DefaultModal from "../../molecules/DefaultModal";
import { modalStyles } from "../../../styles";
import ItemCreator from "../../pages/ItemCreator";

export interface ItemTileProps {
	item: Item;
	dispatchItems: React.Dispatch<TakeOutItemAction>;
}

const ItemTile = ({ item }: ItemTileProps) => {
	const [infoModalVisible, setInfoModalVisible] = useState(false);
	const [editMode, setEditMode] = useState(false);

	const renderRow = useCallback(({ item }: ListRenderItemInfo<UniqueItem>) => {
		return (
			<View style={styles.modal_uitem}>
				<Text>{item.alt_name}</Text>
				<Text>{item.id}</Text>
				<Text>
					{item.taken_out_by == "-1" ? "Raktárban" : item.taken_out_by}
				</Text>
			</View>
		);
	}, []);

	const keyExtractor = (item: UniqueItem) => item.uuid.toString();

	return (
		<>
			{/* MODALS */}
			<DefaultModal
				visible={infoModalVisible}
				closeFn={() => setInfoModalVisible(false)}>
				<View>
					{editMode ? (
						<ItemCreator
							item={item}
							backFn={() => setEditMode(false)}
						/>
					) : (
						<>
							<Text style={[modalStyles.boldText, modalStyles.mainText]}>
								{item.item_name}
							</Text>
							<View style={styles.modal_item_info}>
								<Text>Összesen: {item.amount}</Text>
								<Text>Raktárban: {item.in_store_amount}</Text>
							</View>
							{item.is_unique && (
								<View style={styles.modal_uitem_container}>
									<FlatList
										data={item.unique_items}
										style={{ height: item.unique_items.length * 41 }}
										keyExtractor={keyExtractor}
										ItemSeparatorComponent={() => (
											<View
												style={{ height: 1, backgroundColor: "lightgray" }}
											/>
										)}
										getItemLayout={(data, index) => ({
											length: 80,
											offset: 80 * (index + 1),
											index,
										})}
										renderItem={renderRow}
									/>
								</View>
							)}
							<View style={modalStyles.buttonContainer}>
								<TouchableOpacity
									style={modalStyles.buttonAccept}
									onPress={() => {
										setEditMode(true);
									}}>
									<Text style={modalStyles.buttonAcceptText}>Szerkesztés</Text>
								</TouchableOpacity>
								<TouchableOpacity
									style={modalStyles.buttonDelete}
									onPress={() => setInfoModalVisible(false)}>
									<Text style={modalStyles.buttonAcceptText}>Törlés</Text>
								</TouchableOpacity>
							</View>
						</>
					)}
				</View>
			</DefaultModal>

			{/* PAGE CONTENT */}
			<View style={styles.card_template}>
				<View style={styles.info_part}>
					<View style={styles.title_row}>
						<Text style={styles.card_title}> {item.item_name} </Text>
					</View>
					<View style={styles.info_row}>
						<Text> Egyedi: {item.is_unique ? "igen" : "nem"} </Text>
						<Text> Darabszám: {item.amount} </Text>
						<Text> Raktáron: {item.in_store_amount} </Text>
					</View>
				</View>
				<View style={styles.button_part}>
					<TouchableOpacity
						style={styles.edit_button}
						onPress={() => setInfoModalVisible(true)}>
						<Text style={styles.light_text}>Részletek</Text>
					</TouchableOpacity>
				</View>
			</View>
		</>
	);
};

const styles = StyleSheet.create({
	card_template: {
		padding: 10,
		margin: 5,
		height: 70,
		borderRadius: 15,
		borderColor: "black",
		borderWidth: 1,
		flex: 1,
		flexDirection: "row",
		paddingLeft: 15,
	},
	button_part: {
		flex: 0.3,
		alignItems: "flex-end",
		justifyContent: "center",
	},
	info_part: {
		flex: 0.7,
		justifyContent: "space-between",
	},
	title_row: {
		flexDirection: "row",
		justifyContent: "space-between",
	},
	info_row: {
		flexDirection: "row",
		justifyContent: "space-between",
	},
	card_title: {
		fontSize: 16,
		fontWeight: "bold",
	},
	edit_button: {
		width: 80,
		height: 40,
		backgroundColor: "green",
		borderRadius: 10,
		alignItems: "center",
		justifyContent: "center",
	},
	light_text: {
		color: "white",
	},
	modal_uitem_container: {
		marginVertical: 10,
		paddingHorizontal: 10,
		borderColor: "lightgray",
		borderTopWidth: 1,
		borderBottomWidth: 1,
	},
	modal_uitem: {
		justifyContent: "space-between",
		flexDirection: "row",
		padding: 10,
		height: 40,
	},
	modal_item_info: {
		alignItems: "center",
	},
});

export default memo(ItemTile);
