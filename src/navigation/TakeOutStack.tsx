import { createNativeStackNavigator } from "@react-navigation/native-stack";
import TakeOutListCreatorManager from "../views/pages/TakeOutListCreatorManager";
import TakeOutListSelector from "../views/pages/TakeOutListSelector";

export default function TakeOutStack() {
	const TakeOutStack = createNativeStackNavigator();

	return (
		<TakeOutStack.Navigator
			screenOptions={{
				headerShown: false,
			}}
			initialRouteName="TakeOutSelectorScreen"
		>
			<TakeOutStack.Screen
				name="TakeOutCreatorScreen"
				component={TakeOutListCreatorManager}
			/>
			<TakeOutStack.Screen
				name="TakeOutSelectorScreen"
				component={TakeOutListSelector}
			/>
		</TakeOutStack.Navigator>
	);
}
