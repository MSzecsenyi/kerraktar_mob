import { useState, useEffect } from "react";
import {
	Dimensions,
	Text,
	View,
	StyleSheet,
	BackHandler,
	TouchableOpacity,
	Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { BarCodeScanner } from "expo-barcode-scanner";
import { StatusBar } from "expo-status-bar";
import { useNavigation } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import { Item, UniqueItem } from "../../interfaces";
import DefaultModal from "../molecules/DefaultModal";
import { modalStyles } from "../../styles";
import { TakeOutItemAction } from "../../contexts/ItemReducer";
import { COLORS } from "../../colors";
interface BarcodeScannerResultType {
	type: string;
	data: string;
}

interface QRScannerProps {
	items: Item[];
	dispatchItems: React.Dispatch<TakeOutItemAction>;
	setCameraIsActive: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function QRScanner({
	items,
	dispatchItems,
	setCameraIsActive,
}: QRScannerProps) {
	const [hasPermission, setHasPermission] = useState(false);
	const [scanned, setScanned] = useState(false);
	const [visible, setVisible] = useState(false);
	const [guidInTakeOutList, setGuidInTakeOutList] = useState(false);
	const [scannedItem, setScannedItem] = useState<Item | null>(null);
	const [scannedUniqueItem, setScannedUniqueItem] = useState<UniqueItem | null>(
		null
	);
	const navigation = useNavigation();

	useEffect(() => {
		const getBarCodeScannerPermissions = async () => {
			const { status } = await BarCodeScanner.requestPermissionsAsync();
			setHasPermission(status === "granted");
		};
		const backAction = () => {
			setCameraIsActive(false);
			return true;
		};
		const backHandler = BackHandler.addEventListener(
			"hardwareBackPress",
			backAction
		);

		getBarCodeScannerPermissions();
		return () => backHandler.remove();
	}, [navigation]);

	const handleBarCodeScanned = ({ data }: BarcodeScannerResultType) => {
		const guidExistsInItems = items.some((item) => {
			return item.unique_items.some((uniqueItem) => {
				if (uniqueItem.uuid === data) {
					if (uniqueItem.taken_out_by == "-1") {
						setScannedItem(item);
						setScannedUniqueItem(uniqueItem);
						setGuidInTakeOutList(
							item.selected_unique_items.some(
								(selectedUniqueItem) => selectedUniqueItem === data
							)
						);
						setScanned(true);
						setVisible(true);
					} else {
						// Unknown QR code scanned
						setScanned(true);
						Toast.show({
							type: "info",
							text1: "Kivett eszköz",
							text2: `Ez az eszköz jelenleg ${uniqueItem.taken_out_by} által ki van véve`,
							topOffset: 60,
							visibilityTime: 2500,
						});
						setTimeout(() => {
							setScanned(false);
						}, 3000);
					}
					return true;
				} else {
					return false;
				}
			});
		});

		if (!guidExistsInItems) {
			// Unknown QR code scanned
			setScanned(true);
			Toast.show({
				type: "info",
				text1: "Ismeretlen QR kód",
				text2: "Ez a kód nem tartozik egy itt tárolt eszközhöz sem",
				topOffset: 60,
				visibilityTime: 2500,
			});
			setTimeout(() => {
				setScanned(false);
			}, 3000);
		}
	};

	const acceptModal = () => {
		if (!guidInTakeOutList && scannedItem && scannedUniqueItem) {
			//unique item is not selected yet
			dispatchItems({
				type: "ADD_UNIQUE_PIECE",
				payload: {
					id: scannedItem.id,
					uniqueId: scannedUniqueItem.uuid,
				},
			});
		} else if (scannedItem && scannedUniqueItem) {
			//unique item is already in the list
			dispatchItems({
				type: "DELETE_UNIQUE_PIECE",
				payload: {
					id: scannedItem.id,
					uniqueId: scannedUniqueItem.uuid,
				},
			});
		} else {
			throw new Error(
				"There was no acceptable qr code read before calling the function, scannedItem and scannedUniqueItem must not be null!"
			);
		}
		setCameraIsActive(false);
	};

	const closeModal = () => {
		setTimeout(() => {
			setScanned(false);
		}, 1400);
		setVisible(false);
	};

	if (hasPermission === null) {
		return <Text>Requesting for camera permission</Text>;
	}
	if (hasPermission === false) {
		return <Text>No access to camera</Text>;
	}

	return (
		<>
			<StatusBar hidden={true} />
			<DefaultModal
				visible={visible}
				closeFn={closeModal}>
				<View>
					<Text style={modalStyles.infoText}>
						{scannedUniqueItem?.alt_name && (
							<>
								<Text style={modalStyles.boldText}>
									{scannedUniqueItem?.alt_name}
								</Text>
								<Text>{`\nleltári számú\n`}</Text>
							</>
						)}
						<Text style={modalStyles.boldText}>{scannedItem?.item_name}</Text>
						{`\n be lett szkennelve`}
					</Text>
					<View style={modalStyles.buttonContainer}>
						<TouchableOpacity
							style={modalStyles.buttonReject}
							onPress={() => closeModal()}>
							<Text style={modalStyles.buttonRejectText}>Mégse</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={
								guidInTakeOutList
									? modalStyles.buttonDelete
									: modalStyles.buttonAccept
							}
							onPress={() => {
								acceptModal();
							}}>
							<Text style={modalStyles.buttonAcceptText}>
								{guidInTakeOutList
									? "Törlés a listából"
									: "Hozzáadás a listához"}
							</Text>
						</TouchableOpacity>
					</View>
				</View>
			</DefaultModal>
			<View style={styles.container}>
				<BarCodeScanner
					onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
					style={styles.cameraViewStyle}>
					<Toast />
					{Platform.OS === "ios" && (
						<TouchableOpacity
							onPress={() => setCameraIsActive(false)}
							style={styles.backButtonContainer}>
							<Ionicons
								name="chevron-back"
								size={24}
								color={COLORS.white}
							/>
						</TouchableOpacity>
					)}

					<Text style={styles.infoText}>
						Eszközök kivételéhez olvasd be a rajtuk levő QR kódot!
					</Text>
					<Ionicons
						name="scan-outline"
						size={300}
						color={COLORS.white}
					/>
				</BarCodeScanner>
			</View>
		</>
	);
}

const styles = StyleSheet.create({
	cameraViewStyle: {
		width: Dimensions.get("screen").width,
		height: Dimensions.get("screen").height,
		position: "absolute",
		alignItems: "center",
	},
	container: {
		flex: 1,
		flexDirection: "column",
		justifyContent: "center",
		backgroundColor: "black",
	},
	backButtonContainer: {
		position: "absolute",
		top: 16,
		left: 16,
		backgroundColor: COLORS.black,
		borderRadius: 24,
		padding: 8,
	},
	infoText: {
		color: COLORS.white,
		paddingTop: "50%",
		alignSelf: "center",
		fontSize: 16,
		paddingHorizontal: "10%",
		textAlign: "center",
	},
});
