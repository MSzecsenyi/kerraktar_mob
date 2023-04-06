import { memo } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

interface BottomUniversalButtonProps {
    buttonIsActive?: boolean;
    buttonOnPress: () => void;
    children?: JSX.Element;
    buttonColor?: string;
}

const BottomUniversalButton = ({
    buttonIsActive = true,
    buttonOnPress,
    children = <MaterialIcons name={"done"} size={35} color="white" />,
    buttonColor = "#007aff",
}: BottomUniversalButtonProps) => {
    // console.log("kaki");
    const styles = StyleSheet.create({
        footerButton: {
            backgroundColor: buttonColor,
            width: 60,
            height: 60,
            borderRadius: 30,
            justifyContent: "center",
            alignItems: "center",
            marginHorizontal: 20,
        },
        inactiveFooterButton: {
            backgroundColor: "lightgray",
            width: 60,
            height: 60,
            borderRadius: 30,
            justifyContent: "center",
            alignItems: "center",
            marginHorizontal: 20,
        },
    });
    return (
        <TouchableOpacity
            style={
                buttonIsActive
                    ? styles.footerButton
                    : styles.inactiveFooterButton
            }
            onPress={buttonIsActive ? buttonOnPress : () => null}>
            {children}
        </TouchableOpacity>
    );
};

export default memo(BottomUniversalButton);
