import React, { createContext, useReducer } from "react";
import { ShortItem, TakeOutList, UniquePiece } from "../interfaces";

type AppState = typeof initialState;
type Action =
	| { type: "ADD_ITEM"; payload: ShortItem }
	| { type: "MODIFY_ITEM"; payload: ShortItem }
	| { type: "DELETE_ITEM"; payload: number }
	| { type: "ADD_UNIQUE_ITEM"; payload: number }
	| { type: "DELETE_UNIQUE_ITEM"; payload: number }
	| { type: "ADD_UNIQUE_PIECE"; payload: UniquePiece }
	| { type: "DELETE_UNIQUE_PIECE"; payload: UniquePiece }
	| { type: "SET_NAME"; payload: string }
	| { type: "SET_USER"; payload: number };

interface InputProviderProps {
	children: React.ReactNode;
}

const initialState: TakeOutList = {
	take_out_name: "",
	user: -1,
	store_id: -1,
	items: [],
	uniqueItems: [],
};

const reducer = (state: AppState, action: Action) => {
	console.log(state);
	switch (action.type) {
		case "ADD_ITEM":
			return {
				...state,
				items: [...state.items, action.payload],
			};
		case "MODIFY_ITEM":
			return {
				...state,
				items: state.items.map((item) => {
					if (item.id === action.payload.id) {
						return {
							...item,
							amount: action.payload.amount,
						};
					}
					return item;
				}),
			};
		case "DELETE_ITEM":
			return {
				...state,
				items: state.items.filter((item) => item.id !== action.payload),
			};
		case "ADD_UNIQUE_ITEM":
			return {
				...state,
				uniqueItems: [
					...state.uniqueItems,
					{ unique_items: [], item_id: action.payload },
				],
			};
		case "DELETE_UNIQUE_ITEM":
			return {
				...state,
				uniqueItems: state.uniqueItems.filter(
					(uniqueItem) => uniqueItem.item_id !== action.payload
				),
			};
		case "ADD_UNIQUE_PIECE":
			return {
				...state,
				uniqueItems: state.uniqueItems.map((uniqueItem) => {
					if (uniqueItem.item_id === action.payload.item_id) {
						return {
							...uniqueItem,
							uniqueItems: [...state.uniqueItems, action.payload],
						};
					}
					return uniqueItem;
				}),
			};
		case "DELETE_UNIQUE_PIECE":
			return {
				...state,
				uniqueItems: state.uniqueItems.map((uniqueItem) => {
					if (uniqueItem.item_id === action.payload.item_id) {
						return {
							...uniqueItem,
							uniqueItems: [...state.uniqueItems, action.payload],
						};
					}
					return uniqueItem;
				}),
			};
		case "SET_NAME":
			return {
				...state,
				takeOutListName: action.payload,
			};
		case "SET_USER":
			return {
				...state,
				user: action.payload,
			};
		default:
			return state;
	}
};

const TakeOutListContext = createContext<{
	state: AppState;
	dispatch: React.Dispatch<Action>;
}>({ state: initialState, dispatch: () => {} });

function TakeOutListProvider({ children }: InputProviderProps) {
	const [state, dispatch] = useReducer(reducer, initialState);

	return (
		<TakeOutListContext.Provider value={{ state, dispatch }}>
			{children}
		</TakeOutListContext.Provider>
	);
}

export { TakeOutListContext, TakeOutListProvider };
