import { createNativeStackNavigator } from "@react-navigation/native-stack";
import RequestListCreatorManager from "../../views/pages/RequestCreatorManager";
import RequestSelector from "../../views/pages/RequestSelector";
import { RequestStackParamList } from "../ParamStacks";
import RequestDetails from "../../views/pages/RequestDetails";

export default function RequestStack() {
	const RequestStack = createNativeStackNavigator<RequestStackParamList>();

	return (
		<RequestStack.Navigator
			screenOptions={{
				headerShown: false,
			}}
			initialRouteName="RequestSelectorScreen">
			<RequestStack.Screen
				name="RequestSelectorScreen"
				component={RequestSelector}
			/>
			<RequestStack.Screen
				name="RequestCreatorScreen"
				component={RequestListCreatorManager}
			/>
			<RequestStack.Screen
				name="RequestDetailsScreen"
				component={RequestDetails}
			/>
		</RequestStack.Navigator>
	);
}
