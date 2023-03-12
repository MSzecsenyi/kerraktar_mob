import React, { createContext, useReducer } from "react";
import { UserData } from "../interfaces";

type Action =
	| { type: "SET_LOGGED_IN_USER"; payload: UserData }
	| { type: "DELETE_LOGGED_IN_USER" };

interface InputProviderProps {
	children: React.ReactNode;
}

const initialState: UserData = {
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
	stores: [],
};

const reducer = (loggedInUser: UserData, action: Action) => {
	switch (action.type) {
		case "SET_LOGGED_IN_USER":
			return {
				...loggedInUser,
				...action.payload,
			};
		case "DELETE_LOGGED_IN_USER":
			return initialState;
		default:
			return loggedInUser;
	}
};

const UserDataContext = createContext<{
	loggedInUser: UserData;
	dispatch: React.Dispatch<Action>;
}>({ loggedInUser: initialState, dispatch: () => {} });

function UserDataProvider({ children }: InputProviderProps) {
	const [loggedInUser, dispatch] = useReducer(reducer, initialState);
	console.log(loggedInUser.stores);

	return (
		<UserDataContext.Provider value={{ loggedInUser, dispatch }}>
			{children}
		</UserDataContext.Provider>
	);
}

export { UserDataContext, UserDataProvider };
