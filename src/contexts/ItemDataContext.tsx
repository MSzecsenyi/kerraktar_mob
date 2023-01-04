import React, { createContext, useReducer } from "react";
import { Item, Items } from "../interfaces";

type AppState = typeof initialState;
type Action = { type: "SET_INPUT_VALUE"; payload: Item } | { type: "X" };

interface ItemProviderProps {
	children: React.ReactNode;
}

const initialState: Items = {
	items: [],
};

const reducer = (state: AppState, action: Action) => {
	switch (action.type) {
		case "SET_INPUT_VALUE":
			return {
				...state,
				itemValue: action.payload,
			};
		case "X":
			return {
				...state,
				itemValue: 100,
			};
		default:
			return state;
	}
};

const ItemDataContext = createContext<{
	state: AppState;
	dispatch: React.Dispatch<Action>;
}>({ state: initialState, dispatch: () => {} });

function ItemDataProvider({ children }: ItemProviderProps) {
	const [state, dispatch] = useReducer(reducer, initialState);

	return (
		<ItemDataContext.Provider value={{ state, dispatch }}>
			{children}
		</ItemDataContext.Provider>
	);
}

export { ItemDataContext, ItemDataProvider };
