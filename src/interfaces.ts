import { DrawerScreenProps } from "@react-navigation/drawer";
import { DrawerStackParamList } from "./navigation/ParamStacks";
import { ItemAction } from "./contexts/ItemReducer";
import { TakeOutAction } from "./contexts/TakeOutReducer";
export interface LoginInfo {
    email: string;
    password: string;
}
export interface UserData {
    user: User
    token: string
    stores: Store[]
}
export interface Store {
    address: string
    store_id: number
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
    deleted_at: Date,
}
export interface Item {
    id: number,
    district: number,
    category: string,
    store: number,
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
export interface ItemButtonProps {
	item: Item;
	dispatchItems: React.Dispatch<ItemAction>;
	setCameraIsActive?: React.Dispatch<React.SetStateAction<boolean>>;
}
export interface ItemFilterBarProps {
	setFilteredData: React.Dispatch<React.SetStateAction<Item[]>>;
	filteredData: Item[];
}

export type LoginDrawerProps = DrawerScreenProps<
	DrawerStackParamList
>
export interface TakeOutList {
    items: TakeOutListCommonItem[]
    uniqueItems: string[],
    store_id: number,
    take_out_name: string,
}

export interface TakeOutListCommonItem {
    id: number
    amount: number
}
export interface TakeOut {
    id: number
    start_date: Date
    end_date: Date | null
    user: string
    store: number
    take_out_name: string
}
export interface TakeOutButtonProps {
    drawerProps?: LoginDrawerProps
    takeOut: TakeOut
}

export interface TakenOutItem {
    id: number
    name: string
    amount: number
    unique_items: UniqueItem[]
    is_checked: boolean
}