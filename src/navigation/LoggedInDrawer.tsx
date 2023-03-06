import { createDrawerNavigator } from "@react-navigation/drawer";
import { DrawerStackParamList } from "./ParamStacks";
import DrawerContent from "./DrawerContent";
import TakeOutScreenManager from "../views/pages/TakeOutScreenManager";

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
				name="TakeOutDrawer"
				component={TakeOutScreenManager}
				initialParams={{ page: "CreateTakeOut" }}
			/>
		</Drawer.Navigator>
	);
}
