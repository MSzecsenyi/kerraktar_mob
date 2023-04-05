import { NavigatorScreenParams } from "@react-navigation/native";
import { ItemRequest, TakeOut } from "../interfaces";

export type LoginDrawerParamList = {
    TakeOutStack: NavigatorScreenParams<TakeOutStackParams>;
    RequestStack: NavigatorScreenParams<RequestStackParamList>;
};

export type RequestStackParamList = {
    RequestSelectorScreen: undefined;
    RequestCreatorScreen: undefined;
    RequestDetailsScreen: { request: ItemRequest };
};

export type TakeOutStackParams = {
    TakeOutSelectorScreen: undefined;
    TakeOutCreatorScreen: undefined;
    TakeOutDetailsScreen: { takeOut: TakeOut };
};
