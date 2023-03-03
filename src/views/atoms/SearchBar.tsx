import React, { useState } from "react";
import {
	View,
	TextInput,
	StyleSheet,
	StyleProp,
	ViewStyle,
} from "react-native";

interface Props {
	searchTerm: string;
	setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
	style: StyleProp<ViewStyle>;
}

const SearchBar: React.FC<Props> = ({ searchTerm, setSearchTerm, style }) => {
	return (
		<View style={style}>
			<TextInput
				style={styles.input}
				placeholder="Keresés..."
				value={searchTerm}
				onChangeText={(text) => setSearchTerm(text)}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	input: {
		height: 40,
		backgroundColor: "white",
		paddingHorizontal: 5,
		borderRadius: 5,
	},
});

export default SearchBar;
