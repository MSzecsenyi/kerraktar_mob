import {
	KeyboardAvoidingView,
	ListRenderItemInfo,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	TouchableWithoutFeedback,
	View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useCallback, useEffect, useState } from "react";
import { FlatList } from "react-native-gesture-handler";
import {
	Item,
	SaveItemData,
	UniqueItemCreatorType,
	SaveUniqueItemData,
	ModifyItemData,
} from "../../interfaces";
import CreateItemUItemTile from "../organisms/Tiles/createItemUItemTile";
import {
	useGetUUIds,
	usePostItem,
	useUpdateItem,
} from "../../query-hooks/UseItems";
import LoadingSpinner from "../atoms/LoadingSpinner";
import { modalStyles } from "../../styles";
import { MAX_UNIQUE_ITEMS } from "../../constants";
import NumberPicker from "../atoms/NumberPicker";
import DefaultModal from "../molecules/DefaultModal";
import AcceptModalContent from "../organisms/ModalContents/AcceptModalContent";
import { COLORS } from "../../colors";
import { KeyboardAwareFlatList } from "react-native-keyboard-aware-scroll-view";
interface ItemCreatorProps {
	storeId: number;
	item?: Item | undefined;
	backFn?: () => void | undefined;
	setCloseModalWarning: (closeWarningModal: boolean) => void;
	closeFn: () => void;
}

