import { useQuery } from 'react-query';
import { useContext } from 'react';
import { API_URL } from './../constants';
import axios from "axios";
import { UserDataContext } from '../contexts/UserDataContext';
import { Items } from '../interfaces';

const {loggedInUser} = useContext(UserDataContext);

const getItems = (district: number) => axios.get(API_URL + `items?district=${district}`, {
    headers: {
        'Authorization': `Bearer ${loggedInUser.userData?.token}`
    }
})

export function useCheckUser(token: string | null){
        console.log('kaki')
        return useQuery(['user'], () => getItems(loggedInUser.userData?.user.district),{
            // enabled: !!token,
            onSuccess(data: Items) {
                console.log('success');
                console.log(data)
                // dispatch({type: 'SET_LOGGED_IN_USER', payload: data })
            },
        })
    }