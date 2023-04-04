import { createDrawerNavigator } from "@react-navigation/drawer";
import { LoginDrawerParamList } from "./ParamStacks";
import DrawerContent from "./DrawerContent";
import TakeOutStack from "./TakeOutStack";
import RequestStack from "./RequestStack";

export default function LoggedInDrawer() {
	const Drawer = createDrawerNavigator<LoginDrawerParamList>();

	return (
		<Drawer.Navigator
			screenOptions={{
				headerShown: false,
			}}
			drawerContent={() => <DrawerContent />}
			initialRouteName="RequestStack"
		>
			<Drawer.Screen
				name="TakeOutStack"
				component={TakeOutStack}
			/>
			<Drawer.Screen
				name="RequestStack"
				component={RequestStack}
			/>
		</Drawer.Navigator>
	);
}
