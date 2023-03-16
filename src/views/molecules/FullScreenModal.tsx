import { useEffect, useRef, useState } from "react";
import { Dimensions, StyleSheet, Modal, View } from "react-native";

interface FullScreenModalProps {
	visible: boolean;
	children: JSX.Element;
	closeFn: () => void;
}

const FullScreenModal = ({
	visible,
	children,
	closeFn,
}: FullScreenModalProps) => {
	const [showModal, setShowModal] = useState(visible);

	useEffect(() => {
		toggleModal();
	}, [visible]);

	const toggleModal = () => {
		if (visible) {
			setShowModal(true);
		} else {
			setTimeout(() => {
				setShowModal(false);
			}, 150);
		}
	};

	return (
		<Modal
			visible={showModal}
			onRequestClose={() => {
				closeFn();
			}}
		>
			<View style={[styles.modalBackGround]}>{children}</View>
		</Modal>
	);
};

export default FullScreenModal;

const styles = StyleSheet.create({
	modalBackGround: {
		flex: 1,
		width: Dimensions.get("screen").width,
		height: Dimensions.get("screen").height,
		backgroundColor: "white",
	},
	// modalContainter: {
	// 	width: "80%",
	// 	maxHeight: "80%",
	// 	backgroundColor: "white",
	// 	paddingHorizontal: 20,
	// 	paddingTop: 30,
	// 	paddingBottom: 20,
	// 	borderRadius: 20,
	// 	elevation: 20,
	// },
});
