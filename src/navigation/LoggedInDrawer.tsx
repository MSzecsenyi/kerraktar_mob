import { createDrawerNavigator } from "@react-navigation/drawer";
import TakeOutListMaker from "../views/pages/TakeOutListMaker";

export default function LoggedInDrawer() {
	const Drawer = createDrawerNavigator();

	return (
		<Drawer.Navigator>
			<Drawer.Screen
				name="elso ablak"
				component={TakeOutListMaker}
			/>
		</Drawer.Navigator>
	);
}
