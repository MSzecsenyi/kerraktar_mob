import { useState } from "react";
import { SafeAreaView, StyleSheet, Text, TextInput } from "react-native";
import { TextInputProps } from "../interfaces";

export default function TextInputComp({ label, placeHolder }: TextInputProps) {
	//variables
	const [text, setText] = useState(placeHolder);

	return (
		<SafeAreaView style={styles.container}>
			<Text>{label}</Text>
			<TextInput
				onChangeText={setText}
				value={text}
				style={styles.textInput}
			/>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		alignItems: "center",
		justifyContent: "center",
	},

	textInput: {
		height: 40,
		margin: 12,
		borderWidth: 1,
		padding: 10,
	},
});
