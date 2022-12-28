import { useMutation, useQuery } from 'react-query';
import axios from 'axios';
import { API_URL } from './../constants';
import { LoginInfo, UserData } from './../interfaces';
import { useContext } from 'react';
import { UserDataContext } from '../contexts/UserData';
import AsyncStorage from '@react-native-async-storage/async-storage';

const loginUser = (loginInfo: LoginInfo) => axios.post(API_URL + 'login', loginInfo).then((response) => response.data);
const logoutUser = (token: string | undefined) => axios.post(API_URL + 'logout',null,{
    headers: {
        'Authorization': `Bearer ${token}`    
    }
})
const checkUser = (token: string | null) => axios.get(API_URL + 'checkuser',{
    headers: {
        'Authorization': `Bearer ${token}`    
    }
}).then((response) => response.data)

export function useLogoutUser(){
    const {dispatch,loggedInUser} = useContext(UserDataContext);
    return useMutation(() => logoutUser(loggedInUser.userData?.token), {
        onSuccess: () => {
            dispatch({type: 'DELETE_LOGGED_IN_USER'});
            AsyncStorage.removeItem('persToken');
        }
    }); 
}

export function useLoginUser(loginInfo: LoginInfo){
const {dispatch} = useContext(UserDataContext);
    return useMutation(() => loginUser(loginInfo), {
        onSuccess: (data) => {
            console.log(data.token)
            AsyncStorage.setItem(
                'persToken', data.token
            ).then(() => {
                dispatch({type: 'SET_LOGGED_IN_USER', payload: data});
                console.log(dispatch)
            }).catch((e) => {
                console.log(e + 'pers. login failed')
              })} 
        }
    );  
}

export function useCheckUser(token: string | null){
    const {dispatch} = useContext(UserDataContext)
    return useQuery(['user'], () => checkUser(token),{
        // enabled: !!token,
        onSuccess(data: UserData) {
            console.log('success');
            console.log(data)
            // dispatch({type: 'SET_LOGGED_IN_USER', payload: data })
        },
    })
}