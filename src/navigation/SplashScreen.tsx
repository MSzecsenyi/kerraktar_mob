import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";

const SplashScreen: React.FC = () => {
    return (
        <View style={styles.container}>
            <Image
                source={require("../../assets/splash_bunny.jpg")}
                style={styles.image}
            />
            <Text>Loading...</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    image: {
        resizeMode: "center",
    },
});

export default SplashScreen;
