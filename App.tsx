import { QueryClient, QueryClientProvider } from "react-query";
import LoginPage from "./src/pages/LoginPage";
import { UserDataContext, UserDataProvider } from "./src/contexts/UserData";
import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useContext } from "react";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { useCallback } from "react";
import { User, UserData } from "./src/interfaces";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

export default function App() {
	const [appReady, setAppReady] = useState<boolean>(false);
	const { loggedInUser, dispatch } = useContext(UserDataContext);

	useEffect(() => {
		async function prepare() {
			AsyncStorage.getItem("userData")
				.then((result) => {
					if (result !== null) {
						const resultUser: UserData = JSON.parse(result);
						console.log(dispatch);
						dispatch({
							type: "SET_LOGGED_IN_USER",
							payload: resultUser,
						});
						new Promise((resolve) => setTimeout(resolve, 2000));
					}
				})
				.catch((e) => console.log(e))
				.finally(() => setAppReady(true));
		}

		if (!appReady) {
			prepare();
		}
	}, [appReady]);

	const onLayoutRootView = useCallback(async () => {
		if (appReady) {
			await SplashScreen.hideAsync();
		}
	}, [appReady]);

	if (!appReady) {
		return null;
	}

	return (
		<>
			<UserDataProvider>
				<QueryClientProvider client={queryClient}>
					<LoginPage onLayout={onLayoutRootView} />
				</QueryClientProvider>
			</UserDataProvider>
		</>
	);
}
