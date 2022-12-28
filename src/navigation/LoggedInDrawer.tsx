import { createDrawerNavigator } from "@react-navigation/drawer";
import LoginPage from "../views/pages/LoginPage";

export default function LoggedInDrawer() {
	const Drawer = createDrawerNavigator();

	return (
		<Drawer.Navigator>
			<Drawer.Screen
				name="elso ablak"
				component={LoginPage}
			/>
		</Drawer.Navigator>
	);
}
