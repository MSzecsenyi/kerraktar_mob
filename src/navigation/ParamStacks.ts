import { NavigatorScreenParams } from "@react-navigation/native";
import { ItemRequest, TakeOut } from "../interfaces";

export type LoginDrawerParamList = {
	TakeOutStack: NavigatorScreenParams<TakeOutStackParams>;
	RequestStack: NavigatorScreenParams<RequestStackParamList>;
	ItemStack: NavigatorScreenParams<ItemStackParamList>;
};

export type RequestStackParamList = {
	RequestSelectorScreen: undefined;
	RequestCreatorScreen: undefined;
	RequestDetailsScreen: { request: ItemRequest };
};

export type TakeOutStackParams = {
	TakeOutSelectorScreen: undefined;
	TakeOutCreatorScreen: undefined;
	TakeOutDetailsScreen: { takeOut: TakeOut; storeId: number };
};

export type ItemStackParamList = {
	ItemListScreen: undefined;
	ItemCreatorScreen: { storeId: number; storeName: string };
};
