import { View, StyleSheet } from "react-native";
import React from "react";
import TextInputComp from "../atoms/textInputComp";

export default function LoginPage() {
	return (
		<View style={styles.container}>
			<TextInputComp
				placeHolder={"kerraktar@cserkesz.hu"}
				label={"Felhasználónév"}
			/>
			<TextInputComp
				placeHolder="****"
				label={"Jelszó"}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
		alignItems: "center",
		justifyContent: "center",
	},
});
