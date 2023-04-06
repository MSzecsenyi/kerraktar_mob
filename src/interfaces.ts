import { DrawerScreenProps } from "@react-navigation/drawer";
import { LoginDrawerParamList } from "./navigation/ParamStacks";
import { TakeOutItemAction } from "./contexts/ItemReducer";
import { RequestItemAction } from "./contexts/RequestItemReducer";

export interface LoginInfo {
    email: string;
    password: string;
}
export interface UserData {
    user: User;
    token: string;
    stores: Store[];
}
export interface Store {
    address: string;
    store_id: number;
}
export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at: Date;
    group_number: number;
    district: number;
    phone: number;
    is_group: boolean;
    is_storekeeper: boolean;
    is_admin: boolean;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date;
}
export interface Item {
    id: number;
    category: string;
    item_name: string;
    amount: number;
    is_unique: boolean;
    in_store_amount: number;
    unique_items: UniqueItem[];
    is_selected: boolean;
    selected_amount: number;
    selected_unique_items: string[];
}
export interface UniqueItem {
    unique_id: string;
    alt_name: string;
}
export interface TakeOutItemButtonProps {
    item: Item;
    dispatchItems: React.Dispatch<TakeOutItemAction>;
    setCameraIsActive?: React.Dispatch<React.SetStateAction<boolean>>;
}
export interface ItemFilterBarProps {
    setFilteredData: React.Dispatch<React.SetStateAction<Item[]>>;
    filteredData: Item[];
}

export interface TakeOutList {
    items: AcceptListCommonItem[];
    uniqueItems: string[];
    store_id: number;
    take_out_name: string;
}

export interface AcceptListCommonItem {
    id: number;
    amount: number;
}

export interface TakeOut {
    id: number;
    start_date: Date;
    end_date: Date | null;
    user: string;
    store: number;
    take_out_name: string;
}

export interface TakenOutItem {
    id: number;
    name: string;
    amount: number;
    unique_items: UniqueItem[];
    is_checked: boolean;
}

export interface ItemRequest {
    id: number;
    start_date: Date;
    end_date: Date;
    request_name: string;
    is_conflicted: boolean;
    store: string;
    user: number;
}
export interface DateRange {
    startDate: Date;
    endDate: Date;
}

export interface StringDateRange {
    startDate: string;
    endDate: string;
}

export interface RequestList {
    start_date: string;
    end_date: string;
    store_id: number;
    request_name: string;
    items: AcceptListCommonItem[];
}

export interface RequestItem {
    id: number;
    category: string;
    item_name: string;
    amount: number;
    is_selected: boolean;
    selected_amount: number;
    other_requests: OtherRequestInfo[];
}

export interface OtherRequestInfo {
    start_date: Date;
    end_date: Date;
    amount: number;
    user: string;
}
