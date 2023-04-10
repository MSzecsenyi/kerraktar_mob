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
import DefaultModal from "../molecules/DefaultModal";
import { modalStyles } from "../../styles";
interface BarcodeScannerResultType {
	type: string;
	data: string;
}

interface QRModifierProps {
	scannedUuids: string[];
	item: {
		alt_name: string;
		uuid: string;
	};
	index: number;
	uuids: string[];
	updateUniqueItem: (key: number, alt_name?: string, uuid?: string) => void;
	setCameraIsActive: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function QRModifier({
	scannedUuids,
	item,
	index,
	updateUniqueItem,
	uuids,
	setCameraIsActive,
}: QRModifierProps) {
	const [hasPermission, setHasPermission] = useState(false);
	const [scanned, setScanned] = useState(false);
	const [visible, setVisible] = useState(false);
	const [scannedValue, setScannedValue] = useState("");
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

	function isUUIDv4(uuid: string): boolean {
		const pattern = new RegExp(
			/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
		);
		return pattern.test(uuid);
	}

	const handleBarCodeScanned = ({ data }: BarcodeScannerResultType) => {
		if (uuids.includes(data)) {
			setScanned(true);
			Toast.show({
				type: "info",
				text1: "Már létező QR kód",
				text2: `Ez a QR kód már más eszközhöz használva van az applikációban.`,
				topOffset: 60,
				visibilityTime: 2500,
			});
			setTimeout(() => {
				setScanned(false);
			}, 3000);
		} else if (!isUUIDv4(data)) {
			setScanned(true);
			Toast.show({
				type: "info",
				text1: "Helytelen adat",
				text2: `V4 UUId formátumú adatot tartalmazzon a QR kód`,
				topOffset: 60,
				visibilityTime: 2500,
			});
			setTimeout(() => {
				setScanned(false);
			}, 3000);
		} else if (scannedUuids.includes(data)) {
			setScanned(true);
			Toast.show({
				type: "info",
				text1: "Már beolvastad",
				text2: `Már hozzáadtad ezt a QR kódot egy másik eszközhöz`,
				topOffset: 60,
				visibilityTime: 2500,
			});
			setTimeout(() => {
				setScanned(false);
			}, 3000);
		} else {
			setScannedValue(data);
			setScanned(true);
			setVisible(true);
		}
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
						Hozzárendeled ezt a QR kódot az eszközhöz?
					</Text>
					<View style={modalStyles.buttonContainer}>
						<TouchableOpacity
							style={modalStyles.buttonReject}
							onPress={() => closeModal()}>
							<Text style={modalStyles.buttonRejectText}>Mégse</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={modalStyles.buttonAccept}
							onPress={() => {
								updateUniqueItem(index, item.alt_name, scannedValue);
								setCameraIsActive(false);
							}}>
							<Text style={modalStyles.buttonAcceptText}>Hozzárendelés</Text>
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
								color="white"
							/>
						</TouchableOpacity>
					)}

					<Text style={styles.infoText}>
						{`Olvasd be a QR kódot, amihez hozzá akarod rendelni az ${item.alt_name} eszközt!`}
					</Text>
					<Ionicons
						name="scan-outline"
						size={300}
						color="#fff"
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
		backgroundColor: "#000",
		borderRadius: 24,
		padding: 8,
	},
	infoText: {
		color: "white",
		paddingTop: "50%",
		alignSelf: "center",
		fontSize: 16,
		paddingHorizontal: "10%",
		textAlign: "center",
	},
});
