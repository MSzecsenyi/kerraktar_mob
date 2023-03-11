import { useEffect, useRef, useState } from "react";
import { Dimensions, StyleSheet, Modal, View, Animated } from "react-native";

interface DefaultModalProps {
	visible: boolean;
	children: JSX.Element;
	closeFn: () => void;
}

const DefaultModal = ({ visible, children, closeFn }: DefaultModalProps) => {
	const [showModal, setShowModal] = useState(visible);
	const scaleValue = useRef(new Animated.Value(0)).current;

	useEffect(() => {
		toggleModal();
	}, [visible]);

	const toggleModal = () => {
		if (visible) {
			setShowModal(true);
			Animated.spring(scaleValue, {
				toValue: 1,
				bounciness: 7,
				useNativeDriver: true,
			}).start();
		} else {
			setTimeout(() => {
				setShowModal(false);
			}, 150);
			Animated.timing(scaleValue, {
				toValue: 0,
				duration: 300,
				useNativeDriver: true,
			}).start();
		}
	};

	return (
		<Modal
			transparent
			statusBarTranslucent={true}
			visible={showModal}
			onRequestClose={() => {
				closeFn();
			}}
		>
			<View style={styles.modalBackGround}>
				<Animated.View
					style={[
						styles.modalContainter,
						{ transform: [{ scale: scaleValue }] },
					]}
				>
					{children}
				</Animated.View>
			</View>
		</Modal>
	);
};

export default DefaultModal;

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
		maxHeight: "80%",
		backgroundColor: "white",
		paddingHorizontal: 20,
		paddingTop: 30,
		paddingBottom: 20,
		borderRadius: 20,
		elevation: 20,
	},
});