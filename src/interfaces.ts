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
    category_id: number,
    store_id: number,
    owner: string,
    item_name: string,
    amount: number,
    comment: string,
    is_unique: boolean,
    in_store_amount: number,
}