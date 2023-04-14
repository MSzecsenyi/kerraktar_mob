import { StyleSheet } from "react-native";
import { COLORS } from "./colors";

export const modalStyles = StyleSheet.create({
    textContainer: {
        flex: 1,
        flexDirection: "column",
        justifyContent: "center",
    },
    mainText: {
        fontSize: 20,
        textAlign: "center",
        marginBottom: 10,
    },
    infoText: {
        fontSize: 16,
        textAlign: "center",
    },
    boldText: {
        fontWeight: "bold",
    },
    buttonContainer: {
        marginTop: 20,
        flexDirection: "row",
        justifyContent: "space-around",
    },
    buttonOuterContent: {
        justifyContent: "flex-end",
        marginBottom: 20,
    },
    buttonReject: {
        paddingHorizontal: 10,
        minWidth: 100,
        maxWidth: "50%",
        height: 40,
        borderColor: COLORS.mainColor,
        borderWidth: 2,
        borderRadius: 15,
        justifyContent: "center",
    },
    buttonAccept: {
        paddingHorizontal: 10,
        minWidth: 100,
        maxWidth: "50%",
        height: 40,
        backgroundColor: COLORS.mainColor,
        borderRadius: 15,
        justifyContent: "center",
    },
    buttonDisabled: {
        paddingHorizontal: 10,
        minWidth: 100,
        maxWidth: "50%",
        height: 40,
        backgroundColor: COLORS.inactive,
        borderRadius: 15,
        justifyContent: "center",
    },
    textInput: {
        borderRadius: 10,
        borderWidth: 1,
        borderColor: COLORS.border,
        height: 40,
        padding: 10,
        marginTop: 20,
    },
    buttonRejectDelete: {
        paddingHorizontal: 10,
        minWidth: 100,
        maxWidth: "50%",
        height: 40,
        borderColor: COLORS.warning,
        borderWidth: 2,
        borderRadius: 15,
        justifyContent: "center",
    },
    buttonDelete: {
        paddingHorizontal: 10,
        minWidth: 100,
        maxWidth: "50%",
        height: 40,
        backgroundColor: COLORS.warning,
        borderRadius: 15,
        justifyContent: "center",
    },
    buttonRejectText: {
        textAlign: "center",
    },
    buttonAcceptText: {
        textAlign: "center",
        color: COLORS.white,
        fontWeight: "bold",
    },
});
