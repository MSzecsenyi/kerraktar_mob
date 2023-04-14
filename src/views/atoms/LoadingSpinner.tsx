import { View, ActivityIndicator, StyleSheet } from "react-native";
import { COLORS } from "../../colors";

const LoadingSpinner = () => {
    return (
        <View style={styles.container}>
            <ActivityIndicator size="large" color={COLORS.mainColor} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});

export default LoadingSpinner;
