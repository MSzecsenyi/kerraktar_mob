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
import DefaultModal from "../../molecules/DefaultModal";
import { modalStyles } from "../../../styles";
import ItemCreator from "../../pages/ItemCreator";
import WarningModalContent from "../ModalContents/WarningModalContent";
import { useDeleteItem } from "../../../query-hooks/UseItems";
import { COLORS } from "../../../colors";
import ItemHistoryList from "../ItemHistoryList";
import UniqueItemDetailTile from "./UniqueItemDetailTile";

export interface ItemTileProps {
	item: Item;
	storeId: number;
}

const ItemTile = ({ item, storeId }: ItemTileProps) => {
	const [infoModalVisible, setInfoModalVisible] = useState(false);
	const [editMode, setEditMode] = useState(false);
	const [deleteWarning, setDeleteWarning] = useState(false);
	const [closeModalWarning, setCloseModalWarning] = useState(false);
	const [closeModalWarningVisible, setCloseModalWarningVisible] =
		useState(false);

	//  SERVER COMMUNICATION
	const deleteItem = useDeleteItem(
		item.id,
		() => {
			setInfoModalVisible(false);
			setDeleteWarning(false);
		},
		storeId
	);

	const renderRow = useCallback(({ item }: ListRenderItemInfo<UniqueItem>) => {
		return <UniqueItemDetailTile uniqueItem={item} />;
	}, []);

	const keyExtractor = (item: UniqueItem) => item.uuid.toString();

	return (
		<>
			{/* MODALS */}
			<DefaultModal
				visible={infoModalVisible}
				closeFn={() =>
					closeModalWarning
						? setCloseModalWarningVisible(true)
						: setInfoModalVisible(false)
				}>
				<View>
					{editMode ? (
						<ItemCreator
							item={item}
							backFn={() => setEditMode(false)}
							setCloseModalWarning={(value) => setCloseModalWarning(value)}
							closeFn={() => setInfoModalVisible(false)}
							storeId={storeId}
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
							{item.is_unique ? (
								<View style={styles.modal_uitem_container}>
									<FlatList
										style={{ height: 450 }}
										data={item.unique_items}
										keyExtractor={keyExtractor}
										ItemSeparatorComponent={() => (
											<View
												style={{
													height: 1,
													backgroundColor: COLORS.inactive,
												}}
											/>
										)}
										renderItem={renderRow}
										keyboardShouldPersistTaps="always"
									/>
								</View>
							) : (
								<ItemHistoryList
									itemId={item.id}
									visible={infoModalVisible}
								/>
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
									onPress={() => setDeleteWarning(true)}>
									<Text style={modalStyles.buttonAcceptText}>Törlés</Text>
								</TouchableOpacity>
							</View>
						</>
					)}
				</View>
			</DefaultModal>

			<DefaultModal
				visible={deleteWarning}
				closeFn={() => setDeleteWarning(false)}>
				<WarningModalContent
					closeModal={() => setDeleteWarning(false)}
					acceptModal={() => {
						deleteItem.mutate();
					}}
					mainText="Biztosan törlöd?"
					explainText="Historikus adatok veszhetnek el!"
					loading={deleteItem.isLoading}
				/>
			</DefaultModal>

			<DefaultModal
				visible={closeModalWarningVisible}
				closeFn={() => setCloseModalWarningVisible(false)}>
				<WarningModalContent
					closeModal={() => setCloseModalWarningVisible(false)}
					acceptModal={() => {
						setCloseModalWarning(false);
						setCloseModalWarningVisible(false);
						setInfoModalVisible(false);
					}}
				/>
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
		backgroundColor: COLORS.mainColor,
		borderRadius: 10,
		alignItems: "center",
		justifyContent: "center",
	},
	light_text: {
		color: COLORS.white,
	},
	modal_uitem_container: {
		height: 450,
		marginVertical: 10,
		paddingHorizontal: 10,
		borderColor: COLORS.inactive,
		borderTopWidth: 1,
		borderBottomWidth: 1,
	},
	modal_item_info: {
		alignItems: "center",
	},
});

export default memo(ItemTile);
