import "react-native-gesture-handler";
import { QueryClient, QueryClientProvider } from "react-query";
import MainStack from "./src/navigation/MainStack";
import { UserDataProvider } from "./src/contexts/UserDataContext";
import { NavigationContainer } from "@react-navigation/native";

const queryClient = new QueryClient();

export default function App() {
	return (
		<>
			<QueryClientProvider client={queryClient}>
				<NavigationContainer>
					<UserDataProvider>
						<MainStack />
					</UserDataProvider>
				</NavigationContainer>
			</QueryClientProvider>
		</>
	);
}
