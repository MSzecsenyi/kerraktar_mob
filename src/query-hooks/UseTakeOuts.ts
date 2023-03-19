import { TakenOutItem } from './../interfaces';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import axios from 'axios';
import { API_URL } from '../constants';
import { TakeOut, LoginDrawerProps, TakeOutList } from '../interfaces';
import { useContext } from 'react';
import { UserDataContext } from '../contexts/UserDataContext';
interface usePostTakeOutProps {
    takeOutList: TakeOutList
	drawerProps: LoginDrawerProps
	setStoreId: React.Dispatch<React.SetStateAction<number>>
    storeId: number
}

//Create a new takeout
const postTakeOut = (token: string, takeOutList: TakeOutList) => axios.post(API_URL + 'takeouts',takeOutList,{
    headers: {
        'Authorization': `Bearer ${token}`    
    }
})

export function usePostTakeOut({takeOutList, drawerProps, setStoreId, storeId}: usePostTakeOutProps){
    const {loggedInUser} = useContext(UserDataContext);
    return useMutation(() => postTakeOut(loggedInUser.token, takeOutList), {
        onSuccess: () => {
            drawerProps.navigation.navigate("TakeOutStack", {})
            setStoreId(-1)
        },
        onError: ((error) => console.log(error))
        
    }); 
}

//Get all previous takeouts. 
//If user is group:         returns all takeouts made by him
//If user is storekeeper:   returns all takeouts made from their stores
async function getTakeOuts(token: string): Promise<TakeOut[]> {
    try {
        const response = await axios.get(API_URL + `takeouts`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data.data;
    } catch (error) {
        console.error(error); throw error;
    }
    }

export function useGetTakeOuts() {
    const {loggedInUser} = useContext(UserDataContext);
    return useQuery(['takeOuts'], () => getTakeOuts(loggedInUser.token))}


//Get a specific takeout based on id
async function getDetailedTakeOut(token: string, takeOutId: number): Promise<TakenOutItem[]>{
    try {
        const response = await axios.get(API_URL + `takeouts/${takeOutId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error(error); throw error;
    }
}

export function useGetDetailedTakeOut(takeOutId: number) {
    const {loggedInUser} = useContext(UserDataContext);
    return useQuery(['takeOut', takeOutId], () => getDetailedTakeOut(loggedInUser.token, takeOutId))}


//Return a specific takeout to the store
const putTakeOut = (takeOutId: number, token: string) => axios.put(API_URL + `takeouts/${takeOutId}`,null,{
    headers: {
        'Authorization': `Bearer ${token}`    
    }
})

interface usePutTakeOutProps {
    takeOutId: number
	setChosenTakeOut: React.Dispatch<React.SetStateAction<number>>
}

export function usePutTakeOut({takeOutId, setChosenTakeOut}: usePutTakeOutProps) {
    const {loggedInUser} = useContext(UserDataContext);
  const queryClient = useQueryClient();

    return useMutation(() => putTakeOut(takeOutId, loggedInUser.token), {
        onSuccess: (response) => {
            const oldData = queryClient.getQueryData<TakeOut[]>('takeOuts');
            const updatedTakeOut = response.data;
            if (oldData) {
              const newData = oldData.map((takeOut) => {
                return takeOut.id === updatedTakeOut.id ? updatedTakeOut : takeOut;
              });
              queryClient.setQueryData('takeOuts', newData);
            }
          setChosenTakeOut(-1)
          }
    })
}