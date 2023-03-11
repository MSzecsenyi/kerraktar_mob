import { Item } from "../interfaces";

export type Action =
	| { type: "CREATE_ITEMS";           payload: {items: Item[]} }
	| { type: "ADD_ITEM";               payload: {id: number} }
	| { type: "MODIFY_ITEM";            payload: {id: number, amount: number} }
	| { type: "DELETE_ITEM";            payload: {id: number} }
	| { type: "ADD_UNIQUE_ITEM";        payload: {id: number} }
	| { type: "DELETE_UNIQUE_ITEM";     payload: {id: number} }
	| { type: "ADD_UNIQUE_PIECE";       payload: {id: number, uniqueId: string} }
	| { type: "DELETE_UNIQUE_PIECE";    payload: {id: number, uniqueId: string} };

export const itemReducer = (items: Item[], action: Action ) => {
    switch (action.type) {
        case "CREATE_ITEMS":
            return action.payload.items;
        case "ADD_ITEM":
            var newItems = items.map((item) => {
                if(item.id === action.payload.id) {
                    return {
                        ...item,
                        is_selected: true,
                    }
                }
                return item;
            })
            return newItems;
        case "MODIFY_ITEM":
            var newItems = items.map((item) => {
                if(item.id === action.payload.id) {
                    return {
                        ...item,
                        selected_amount: action.payload.amount,
                    }
                }
                return item;
            })
            return newItems;
        case "DELETE_ITEM":
            var newItems = items.map((item) => {
                if(item.id === action.payload.id) {
                    return {
                        ...item,
                        is_selected: false,
                    }
                }
                return item;
            })
            return newItems;
        case "ADD_UNIQUE_ITEM":
            var newItems = items.map((item) => {
                if(item.id === action.payload.id) {
                    return {
                        ...item,
                        is_selected: true,
                    }
                }
                return item;
            })
            return newItems;
        case "DELETE_UNIQUE_ITEM":
            console.log("hali")
            var newItems = items.map((item) => {
                if(item.id === action.payload.id) {
                    return {
                        ...item,
                        is_selected: false,
                        selected_unique_items: [],
                        selected_amount: 0
                    }
                }
                return item;
            })
            return newItems;
        case "ADD_UNIQUE_PIECE":
            var newItems = items.map((item) => {
                if(item.id === action.payload.id) {
                    return {
                        ...item,
                        selected_amount: item.selected_amount + 1,
                        selected_unique_items: item.selected_unique_items.concat([action.payload.uniqueId]),
                        is_selected: true,
                    }
                }
                return item;
            })
            return newItems;
        case "DELETE_UNIQUE_PIECE":
            var isEmpty = items.find((item) => item.id === action.payload.id)?.selected_unique_items.length == 1;

            var newItems = items.map((item) => {
                if(item.id === action.payload.id) {
                    return {
                        ...item,
                        selected_amount: item.selected_amount - 1,
                        selected_unique_items: item.selected_unique_items.filter((uniqueItem) => {
                            uniqueItem !== action.payload.uniqueId
                        }),
                        is_selected: isEmpty ? false : true,
                    }
                }
                return item;
            })
            return newItems;    
        default:
            return items;
    }
}