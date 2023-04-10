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
	const [uniqueItems, setUniqueItems] = useState<UniqueItemCreatorType[]>([]);
	const [acceptActive, setAcceptActive] = useState(false);
	const getUUIds = useGetUUIds();

	// functions responsible for the unique item flatlist values
	const shiftArray = (index: number) => {
		setAmount((prev) => (prev === 1 ? 1 : prev - 1));
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
	}, [isUnique, amount]);

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

	const scannedUuids = uniqueItems
		.map((item) => item.uuid)
		.filter((uuid) => uuid !== "");

	const renderRow = useCallback(
		({ item, index }: ListRenderItemInfo<sendUniqueItemData>) => {
			console.log(scannedUuids);
			return (
				<>
					{getUUIds.isSuccess && (
						<CreateItemUItemTile
							scannedUuids={scannedUuids}
							item={item}
							index={index}
							uuids={getUUIds.data}
							updateUniqueItem={updateUniqueItem}
							shiftArray={shiftArray}
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
							<TextInput
								style={styles.amountInput}
								maxLength={3}
								textAlign="center"
								value={amount.toString()}
								onChangeText={(input) => {
									let inputNumber: number = parseInt(input);
									if (isNaN(inputNumber) || inputNumber < 0) {
										setAmount(0);
									} else {
										if (isUnique) {
											inputNumber > 50 ? setAmount(50) : setAmount(inputNumber);
										} else {
											setAmount(inputNumber);
										}
									}
								}}
								keyboardType="numeric"
							/>
							<Text style={styles.amountText}>
								Darabszám{isUnique && " (max. 50)"}
							</Text>
						</View>

						<View style={styles.rowContainer}>
							<View style={styles.checboxAligner}>
								<TouchableWithoutFeedback
									onPress={() => {
										amount > 50 && setAmount(50);
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
							data={uniqueItems}
							getItemLayout={(data, index) => ({
								length: 50,
								offset: 50 * (index + 1),
								index,
							})}
							keyboardShouldPersistTaps="always"
							renderItem={renderRow}
							keyExtractor={(_, index) => index.toString()}
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
		width: 42,
		alignItems: "center",
	},
	flatListStyle: {
		flex: 1,
		borderColor: "lightgray",
		borderTopWidth: 1,
		borderBottomWidth: 1,
		marginBottom: 5,
		marginTop: 5,
	},
});
