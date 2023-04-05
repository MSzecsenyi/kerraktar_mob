import { TakeOut } from "./../interfaces";

//TODO: mutate event esetén be klne húzni, hogy ne kelljen megvárni az refetch-t + megcsinálni Requestek esetén is

export type TakeOutAction =
    | { type: "CREATE_TAKEOUTS"; payload: { takeOuts: TakeOut[] } }
    | { type: "ADD_TAKEOUT"; payload: { takeOut: TakeOut } }
    | { type: "MODIFY_TAKEOUT"; payload: { id: number; end_date: Date } };

export const takeOutReducer = (takeOuts: TakeOut[], action: TakeOutAction) => {
    switch (action.type) {
        case "CREATE_TAKEOUTS":
            return action.payload.takeOuts;
        case "ADD_TAKEOUT":
            let newTakeOuts = takeOuts.concat([action.payload.takeOut]);
            return newTakeOuts;
        case "MODIFY_TAKEOUT":
            let modifiedTakeOuts = takeOuts.map((takeOut) => {
                if (takeOut.id === action.payload.id) {
                    return {
                        ...takeOut,
                        end_date: action.payload.end_date,
                    };
                } else return takeOut;
            });
            return modifiedTakeOuts;
        default:
            return takeOuts;
    }
};
