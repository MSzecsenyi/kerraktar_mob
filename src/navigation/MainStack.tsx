import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginPage from "../views/pages/LoginPage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../constants";
import { UserDataContext } from "../contexts/UserDataContext";
import SplashScreen from "./SplashScreen";
import LoggedInDrawer from "./LoggedInDrawer";

const Stack = createNativeStackNavigator();

export default function MainStack() {
	const { dispatch, loggedInUser } = useContext(UserDataContext);
	const [isLoading, setIsLoadinig] = useState<Boolean>(true);

	// On app load I check if there is a saved bearer token, and if it is connected to an existing user
	useEffect(() => {
		const loadLogin = async () => {
			const token: string | null = await AsyncStorage.getItem("persToken");
			if (token != null) {
				var config = {
					method: "get",
					url: `${API_URL}checkuser`,
					headers: {
						Authorization: `Bearer ${token}`,
					},
				};
				await axios(config)
					.then(function (response) {
						dispatch({
							type: "SET_LOGGED_IN_USER",
							payload: response.data,
						});
						setIsLoadinig(false);
					})
					.catch(function (error) {
						console.log(error.response.status);
						if (error.response.status == 401) {
							AsyncStorage.removeItem("persToken");
							setIsLoadinig(false);
							console.log(
								"Unauthorized, you might have been logged out elsewhere"
							);
						} else {
							console.log(error);
						}
					});
			} else {
				setIsLoadinig(false);
			}
		};
		loadLogin();
	}, []);

	if (isLoading) {
		return <SplashScreen />;
	}

	return (
		<Stack.Navigator>
			{loggedInUser.userData.user.id != -1 ? (
				<Stack.Screen
					name="LoggedIn"
					component={LoggedInDrawer}
				/>
			) : (
				<Stack.Screen
					name="Login"
					component={LoginPage}
				/>
			)}
		</Stack.Navigator>
	);
}
