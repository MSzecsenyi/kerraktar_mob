import { useMutation } from 'react-query';
import axios from 'axios';
import { API_URL } from '../constants';
import { LoginInfo, UserData } from '../interfaces';
import { useContext } from 'react';
import { UserDataContext } from '../contexts/UserDataContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const loginUser = (loginInfo: LoginInfo) => axios.post(API_URL + 'login', loginInfo).then((response) => response.data);
const logoutUser = (token: string | undefined) => axios.post(API_URL + 'logout',null,{
    headers: {
        'Authorization': `Bearer ${token}`    
    }
})

export function useLogoutUser(){
    const {dispatch,loggedInUser} = useContext(UserDataContext);
    return useMutation(() => logoutUser(loggedInUser.userData.token), {
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
            AsyncStorage.setItem(
                'persToken', data.token
            ).then(() => {
                dispatch({type: 'SET_LOGGED_IN_USER', payload: data});
            }).catch((e) => {
                console.error(e + 'pers. login failed')
              })} 
        }
    );  
}