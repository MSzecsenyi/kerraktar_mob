import { useEffect, useState } from "react";
import { Dimensions, StyleSheet, Modal, View } from "react-native";

interface CameraModalProps {
	scanned: boolean;
	children: JSX.Element;
}

const CameraModal = ({ scanned, children }: CameraModalProps) => {
	const [showModal, setShowModal] = useState(scanned);

	useEffect(() => {
		toggleModal();
	}, [scanned]);

	const toggleModal = () => {
		scanned ? setShowModal(true) : setShowModal(false);
	};

	return (
		<Modal
			transparent
			statusBarTranslucent={true}
			visible={showModal}
			onRequestClose={() => setShowModal(false)}
		>
			<View style={styles.modalBackGround}>
				<View style={styles.modalContainter}>{children}</View>
			</View>
		</Modal>
	);
};

export default CameraModal;

const styles = StyleSheet.create({
	modalBackGround: {
		flex: 1,
		width: Dimensions.get("screen").width,
		height: Dimensions.get("screen").height,
		backgroundColor: "#000a",
		justifyContent: "center",
		alignItems: "center",
	},
	modalContainter: {
		width: "80%",
		backgroundColor: "white",
		paddingHorizontal: 20,
		paddingTop: 30,
		paddingBottom: 20,
		borderRadius: 20,
		elevation: 20,
	},
});
