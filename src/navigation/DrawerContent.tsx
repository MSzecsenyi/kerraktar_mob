import { StyleSheet, View, Text } from "react-native";
import { useContext } from "react";
import { useLogoutUser } from "../query-hooks/UseLoginUser";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { UserDataContext } from "../contexts/UserDataContext";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import LoadingSpinner from "../views/atoms/LoadingSpinner";
import { DrawerStackParamList } from "./ParamStacks";
import { useNavigation } from "@react-navigation/native";

const DrawerContent = () => {
	const logoutUser = useLogoutUser();
	const { loggedInUser } = useContext(UserDataContext);
	const navigation =
		useNavigation<
			DrawerNavigationProp<DrawerStackParamList, "TakeOutDrawer">
		>();

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

				<ScrollView>
					<Text style={styles.buttonGroupText}>Eszköz kivétel</Text>
					<TouchableOpacity
						style={styles.drawerButton}
						onPress={() =>
							navigation.navigate("TakeOutDrawer", { page: "CreateTakeOut" })
						}
					>
						<Text style={styles.buttonText}> - Új lista</Text>
					</TouchableOpacity>
					<TouchableOpacity
						style={styles.drawerButton}
						onPress={() => {
							navigation.navigate("TakeOutDrawer", { page: "SelectTakeOut" });
							console.log("eddigiek");
						}}
					>
						<Text style={styles.buttonText}> - Eddigi listák</Text>
					</TouchableOpacity>
				</ScrollView>
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
		height: 70,
		backgroundColor: "#eee",
		paddingHorizontal: 15,
		borderBottomColor: "#fff",
		borderBottomWidth: 4,
	},
	buttonGroupText: {
		color: "#333",
		fontSize: 18,
		fontWeight: "bold",
		lineHeight: 50,
		marginLeft: 5,
	},
	buttonText: {
		color: "#333",
		fontSize: 18,
		lineHeight: 66,
	},
	container: {
		alignItems: "center",
		justifyContent: "center",
		paddingVertical: 20,
		paddingHorizontal: 15,
	},
});
