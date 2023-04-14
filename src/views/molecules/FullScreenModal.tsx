import { useEffect, useRef, useState } from "react";
import { Dimensions, StyleSheet, Modal, View } from "react-native";
import { COLORS } from "../../colors";

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
            }}>
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
        backgroundColor: COLORS.white,
    },
});
