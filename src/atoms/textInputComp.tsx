import { useState } from "react";
import { SafeAreaView, Text, TextInput, View } from "react-native";
import { TextInputProps } from "../interfaces";

export default function TextInputComp({ label, placeHolder }: TextInputProps) {
	//variables
	const [text, setText] = useState("");

	return (
		<SafeAreaView>
			<Text>{label}</Text>
			<TextInput
				onChangeText={setText}
				value={placeHolder}
			/>
			<Text>{text}</Text>
		</SafeAreaView>
	);
}