const ItemCreator = ({
	storeId,
	item = undefined,
	backFn = undefined,
	setCloseModalWarning,
	closeFn,
}: ItemCreatorProps) => {
	const [isUnique, setIsUnique] = useState(item ? item.is_unique : false);
	const [name, setName] = useState(item ? item.item_name : "");
	const [amount, setAmount] = useState(item ? item.amount : 1);
	const [uniqueItems, setUniqueItems] = useState<UniqueItemCreatorType[]>([]);
	const [maxInput, setMaxInput] = useState(item ? MAX_UNIQUE_ITEMS : 999);
	const [reloadUniqueItemList, setReloadUniqueItemList] = useState(true);
	const [acceptActive, setAcceptActive] = useState(false);
	const [saveModalVisible, setSaveModalVisible] = useState(false);
	const [minInput, setMinInput] = useState(
		item && item.is_unique ? item.amount : 0
	);
	const [itemToSave, setItemToSave] = useState<SaveItemData>({
		store_id: storeId,
		amount: amount,
		item_name: name,
		is_unique: isUnique,
		unique_items: uniqueItems,
	});
	const [itemToModify, setItemToModify] = useState<ModifyItemData>({
		id: storeId,
		amount: amount,
		item_name: name,
		is_unique: isUnique,
		unique_items: uniqueItems,
	});

	//SERVER COMMUNICATION FUNCTIONS
	const getUUIds = useGetUUIds();
	const postItem = usePostItem(itemToSave, closeFn, storeId);
	const updateItem = useUpdateItem(itemToModify, closeFn, storeId);

	//FUNCTIONS RESPONSIBLE FOR THE UNIQUE ITEM FLATLIST VALUES
	const deleteUniqeItem = (index: number) => {
		setAmount((prev) => (prev === 1 ? 1 : prev - 1));
		if (uniqueItems[index].id !== -1) {
			setMinInput((prev) => prev - 1);
		}
		setUniqueItems((prev) => {
			const newarr = [
				...prev.slice(0, index),
				...prev.slice(index + 1, prev.length),
			];
			return amount === 1
				? [
						{
							id: -1,
							alt_name: "",
							uuid: "",
						},
				  ]
				: newarr;
		});
	};

	useEffect(() => {
		getUUIds.refetch();
		if (item?.is_unique) {
			for (let i = 0; i < item.amount; i++) {
				setUniqueItems((prev) => {
					return prev.concat([
						{
							id: item.unique_items[i].id,
							alt_name: item.unique_items[i].alt_name,
							uuid: item.unique_items[i].uuid,
						},
					]);
				});
			}
		}
	}, []);

	useEffect(() => {
		const timerId = setTimeout(() => {
			setReloadUniqueItemList((prev) => !prev);
		}, 300);

		return () => {
			clearTimeout(timerId);
		};
	}, [amount]);

	useEffect(() => {
		if (isUnique) {
			setUniqueItems((prev) => {
				while (prev.length < amount) {
					prev = prev.concat([
						{
							id: -1,
							alt_name: "",
							uuid: "",
						},
					]);
				}
				while (prev.length > amount) {
					prev.pop();
				}
				return prev;
			});
		}
	}, [isUnique, reloadUniqueItemList]);

	const updateUniqueItem = (
		key: number,
		alt_name?: string,
		uuid?: string,
		id?: -1
	) => {
		setUniqueItems((prevData) => {
			const newData = [...prevData];
			newData[key] = {
				id: id !== undefined ? id : prevData[key].id,
				alt_name: alt_name !== undefined ? alt_name : prevData[key].alt_name,
				uuid: uuid !== undefined ? uuid : prevData[key].uuid,
			};
			return newData;
		});
	};

	// Save button active state & closemodal warning setting
	useEffect(() => {
		// Accept save state setting
		if (
			name.length < 2 ||
			(isUnique &&
				uniqueItems.some((item) => item.alt_name === "" || item.uuid === "")) ||
			amount == 0
		) {
			setAcceptActive(false);
		} else {
			setAcceptActive(true);
		}
		// OnClose warning modal enabled setting
		// Newly created item
		if (!item) {
			if (
				name.length >= 2 ||
				(isUnique &&
					uniqueItems.some((item) => item.alt_name !== "" || item.uuid !== ""))
			) {
				setCloseModalWarning(true);
			} else {
				setCloseModalWarning(false);
			}
		}
		// Already existing item
		else {
			if (
				(name.length >= 2 && name !== item.item_name) ||
				amount !== item.amount ||
				(isUnique &&
					uniqueItems.some(
						(uItem) =>
							!item.unique_items.some(
								(originalUItem) => originalUItem.uuid === uItem.uuid
							) ||
							!item.unique_items.some(
								(originalUItem) => originalUItem.alt_name === uItem.alt_name
							)
					)) ||
				(isUnique &&
					item.unique_items.some(
						(originalUItem) =>
							!uniqueItems.some((uItem) => originalUItem.uuid === uItem.uuid) ||
							!uniqueItems.some(
								(uItem) => originalUItem.alt_name === uItem.alt_name
							)
					))
			) {
				setCloseModalWarning(true);
			} else {
				setCloseModalWarning(false);
			}
		}
	}, [name, uniqueItems, isUnique, amount]);

	const scannedUuids = uniqueItems
		.map((item) => item.uuid)
		.filter((uuid) => uuid !== "");

	const renderRow = useCallback(
		({ item, index }: ListRenderItemInfo<SaveUniqueItemData>) => {
			return (
				<>
					{getUUIds.isSuccess && (
						<CreateItemUItemTile
							scannedUuids={scannedUuids}
							item={item}
							index={index}
							uuids={getUUIds.data}
							updateUniqueItem={updateUniqueItem}
							deleteUniqeItem={deleteUniqeItem}
						/>
					)}
				</>
			);
		},
		[getUUIds.data, scannedUuids]
	);

	return (
		<KeyboardAvoidingView
			style={{ minHeight: isUnique ? "100%" : "40%", maxHeight: "100%" }}
			// behavior="padding"
		>
			<DefaultModal
				visible={saveModalVisible}
				closeFn={() => setSaveModalVisible(false)}>
				<AcceptModalContent
					closeModal={() => setSaveModalVisible(false)}
					acceptModal={() => {
						item ? updateItem.mutate() : postItem.mutate();
					}}
					mainText={
						item
							? "Módosítod az eszköz adatait?"
							: "Hozzáadod az eszközt a raktárhoz?"
					}
					loading={postItem.isLoading || updateItem.isLoading}
				/>
			</DefaultModal>

			{/* PAGE CONTENT */}
			{getUUIds.isSuccess ? (
				<>
					<View style={styles.basicInfoContainer}>
						<Text style={styles.nameText}>Eszköz neve:</Text>
						<TextInput
							style={styles.nameInput}
							maxLength={30}
							textAlign="center"
							defaultValue={name}
							onChangeText={(name) => setName(name)}
						/>
						<View style={styles.rowContainer}>
							<NumberPicker
								setAmount={setAmount}
								minInput={minInput}
								maxInput={maxInput}
								value={amount}
							/>
							<Text style={styles.amountText}>
								Darabszám
								{isUnique && ` (max. ${MAX_UNIQUE_ITEMS})`}
							</Text>
						</View>

						<View style={styles.rowContainer}>
							<View style={styles.checboxAligner}>
								<TouchableWithoutFeedback
									onPress={() => {
										amount > MAX_UNIQUE_ITEMS && setAmount(MAX_UNIQUE_ITEMS);
										isUnique ? setMaxInput(999) : setMaxInput(MAX_UNIQUE_ITEMS);
										setIsUnique((prev) => !prev);
									}}>
									{isUnique ? (
										<Ionicons
											name="checkbox"
											size={30}
											color={COLORS.mainColor}
										/>
									) : (
										<Ionicons
											name="square-outline"
											size={30}
											color={COLORS.black}
										/>
									)}
								</TouchableWithoutFeedback>
							</View>
							<Text style={styles.amountText}>Egyedi eszköz?</Text>
						</View>
					</View>

					{isUnique && (
						<KeyboardAwareFlatList
							style={styles.flatListStyle}
							data={uniqueItems}
							getItemLayout={(data, index) => ({
								length: 50,
								offset: 50 * (index + 1),
								index,
							})}
							// keyboardShouldPersistTaps="always"
							renderItem={renderRow}
							keyExtractor={(_, index) => index.toString()}
							removeClippedSubviews={false}
						/>
					)}
					<View style={[modalStyles.buttonContainer]}>
						{backFn && (
							<TouchableOpacity
								style={modalStyles.buttonAccept}
								onPress={backFn}>
								<Text
									style={[
										modalStyles.buttonAcceptText,
										{ textDecorationStyle: "solid" },
									]}>
									Infó
								</Text>
							</TouchableOpacity>
						)}
						<TouchableOpacity
							style={
								acceptActive
									? modalStyles.buttonAccept
									: modalStyles.buttonDisabled
							}
							onPress={() => {
								item
									? setItemToModify({
											id: item.id,
											amount: amount,
											item_name: name,
											is_unique: isUnique,
											unique_items: uniqueItems,
									  })
									: setItemToSave({
											store_id: storeId,
											amount: amount,
											item_name: name,
											is_unique: isUnique,
											unique_items: uniqueItems,
									  });

								setSaveModalVisible(true);
							}}>
							<Text style={modalStyles.buttonAcceptText}>Mentés</Text>
						</TouchableOpacity>
					</View>
				</>
			) : (
				<LoadingSpinner />
			)}
		</KeyboardAvoidingView>
	);
};

export default ItemCreator;

const styles = StyleSheet.create({
	basicInfoContainer: {
		alignItems: "center",
	},
	nameText: {
		marginHorizontal: 20,
		fontSize: 20,
	},
	nameInput: {
		fontWeight: "bold",
		fontSize: 20,
		height: 40,
		borderBottomColor: COLORS.border,
		borderBottomWidth: 1,
		width: "100%",
	},
	rowContainer: {
		flexDirection: "row",
		paddingTop: 25,
		justifyContent: "space-between",
		alignItems: "center",
		width: "100%",
		paddingHorizontal: 30,
	},
	amountText: {
		fontSize: 16,
	},
	checboxAligner: {
		width: 100,
		alignItems: "center",
	},
	flatListStyle: {
		flex: 1,
		borderColor: COLORS.inactive,
		borderTopWidth: 1,
		borderBottomWidth: 1,
		marginBottom: 5,
		marginTop: 5,
	},
});
