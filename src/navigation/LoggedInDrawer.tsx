import { createDrawerNavigator } from "@react-navigation/drawer";
import { DrawerStackParamList } from "./ParamStacks";
import DrawerContent from "./DrawerContent";
import RequestSelector from "../views/pages/RequestSelector";
import TakeOutStack from "./TakeOutStack";

export default function LoggedInDrawer() {
	const Drawer = createDrawerNavigator<DrawerStackParamList>();

	return (
		<Drawer.Navigator
			screenOptions={{
				headerShown: false,
			}}
			drawerContent={() => <DrawerContent />}
		>
			<Drawer.Screen
				name="TakeOutStack"
				component={TakeOutStack}
			/>
			<Drawer.Screen
				name="RequestSelectorDrawer"
				component={RequestSelector}
			/>
		</Drawer.Navigator>
	);
}
