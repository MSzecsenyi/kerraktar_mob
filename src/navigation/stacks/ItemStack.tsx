import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ItemStackParamList } from "../ParamStacks";
import ItemListManager from "../../views/pages/ItemListManager";
import ItemCreator from "../../views/pages/ItemCreator";

export default function ItemStack() {
	const RequestStack = createNativeStackNavigator<ItemStackParamList>();

	return (
		<RequestStack.Navigator
			screenOptions={{
				headerShown: false,
			}}
			initialRouteName="ItemListScreen">
			<RequestStack.Screen
				name="ItemListScreen"
				component={ItemListManager}
			/>
			<RequestStack.Screen
				name="ItemCreatorScreen"
				component={ItemCreator}
			/>
		</RequestStack.Navigator>
	);
}
