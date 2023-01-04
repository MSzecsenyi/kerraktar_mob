import React, { createContext, useReducer } from "react";
import { UserData } from "../interfaces";

type AppState = typeof initialState;
type Action =
	| { type: "SET_LOGGED_IN_USER"; payload: UserData }
	| { type: "DELETE_LOGGED_IN_USER" };

interface InputProviderProps {
	children: React.ReactNode;
}

const initialState = {
	userData: {
		user: {
			id: -1,
			name: "",
			email: "",
			email_verified_at: new Date("1900-05-05"),
			group_number: -1,
			district: -1,
			phone: -1,
			is_group: false,
			is_storekeeper: false,
			is_admin: false,
			created_at: new Date("1900-05-05"),
			updated_at: new Date("1900-05-05"),
			deleted_at: new Date("1900-05-05"),
		},
		token: "",
	},
};

const reducer = (loggedInUser: AppState, action: Action) => {
	switch (action.type) {
		case "SET_LOGGED_IN_USER":
			console.log(action.payload);
			return {
				...loggedInUser,
				userData: action.payload,
			};
		case "DELETE_LOGGED_IN_USER":
			return {
				...loggedInUser,
				userData: initialState.userData,
			};
		default:
			return loggedInUser;
	}
};

const UserDataContext = createContext<{
	loggedInUser: AppState;
	dispatch: React.Dispatch<Action>;
}>({ loggedInUser: initialState, dispatch: () => {} });

function UserDataProvider({ children }: InputProviderProps) {
	const [loggedInUser, dispatch] = useReducer(reducer, initialState);

	return (
		<UserDataContext.Provider value={{ loggedInUser, dispatch }}>
			{children}
		</UserDataContext.Provider>
	);
}

export { UserDataContext, UserDataProvider };
