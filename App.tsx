import { QueryClient, QueryClientProvider } from "react-query";
import MainStack from "./src/navigation/MainStack";
import { UserDataProvider } from "./src/contexts/UserDataContext";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { KeyboardAvoidingView, StyleSheet } from "react-native";
import { Platform } from "react-native";

const queryClient = new QueryClient();

export default function App() {
	return (
		<>
			<SafeAreaView style={styles.safeAreaView}>
				<KeyboardAvoidingView
					// behavior="height"
					style={{ flex: 1 }}>
					<QueryClientProvider client={queryClient}>
						<NavigationContainer>
							<UserDataProvider>
								<MainStack />
							</UserDataProvider>
						</NavigationContainer>
					</QueryClientProvider>
				</KeyboardAvoidingView>
			</SafeAreaView>
		</>
	);
}

const styles = StyleSheet.create({
	safeAreaView: {
		flex: 1,
		paddingTop: Platform.OS === "ios" ? 25 : 0, // Add padding for iOS
	},
});
