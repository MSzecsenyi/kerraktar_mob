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
		useNavigation<DrawerNavigationProp<DrawerStackParamList, "TakeOutStack">>();

	return (
		<View style={styles.mainContainer}>
			<View>
				<View style={styles.headerContainer}>
					<Text style={styles.headerInfoNumberText}>
						{loggedInUser.user.group_number}
					</Text>
					<Text style={styles.headerInfoText}>{loggedInUser.user.name}</Text>
				</View>

				<ScrollView>
					<TouchableOpacity
						style={styles.drawerButton}
						onPress={() => {
							navigation.navigate("TakeOutStack", {});
						}}
					>
						<Text style={styles.buttonText}> Eszközkivétel </Text>
					</TouchableOpacity>
					<TouchableOpacity
						style={styles.drawerButton}
						onPress={() => {
							navigation.navigate("RequestSelectorDrawer", {});
						}}
					>
						<Text style={styles.buttonText}> Eszközfoglalás</Text>
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
		backgroundColor: "#004d00",
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
		height: 50,
		backgroundColor: "#eee",
		paddingHorizontal: 15,
		borderBottomColor: "#fff",
		borderBottomWidth: 4,
	},
	buttonText: {
		color: "#333",
		fontSize: 18,
		lineHeight: 46,
	},
	container: {
		alignItems: "center",
		justifyContent: "center",
		paddingVertical: 20,
		paddingHorizontal: 15,
	},
});
