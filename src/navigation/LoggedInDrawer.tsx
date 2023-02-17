import { createDrawerNavigator } from "@react-navigation/drawer";
import TakeOutListMaker from "../views/pages/TakeOutListMaker";
import { useLogoutUser } from "../query-hooks/UseLoginUser";
import { Button } from "react-native";

export default function LoggedInDrawer() {
	const Drawer = createDrawerNavigator();

	const logoutUser = useLogoutUser();

	return (
		<Drawer.Navigator
			screenOptions={{
				headerShown: false,
			}}
			drawerContent={() => (
				<Button
					title="Kilépés"
					onPress={() => logoutUser.mutate()}
				/>
			)}
		>
			<Drawer.Screen
				name="elso ablak"
				component={TakeOutListMaker}
			/>
		</Drawer.Navigator>
	);
}
