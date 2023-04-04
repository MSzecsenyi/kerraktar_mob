export type LoginDrawerParamList = {
    TakeOutStack: {screen: "TakeOutSelectorScreen" | "TakeOutCreatorScreen"}
    RequestStack: {screen: "RequestSelectorScreen" | "RequestCreatorScreen" | "RequestDetailsScreen"}
  };

export type RequestStackParamList = {
  RequestSelectorScreen: undefined
  RequestCreatorScreen: undefined
  RequestDetailsScreen: {requestId: number}
}