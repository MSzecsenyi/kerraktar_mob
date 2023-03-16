import { createDrawerNavigator } from "@react-navigation/drawer";
import { DrawerStackParamList } from "./ParamStacks";
import DrawerContent from "./DrawerContent";
import TakeOutListSelector from "../views/pages/TakeOutListSelector";
import TakeOutListCreatorManager from "../views/pages/TakeOutListCreatorManager";

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
				name="TakeOutCreatorDrawer"
				component={TakeOutListCreatorManager}
			/>
			<Drawer.Screen
				name="TakeOutSelectorDrawer"
				component={TakeOutListSelector}
			/>
		</Drawer.Navigator>
	);
}
