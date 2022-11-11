import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, TextInput, View } from "react-native";
import TextInputComp from "./src/atoms/textInputComp";

export default function App() {
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
			<StatusBar style="auto" />
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
