import { createDrawerNavigator } from "@react-navigation/drawer";
import TakeOutListMaker from "../views/pages/TakeOutListMaker";
import { DrawerStackParamList } from "./ParamStacks";
import DrawerContent from "./DrawerContent";

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
				name="TakeOutListMaker"
				component={TakeOutListMaker}
			/>
		</Drawer.Navigator>
	);
}
