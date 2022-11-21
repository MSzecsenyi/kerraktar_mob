import { createContext, useReducer } from "react";
import { UserData } from "../interfaces";

type AppState = { userData: UserData } | { userData: null };
type Action =
	| { type: "SET_LOGGED_IN_USER"; payload: UserData }
	| { type: "DELETE_LOGGED_IN_USER" };

interface InputProviderProps {
	children: React.ReactNode;
}

const userData = {
	userData: null,
};

const reducer = (loggedInUser: AppState, action: Action) => {
	console.log("arrived to reducer");
	switch (action.type) {
		case "SET_LOGGED_IN_USER":
			console.log(`contextbe jött: ${action.payload}`);
			return {
				...loggedInUser,
				userData: action.payload,
			};
		case "DELETE_LOGGED_IN_USER":
			console.log("reducer delete ág");
			return {
				userData: null,
			};
		default:
			console.log("invalid type");
			return loggedInUser;
	}
};

const UserDataContext = createContext<{
	loggedInUser: AppState;
	dispatch: React.Dispatch<Action>;
}>({ loggedInUser: userData, dispatch: () => {} });

function UserDataProvider({ children }: InputProviderProps) {
	const [loggedInUser, dispatch] = useReducer(reducer, userData);

	console.log("in provider");

	return (
		<UserDataContext.Provider value={{ loggedInUser, dispatch }}>
			{children}
		</UserDataContext.Provider>
	);
}

export { UserDataContext, UserDataProvider };
