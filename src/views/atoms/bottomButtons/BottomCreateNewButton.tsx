import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../../colors";

interface BottomCreateNewButtonProps {
    text: string;
    onPress: () => void;
}

const BottomCreateNewButton = ({
    text,
    onPress,
}: BottomCreateNewButtonProps) => {
    return (
        <TouchableOpacity style={styles.buttonContaier} onPress={onPress}>
            <>
                <View style={styles.horizontalContainer}>
                    <Ionicons name="add" size={35} color={COLORS.white} />
                    <Text style={styles.textStyle}>{text}</Text>
                </View>
            </>
        </TouchableOpacity>
    );
};

export default BottomCreateNewButton;

const styles = StyleSheet.create({
    buttonContaier: {
        minWidth: 100,
        height: 50,
        backgroundColor: COLORS.mainColor,
        borderRadius: 15,
        elevation: 8,
        shadowOpacity: 0.8,
        alignItems: "center",
        justifyContent: "center",
        padding: 10,
    },
    textStyle: {
        textAlign: "center",
        color: COLORS.white,
    },
    horizontalContainer: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
});
