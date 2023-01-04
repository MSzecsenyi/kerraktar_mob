import "react-native-gesture-handler";
import { QueryClient, QueryClientProvider } from "react-query";
import MainStack from "./src/navigation/MainStack";
import { UserDataProvider } from "./src/contexts/UserDataContext";
import { NavigationContainer } from "@react-navigation/native";
import { ItemDataProvider } from "./src/contexts/ItemDataContext";

const queryClient = new QueryClient();

export default function App() {
	return (
		<>
			<QueryClientProvider client={queryClient}>
				<NavigationContainer>
					<UserDataProvider>
						<ItemDataProvider>
							<MainStack />
						</ItemDataProvider>
					</UserDataProvider>
				</NavigationContainer>
			</QueryClientProvider>
		</>
	);
}
