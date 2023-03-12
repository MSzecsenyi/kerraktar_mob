import { TakeOutDrawerProps } from "../../interfaces";
import TakeOutListCreatorManager from "./TakeOutListCreatorManager";
import TakeOutListSelector from "./TakeOutListSelector";

const TakeOutScreenManager = ({ navigation, route }: TakeOutDrawerProps) => {
	switch (route.params.page) {
		case "CreateTakeOut":
			return (
				<TakeOutListCreatorManager
					navigation={navigation}
					route={route}
				/>
			);
		case "SelectTakeOut":
			return (
				<TakeOutListSelector
				// navigation={undefined}
				// route={undefined}
				/>
			);
		default:
			return null;
	}
};

export default TakeOutScreenManager;
