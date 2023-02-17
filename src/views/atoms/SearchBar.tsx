import React, { useState } from "react";
import { View, TextInput, StyleSheet } from "react-native";

interface Props {
	searchTerm: string;
	setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
}

const SearchBar: React.FC<Props> = ({ searchTerm, setSearchTerm }) => {
	return (
		<View style={styles.container}>
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
	container: {
		padding: 10,
		backgroundColor: "#f2f2f2",
	},
	input: {
		height: 40,
		backgroundColor: "white",
		paddingHorizontal: 5,
		borderRadius: 5,
	},
});

export default SearchBar;
