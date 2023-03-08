import { useState, useEffect, useContext } from "react";
import {
	Dimensions,
	Text,
	View,
	StyleSheet,
	BackHandler,
	TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { BarCodeScanner } from "expo-barcode-scanner";
import { StatusBar } from "expo-status-bar";
import { useNavigation } from "@react-navigation/native";
import { TakeOutListContext } from "../../contexts/TakeOutListContext";
import Toast from "react-native-toast-message";
import { Item, UniqueItem } from "../../interfaces";
import DefaultModal from "../molecules/DefaultModal";

interface BarcodeScannerResultType {
	type: string;
	data: string;
}

interface QRScannerProps {
	setCameraIsActive: React.Dispatch<React.SetStateAction<boolean>>;
	items: Item[];
}

export default function QRScanner({
	setCameraIsActive,
	items,
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

	const takeOutList = useContext(TakeOutListContext);

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
		const isGuidPresent = items.some((item) => {
			if (
				item.unique_items.some((uniqueItem) => {
					if (uniqueItem.unique_id === data) {
						setScannedItem(item);
						setScannedUniqueItem(uniqueItem);
						return true;
					}
				})
			) {
				return true;
			} else {
				return false;
			}
		});

		if (isGuidPresent) {
			setScanned(true);
			setVisible(true);

			setGuidInTakeOutList(
				takeOutList.state.uniqueItems.some((item) =>
					item.unique_items.includes(data)
				)
			);
		} else {
			// Unknown QR code scanned
			setScanned(true);
			Toast.show({
				type: "info",
				text1: "Ismeretlen QR kód",
				text2: "Ez a kód nem tartozik egy itt tárolt eszközhöz sem",
				topOffset: 60,
			});
			setTimeout(() => {
				setScanned(false);
			}, 3000);
		}
	};

	const acceptModal = () => {
		if (!guidInTakeOutList && scannedItem && scannedUniqueItem) {
			takeOutList.dispatch({
				type: "ADD_UNIQUE_PIECE",
				payload: {
					item_id: scannedItem?.id,
					unique_item: scannedUniqueItem?.unique_id,
				},
			});
		} else if (scannedItem && scannedUniqueItem) {
			takeOutList.dispatch({
				type: "DELETE_UNIQUE_PIECE",
				payload: {
					item_id: scannedItem?.id,
					unique_item: scannedUniqueItem?.unique_id,
				},
			});
		} else {
			throw new Error(
				"There was no acceptable qr code read before calling the function, scannedItem and scannedUniqueItem must not be null!"
			);
		}
		closeModal();
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
		<View style={styles.container}>
			<StatusBar hidden={true} />
			<DefaultModal visible={visible}>
				<View>
					<Text style={styles.modalInfoText}>
						{scannedUniqueItem?.alt_name && (
							<>
								<Text style={styles.modalInfoTextVariable}>
									{scannedUniqueItem?.alt_name}
								</Text>
								<Text>{`\nleltári számú\n`}</Text>
							</>
						)}
						<Text style={styles.modalInfoTextVariable}>
							{scannedItem?.item_name}
						</Text>
						{`\n be lett szkennelve`}
					</Text>
					<View style={styles.modalButtonContainer}>
						<TouchableOpacity
							style={styles.modalButtonReject}
							onPress={() => closeModal()}
						>
							<Text style={styles.modalButtonRejectText}>Mégse</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={styles.modalButtonAccept}
							onPress={() => acceptModal()}
						>
							<Text style={styles.modalButtonAcceptText}>
								{guidInTakeOutList
									? "Törlés a listából"
									: "Hozzáadás a listához"}
							</Text>
						</TouchableOpacity>
					</View>
				</View>
			</DefaultModal>
			<BarCodeScanner
				onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
				style={styles.cameraViewStyle}
			>
				<Toast />
				<TouchableOpacity
					onPress={() => setCameraIsActive(false)}
					style={styles.backButtonContainer}
				>
					<Ionicons
						name="chevron-back"
						size={24}
						color="white"
					/>
				</TouchableOpacity>
			</BarCodeScanner>
		</View>
	);
}

const styles = StyleSheet.create({
	cameraViewStyle: {
		width: Dimensions.get("screen").width,
		height: Dimensions.get("screen").height,
		position: "absolute",
	},
	container: {
		flex: 1,
		flexDirection: "column",
		justifyContent: "center",
	},
	modalInfoText: {
		fontSize: 16,
		textAlign: "center",
	},
	modalInfoTextVariable: {
		fontWeight: "bold",
		fontSize: 20,
		lineHeight: 40,
	},
	modalButtonContainer: {
		marginTop: 20,
		flexDirection: "row",
		justifyContent: "space-between",
	},
	modalButtonReject: {
		width: 110,
		height: 50,
		borderColor: "green",
		borderWidth: 2,
		borderRadius: 15,
		justifyContent: "center",
	},
	modalButtonAccept: {
		width: 110,
		height: 50,
		backgroundColor: "green",
		borderRadius: 15,
		justifyContent: "center",
	},
	modalButtonRejectText: {
		textAlign: "center",
	},
	modalButtonAcceptText: {
		textAlign: "center",
		color: "white",
	},
	backButtonContainer: {
		position: "absolute",
		top: 16,
		left: 16,
		backgroundColor: "#000",
		borderRadius: 24,
		padding: 8,
	},
});
