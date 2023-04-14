import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { TakeOutItemButtonProps } from "../../interfaces";
import { Ionicons } from "@expo/vector-icons";
import DefaultModal from "../molecules/DefaultModal";
import { useState } from "react";
import { modalStyles } from "../../styles";
import { COLORS } from "../../colors";

const TakeOutUniqueSelectorButton = ({
    item,
    dispatchItems,
    setCameraIsActive,
}: TakeOutItemButtonProps) => {
    const [deleteModalVisible, setDeletModalVisible] = useState(false);
    return (
        <View style={styles.horizontal_flex}>
            {/* MODALS */}
            <DefaultModal
                visible={deleteModalVisible}
                closeFn={() => setDeletModalVisible(false)}>
                <>
                    <Text style={modalStyles.mainText}>
                        Biztosan törölni szeretnéd az
                        <Text style={modalStyles.boldText}>{" összes"}</Text>
                        {` ${item.item_name}-t`}
                    </Text>
                    <Text style={modalStyles.infoText}>
                        Ha csak egyet szeretnél törölni, olvasd be újra a
                        törlendő eszközt.
                    </Text>
                    <View style={modalStyles.buttonContainer}>
                        <TouchableOpacity
                            style={modalStyles.buttonReject}
                            onPress={() => setDeletModalVisible(false)}>
                            <Text style={modalStyles.buttonRejectText}>
                                Mégse
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={modalStyles.buttonDelete}
                            onPress={() => {
                                setDeletModalVisible(false);
                                dispatchItems({
                                    type: "DELETE_UNIQUE_ITEM",
                                    payload: { id: item.id },
                                });
                            }}>
                            <Text style={modalStyles.buttonAcceptText}>
                                Törlés
                            </Text>
                        </TouchableOpacity>
                    </View>
                </>
            </DefaultModal>

            {/* CONTENT */}
            <TouchableOpacity
                onPress={() => {
                    if (setCameraIsActive) setCameraIsActive(true);
                }}
                style={styles.photo_button}>
                <>
                    <Text>{item.selected_amount}</Text>
                    <Ionicons name="camera" size={18} color={COLORS.black} />
                </>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => {
                    setDeletModalVisible(true);
                }}
                style={styles.discard_button}>
                <Text style={styles.light_text}>X</Text>
            </TouchableOpacity>
        </View>
    );
};

export default TakeOutUniqueSelectorButton;

const styles = StyleSheet.create({
    horizontal_flex: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-around",
    },
    discard_button: {
        width: 30,
        height: 40,
        backgroundColor: COLORS.mainColor,
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10,
        alignItems: "center",
        justifyContent: "center",
    },
    photo_button: {
        width: 50,
        height: 40,
        backgroundColor: COLORS.white,
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 10,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-evenly",
    },
    light_text: {
        color: COLORS.white,
    },
});
