import { DrawerScreenProps } from "@react-navigation/drawer";
import { DrawerStackParamList } from "./navigation/ParamStacks";
import { Action } from "./contexts/ItemReducer";

export interface TextInputProps {
    name: string;
    handleOnChange: ((text: string, name: string) => void);
    placeHolder?: string;
    label?: string;
    isPassword?: boolean;
}
export interface LoginInfo {
    email: string;
    password: string;
}
export interface UserData {
    user: User
    token: string
}

export interface User {
    id: number,
    name: string,
    email: string,
    email_verified_at: Date,
    group_number: number,
    district: number,
    phone: number,
    is_group: boolean,
    is_storekeeper: boolean,
    is_admin: boolean,
    created_at: Date,
    updated_at: Date,
    deleted_at: Date
}

export interface Item {
    id: number,
    district: number,
    category: string,
    store_id: number,
    owner: string,
    item_name: string,
    amount: number,
    comment: string,
    is_unique: boolean,
    in_store_amount: number,
    unique_items: UniqueItem[],
    is_selected: boolean,
    selected_amount: number,
    selected_unique_items: string[],
}
export interface UniqueItem {
    unique_id: string,
    alt_name: string
}
export interface TakeOutButtonProps {
	item: Item;
	dispatchItems: React.Dispatch<Action>;
	setCameraIsActive?: React.Dispatch<React.SetStateAction<boolean>>;
}
export interface ItemFilterBarProps {
	setFilteredData: React.Dispatch<React.SetStateAction<Item[]>>;
	filteredData: Item[];
}

export type TakeOutDrawerStates = "CreateTakeOut" | "SelectTakeOut" 

export type TakeOutDrawerProps = DrawerScreenProps<
	DrawerStackParamList,
	"TakeOutDrawer"
>;