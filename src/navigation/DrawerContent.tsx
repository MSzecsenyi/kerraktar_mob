import { StyleSheet, View, Text } from "react-native";
import { useContext } from "react";
import { useLogoutUser } from "../query-hooks/UseLoginUser";
import { TouchableOpacity } from "react-native-gesture-handler";
import { UserDataContext } from "../contexts/UserDataContext";
import { useNavigation } from "@react-navigation/native";
import LoadingSpinner from "../views/atoms/LoadingSpinner";

const DrawerContent = () => {
	const logoutUser = useLogoutUser();
	const { loggedInUser } = useContext(UserDataContext);
	const navigation = useNavigation();

	return (
		<View style={styles.mainContainer}>
			<View>
				<View style={styles.headerContainer}>
					<Text style={styles.headerInfoNumberText}>
						{loggedInUser.userData.user.group_number}
					</Text>
					<Text style={styles.headerInfoText}>
						{loggedInUser.userData.user.name}
					</Text>
				</View>

				<TouchableOpacity
					style={styles.drawerButton}
					onPress={() => navigation.navigate("TakeOutListMaker")}
				>
					<Text style={styles.buttonText}>Eszköz kivétel</Text>
				</TouchableOpacity>
			</View>
			<View style={styles.container}>
				{logoutUser.isLoading || logoutUser.isSuccess ? (
					<LoadingSpinner />
				) : (
					<TouchableOpacity onPress={() => logoutUser.mutate()}>
						<Text>Kilépés</Text>
					</TouchableOpacity>
				)}
			</View>
		</View>
	);
};

export default DrawerContent;

const styles = StyleSheet.create({
	mainContainer: {
		flex: 1,
		justifyContent: "space-between",
	},
	headerContainer: {
		height: "40%",
		backgroundColor: "#333",
		paddingHorizontal: 15,
		paddingTop: "10%",
		justifyContent: "space-evenly",
		borderBottomEndRadius: 10,
	},
	headerInfoNumberText: {
		fontSize: 28,
		color: "#fff",
	},
	headerInfoText: {
		fontSize: 24,
		color: "#fff",
	},
	drawerButton: {
		height: 70, // set the height of the button
		backgroundColor: "#eee",
		paddingHorizontal: 15,
	},
	buttonText: {
		color: "#333",
		fontSize: 18,
		fontWeight: "bold",
		lineHeight: 70,
	},
	container: {
		alignItems: "center",
		justifyContent: "center",
		paddingVertical: 20,
		paddingHorizontal: 15,
	},
});
