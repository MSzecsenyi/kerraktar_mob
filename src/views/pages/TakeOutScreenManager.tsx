import { TakeOutListProvider } from "../../contexts/TakeOutListContext";
import { TakeOutDrawerProps } from "../../interfaces";
import TakeOutListCreator from "./TakeOutListCreator";
import TakeOutListSelector from "./TakeOutListSelector";

const TakeOutScreenManager = ({ navigation, route }: TakeOutDrawerProps) => {
	switch (route.params.page) {
		case "CreateTakeOut":
			return (
				<TakeOutListProvider>
					<TakeOutListCreator
						navigation={navigation}
						route={route}
					/>
				</TakeOutListProvider>
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
