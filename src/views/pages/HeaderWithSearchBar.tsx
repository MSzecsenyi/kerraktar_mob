import { StyleSheet, TouchableOpacity, View, Text } from "react-native";
import SearchBar from "../atoms/SearchBar";
import { LoginDrawerProps } from "../../interfaces";
import { Ionicons } from "@expo/vector-icons";

interface HeaderWithSearchBarProps {
	searchTerm?: string;
	setSearchTerm?: React.Dispatch<React.SetStateAction<string>>;
	drawerProps: LoginDrawerProps;
	title?: string;
}

const HeaderWithSearchBar = ({
	drawerProps,
	searchTerm,
	setSearchTerm,
	title,
}: HeaderWithSearchBarProps) => {
	return (
		<View style={styles.headerContainer}>
			<TouchableOpacity
				style={styles.menuIconStyle}
				onPress={drawerProps.navigation.openDrawer}
			>
				<Ionicons
					name="menu"
					size={40}
					color="#333"
				/>
			</TouchableOpacity>
			{setSearchTerm && (searchTerm == "" || searchTerm) ? (
				<SearchBar
					searchTerm={searchTerm}
					setSearchTerm={setSearchTerm}
				/>
			) : null}
			{title ? <Text style={styles.titleText}>{title}</Text> : null}
		</View>
	);
};

export default HeaderWithSearchBar;

const styles = StyleSheet.create({
	headerContainer: {
		flexDirection: "row",
		alignItems: "center",
		height: 60,
	},
	menuIconStyle: {
		paddingLeft: 12,
	},
	titleText: {
		fontWeight: "bold",
		textAlign: "center",
		fontSize: 18,
	},
});
