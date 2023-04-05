import { RequestItem } from "../interfaces";

export type RequestItemAction =
    | { type: "CREATE_ITEMS"; payload: { items: RequestItem[] } }
    | { type: "ADD_ITEM"; payload: { id: number } }
    | { type: "MODIFY_ITEM"; payload: { id: number; amount: number } }
    | { type: "DELETE_ITEM"; payload: { id: number } };

export const requestItemReducer = (
    items: RequestItem[],
    action: RequestItemAction
) => {
    switch (action.type) {
        case "CREATE_ITEMS":
            return action.payload.items;
        case "ADD_ITEM":
            var newItems = items.map((item) => {
                if (item.id === action.payload.id) {
                    return {
                        ...item,
                        is_selected: true,
                    };
                }
                return item;
            });
            return newItems;
        case "MODIFY_ITEM":
            var newItems = items.map((item) => {
                if (item.id === action.payload.id) {
                    return {
                        ...item,
                        selected_amount: action.payload.amount,
                    };
                }
                return item;
            });
            return newItems;
        case "DELETE_ITEM":
            var newItems = items.map((item) => {
                if (item.id === action.payload.id) {
                    return {
                        ...item,
                        is_selected: false,
                    };
                }
                return item;
            });
            return newItems;
        default:
            return items;
    }
};
