import { useMutation } from 'react-query';
import axios from 'axios';
import { API_URL } from './../constants';
import { LoginInfo } from './../interfaces';
import { useContext } from 'react';
import { UserDataContext } from '../contexts/UserData';
import AsyncStorage from '@react-native-async-storage/async-storage';

const loginUser = (loginInfo: LoginInfo) => axios.post(API_URL + 'login', loginInfo).then((response) => response.data);
const logoutUser = (token: string | undefined) => axios.post(API_URL + 'logout',null,{
    headers: {
        'Authorization': `Bearer ${token}`    
    }
})


export function useLogoutUser(){
    const {dispatch,loggedInUser} = useContext(UserDataContext);
    return useMutation(() => logoutUser(loggedInUser.userData?.token), {
        onSuccess: () => {
            dispatch({type: 'DELETE_LOGGED_IN_USER'})
        }
    }); 
}

export function useLoginUser(LoginInfo: LoginInfo){
const {dispatch} = useContext(UserDataContext);
    return useMutation((loginInfo: LoginInfo) => loginUser(loginInfo), {
        onSuccess: (data) => {
            AsyncStorage.setItem(
                'userData', JSON.stringify(data)
            ).then(() => {
                dispatch({type: 'SET_LOGGED_IN_USER', payload: data});
                console.log(dispatch)
            }).catch((e) => {
                console.log(e + 'pers. login failed')
              })} 
        }
    );  
}