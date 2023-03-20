import { createDrawerNavigator } from "@react-navigation/drawer";
import { DrawerStackParamList } from "./ParamStacks";
import DrawerContent from "./DrawerContent";
import TakeOutStack from "./TakeOutStack";
import RequestStack from "./RequestStack";

export default function LoggedInDrawer() {
	const Drawer = createDrawerNavigator<DrawerStackParamList>();

	return (
		<Drawer.Navigator
			screenOptions={{
				headerShown: false,
			}}
			drawerContent={() => <DrawerContent />}
			initialRouteName="RequestSelectorDrawer"
		>
			<Drawer.Screen
				name="TakeOutStack"
				component={TakeOutStack}
			/>
			<Drawer.Screen
				name="RequestSelectorDrawer"
				component={RequestStack}
			/>
		</Drawer.Navigator>
	);
}
