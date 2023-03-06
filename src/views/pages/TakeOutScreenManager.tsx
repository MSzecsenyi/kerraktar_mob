import { useEffect, useState } from "react";
import { TakeOutDrawerProps, TakeOutDrawerStates } from "../../interfaces";
import TakeOutListMaker from "./TakeOutListMaker";
import TakeOutListSelector from "./TakeOutListSelector";

const TakeOutScreenManager = ({ navigation, route }: TakeOutDrawerProps) => {
	switch (route.params.page) {
		case "CreateTakeOut":
			return (
				<TakeOutListMaker
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
