type TakeOutDrawerStates = "CreateTakeOut" | "SelectTakeOut" | "TakeOutStoreSelector"

export type DrawerStackParamList = {
    TakeOutDrawer: {
      page?: TakeOutDrawerStates 
        //TakeOutScreenManager needs it to be able to select which page to display. If ommitted, TakeOutListCreator or TakeOutStoreSelector will be displayed, based on the number of the accessible stores by the user

      stores?: string[] | (TakeOutDrawerStates extends 'TakeOutStoreSelector' ? never : undefined)
        //TakeOutStoreSelector needs it. Required prop for this page!

      store_id?: number | (TakeOutDrawerStates extends 'TakeOutListCreator' ? never : undefined);
        //TakeOutListCreator needs it. Required prop for this page!
    };
  };