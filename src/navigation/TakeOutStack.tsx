import { createNativeStackNavigator } from "@react-navigation/native-stack";
import TakeOutListCreatorManager from "../views/pages/TakeOutListCreatorManager";
import TakeOutListSelector from "../views/pages/TakeOutListSelector";
import { TakeOutStackParams } from "./ParamStacks";
import TakeOutDetails from "../views/pages/TakeOutDetails";

export default function TakeOutStack() {
    const TakeOutStack = createNativeStackNavigator<TakeOutStackParams>();

    return (
        <TakeOutStack.Navigator
            screenOptions={{
                headerShown: false,
            }}
            initialRouteName="TakeOutSelectorScreen">
            <TakeOutStack.Screen
                name="TakeOutCreatorScreen"
                component={TakeOutListCreatorManager}
            />
            <TakeOutStack.Screen
                name="TakeOutSelectorScreen"
                component={TakeOutListSelector}
            />
            <TakeOutStack.Screen
                name="TakeOutDetailsScreen"
                component={TakeOutDetails}
            />
        </TakeOutStack.Navigator>
    );
}
