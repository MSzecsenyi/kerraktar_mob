import { useState, useEffect, useContext } from "react";
import {
	Dimensions,
	Text,
	View,
	StyleSheet,
	BackHandler,
	TouchableOpacity,
} from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import { StatusBar } from "expo-status-bar";
import { useNavigation } from "@react-navigation/native";
import { TakeOutListContext } from "../../contexts/TakeOutListContext";
import { Item } from "../../interfaces";
import CameraModal from "../molecules/CameraModal";
import { TouchableHighlight } from "react-native-gesture-handler";

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
	const [scannedData, setScannedData] = useState("");
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
		setScanned(true);
		setScannedData(data);

		// alert(`Bar code with type ${type} and data ${data} has been scanned!`);
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
			<CameraModal scanned={scanned}>
				<View>
					<Text>QR code with data {scannedData} has been scanned!</Text>
					<View style={styles.modalButtonContainer}>
						<TouchableOpacity
							style={styles.modalButtonReject}
							onPress={() => setScanned(false)}
						>
							<Text style={styles.modalButtonRejectText}>Mégse</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={styles.modalButtonAccept}
							onPress={() => setScanned(false)}
						>
							<Text style={styles.modalButtonAcceptText}>
								Hozzáadás a listához
							</Text>
						</TouchableOpacity>
					</View>
				</View>
			</CameraModal>
			<BarCodeScanner
				onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
				style={styles.cameraViewStyle}
			/>
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
});
