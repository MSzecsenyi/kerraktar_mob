import { View, TextInput, StyleSheet } from "react-native";
import { COLORS } from "../../colors";

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
        backgroundColor: COLORS.white,
        paddingHorizontal: 5,
        borderRadius: 13,
        borderWidth: 1,
        borderColor: COLORS.inactive,
    },
    searchBarContainer: {
        paddingHorizontal: 12,
        paddingBottom: 43,
        height: 40,
        backgroundColor: "#f2f2f2",
    },
});

export default SearchBar;
