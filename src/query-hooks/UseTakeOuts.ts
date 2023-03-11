import { useMutation } from 'react-query';
import axios from 'axios';
import { API_URL } from '../constants';
import { TakeOutList } from '../interfaces';
import { useContext } from 'react';
import { UserDataContext } from '../contexts/UserDataContext';

const postTakeOut = (token: string, takeOutList: TakeOutList) => axios.post(API_URL + 'takeouts',takeOutList,{
    headers: {
        'Authorization': `Bearer ${token}`    
    }
})

export function usePostTakeOut(takeOutList: TakeOutList){
    const {loggedInUser} = useContext(UserDataContext);

    console.log("kaki")
    
    return useMutation(() => postTakeOut(loggedInUser.userData.token, takeOutList), {
        onSuccess: (response) => {
            console.log(response)
        },
        onError: ((error) => console.log(error))
        
    }); 
}