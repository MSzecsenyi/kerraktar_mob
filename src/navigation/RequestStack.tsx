import { createNativeStackNavigator } from "@react-navigation/native-stack";
import RequestSelector from "../views/pages/RequestSelector";

export default function TakeOutStack() {
	const RequestStack = createNativeStackNavigator();

	return (
		<RequestStack.Navigator
			screenOptions={{
				headerShown: false,
			}}
			initialRouteName="RequestSelectorScreen"
		>
			{/* <RequestStack.Screen
				name="RequestCreatorScreen"
				component={RequestListCreatorManager}
			/> */}
			<RequestStack.Screen
				name="RequestSelectorScreen"
				component={RequestSelector}
			/>
		</RequestStack.Navigator>
	);
}
