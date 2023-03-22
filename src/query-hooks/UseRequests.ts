import { TakenOutItem } from './../interfaces';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import axios from 'axios';
import { API_URL } from '../constants';
import { ItemRequest, LoginDrawerProps, RequestList } from '../interfaces';
import { useContext } from 'react';
import { UserDataContext } from '../contexts/UserDataContext';
interface usePostRequestProps {
    requestList: RequestList
	drawerProps: LoginDrawerProps
	setStoreId: React.Dispatch<React.SetStateAction<number>>
    storeId: number
}

//Create a new request
const postRequest = (token: string, requestList: RequestList) => axios.post(API_URL + 'requests',requestList,{
    headers: {
        'Authorization': `Bearer ${token}`    
    }
})

export function usePostRequest({requestList, drawerProps, setStoreId, storeId}: usePostRequestProps){
    const {loggedInUser} = useContext(UserDataContext);
    return useMutation(() => postRequest(loggedInUser.token, requestList), {
        onSuccess: () => {
            drawerProps.navigation.navigate("RequestSelectorDrawer", {})
            setStoreId(-1)
        },
        onError: ((error) => console.log(error))
        
    }); 
}

//Get all previous requests. 
//If user is group:         returns all requests made by him
//If user is storekeeper:   returns all requests made from their stores
async function getRequests(token: string): Promise<ItemRequest[]> {
    try {
        const response = await axios.get(API_URL + `requests`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        console.log(response.data)
        return response.data.data;
    } catch (error) {
        console.error(error); throw error;
    }
    }

export function useGetRequests() {
    const {loggedInUser} = useContext(UserDataContext);
    return useQuery(['requests'], () => getRequests(loggedInUser.token))}


//Get a specific request based on id
async function getDetailedRequest(token: string, requestId: number): Promise<TakenOutItem[]>{
    try {
        const response = await axios.get(API_URL + `requests/${requestId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error(error); throw error;
    }
}

export function useGetDetailedRequest(requestId: number) {
    const {loggedInUser} = useContext(UserDataContext);
    return useQuery(['request', requestId], () => getDetailedRequest(loggedInUser.token, requestId))}


//Return a specific request to the store
const putRequest = (requestId: number, token: string) => axios.put(API_URL + `requests/${requestId}`,null,{
    headers: {
        'Authorization': `Bearer ${token}`    
    }
})

interface usePutRequestProps {
    requestId: number
	setChosenRequest: React.Dispatch<React.SetStateAction<number>>
}

export function usePutRequest({requestId, setChosenRequest}: usePutRequestProps) {
    const {loggedInUser} = useContext(UserDataContext);
  const queryClient = useQueryClient();

    return useMutation(() => putRequest(requestId, loggedInUser.token), {
        onSuccess: (response) => {
            const oldData = queryClient.getQueryData<ItemRequest[]>('requests');
            const updatedRequest = response.data;
            if (oldData) {
              const newData = oldData.map((request) => {
                return request.id === updatedRequest.id ? updatedRequest : request;
              });
              queryClient.setQueryData('requests', newData);
            }
          setChosenRequest(-1)
          }
    })
}