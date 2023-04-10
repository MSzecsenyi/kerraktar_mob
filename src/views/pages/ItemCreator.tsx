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
import NumericInput from "react-native-numeric-input";
import { FlatList } from "react-native-gesture-handler";
import {
	Item,
	UniqueItemCreatorType,
	sendUniqueItemData,
} from "../../interfaces";
import CreateItemUItemTile from "../organisms/Tiles/createItemUItemTile";
import { useGetUUIds } from "../../query-hooks/UseItems";
import LoadingSpinner from "../atoms/LoadingSpinner";
import { modalStyles } from "../../styles";
interface ItemCreatorProps {
	storeId?: number | undefined;
	item?: Item | undefined;
	backFn?: () => void | undefined;
}

const ItemCreator = ({
	storeId = undefined,
	item = undefined,
	backFn = undefined,
}: ItemCreatorProps) => {
	const [isUnique, setIsUnique] = useState(item ? item.is_unique : false);
	const [name, setName] = useState(item ? item.item_name : "");
	const [amount, setAmount] = useState(item ? item.amount : 1);
	const [uniqueItems, setUniqueItems] = useState<UniqueItemCreatorType>({});
	const [scannedUuids, setScannedUuids] = useState<string[]>([]);
	const [acceptActive, setAcceptActive] = useState(false);
	const getUUIds = useGetUUIds();

	useEffect(() => {
		for (let i = 1; i <= 10; i++) {
			uniqueItems[i] = {
				id: null,
				alt_name: "",
				uuid: "",
			};
		}
		if (item?.is_unique) {
			for (let i = 1; i <= item.amount; i++) {
				uniqueItems[i] = {
					id: item.unique_items[i - 1].id,
					alt_name: item.unique_items[i - 1].alt_name,
					uuid: item.unique_items[i - 1].uuid,
				};
			}
		}
	}, []);

	useEffect(() => {}, [name, amount, isUnique, uniqueItems]);

	const renderRow = useCallback(
		({ item, index }: ListRenderItemInfo<sendUniqueItemData>) => {
			return (
				<>
					{getUUIds.isSuccess && (
						<CreateItemUItemTile
							item={item}
							index={index}
							uuids={getUUIds.data}
							updateUniqueItem={updateUniqueItem}
						/>
					)}
				</>
			);
		},
		[getUUIds.data]
	);

	const filteredUniqueItems = Object.values(uniqueItems)
		.slice(0, amount)
		.map((item, index) => ({
			...item,
			index,
		}));

	const updateUniqueItem = (
		key: number,
		alt_name?: string,
		uuid?: string,
		id?: null
	) => {
		setUniqueItems((prevData) => {
			return {
				...prevData,
				[key]: {
					id: id !== undefined ? id : prevData[key].id,
					alt_name: alt_name !== undefined ? alt_name : prevData[key].alt_name,
					uuid: uuid !== undefined ? uuid : prevData[key].uuid,
				},
			};
		});
	};

	return (
		<KeyboardAvoidingView
			style={{ minHeight: isUnique ? "100%" : "40%", maxHeight: "100%" }}
			// behavior="padding"
		>
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
							<NumericInput
								value={amount}
								onChange={(amount) => setAmount(amount)}
								initValue={amount}
								minValue={
									item
										? item.amount - item.in_store_amount === 0
											? 1
											: item.amount - item.in_store_amount
										: 1
								}
								maxValue={999}
								rounded
								totalHeight={40}
								totalWidth={100}
								rightButtonBackgroundColor="green"
								leftButtonBackgroundColor="green"
								iconStyle={{ color: "white" }}
							/>
							<Text style={styles.amountText}>Darabszám</Text>
						</View>

						<View style={styles.rowContainer}>
							<View style={styles.checboxAligner}>
								<TouchableWithoutFeedback
									onPress={() => {
										setIsUnique((prev) => !prev);
									}}>
									{isUnique ? (
										<Ionicons
											name="checkbox"
											size={30}
											color="green"
										/>
									) : (
										<Ionicons
											name="square-outline"
											size={30}
											color="#000"
										/>
									)}
								</TouchableWithoutFeedback>
							</View>
							<Text style={styles.amountText}>Egyedi eszköz?</Text>
						</View>
					</View>

					{isUnique && (
						<FlatList
							style={styles.flatListStyle}
							data={filteredUniqueItems}
							renderItem={renderRow}
							keyExtractor={(_, index) => index.toString()}
							getItemLayout={(data, index) => ({
								length: 50,
								offset: 50 * (index + 1),
								index,
							})}
							ListEmptyComponent={<LoadingSpinner />}
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
							style={modalStyles.buttonAccept}
							onPress={() => {
								console.log("save pressed");
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
		borderBottomColor: "gray",
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
	amountInput: {
		fontSize: 20,
		height: 40,
		borderBottomColor: "gray",
		borderBottomWidth: 1,
		width: 40,
	},
	checboxAligner: {
		width: 100,
		alignItems: "center",
	},
	flatListStyle: {
		flex: 1,
		borderColor: "lightgray",
		borderTopWidth: 1,
		borderBottomWidth: 1,
		marginBottom: 5,
	},
});
