import { View, TextInput, StyleSheet } from "react-native";

interface Props {
    searchTerm: string;
    setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
}

const SearchBar: React.FC<Props> = ({ searchTerm, setSearchTerm }) => {
    return (
        <View style={styles.searchBarContainer}>
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
    searchBarContainer: {
        padding: 10,
        flex: 1,
        backgroundColor: "#f2f2f2",
    },
});

export default SearchBar;
