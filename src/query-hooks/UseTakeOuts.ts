import { useMutation, useQuery } from 'react-query';
import axios from 'axios';
import { API_URL } from '../constants';
import { TakeOut, TakeOutDrawerProps, TakeOutList } from '../interfaces';
import { useContext } from 'react';
import { UserDataContext } from '../contexts/UserDataContext';

interface usePostTakeOutProps {
    takeOutList: TakeOutList
	drawerProps: TakeOutDrawerProps
	setStoreId: React.Dispatch<React.SetStateAction<number>>
}

const postTakeOut = (token: string, takeOutList: TakeOutList) => axios.post(API_URL + 'takeouts',takeOutList,{
    headers: {
        'Authorization': `Bearer ${token}`    
    }
})

export function usePostTakeOut({takeOutList, drawerProps, setStoreId}: usePostTakeOutProps){
    const {loggedInUser} = useContext(UserDataContext);
    
    return useMutation(() => postTakeOut(loggedInUser.token, takeOutList), {
        onSuccess: () => {
            drawerProps.navigation.navigate("TakeOutDrawer", {
                page: "SelectTakeOut",
            })
            setStoreId(-1)
        },
        onError: ((error) => console.log(error))
        
    }); 
}

function getTakeOuts(token: string): Promise<TakeOut[]> {
    return axios.get(API_URL + `takeouts`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }})
        .then((response) => response.data.data)
        .catch(error => {console.error(error); throw error})
    }

export function useGetTakeOuts() {
    const {loggedInUser} = useContext(UserDataContext);
    return useQuery(['takeOuts'], () => getTakeOuts(loggedInUser.token))}