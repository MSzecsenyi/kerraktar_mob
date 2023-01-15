import { useQuery } from 'react-query';
import { useContext } from 'react';
import { API_URL } from './../constants';
import axios from "axios";
import { UserDataContext } from '../contexts/UserDataContext';
import { Item } from '../interfaces';


function getItems(district: number, token: string): Promise<Item[]> {
    return axios.get(API_URL + `items?district=[${district}]`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }})
        .then((response) => response.data.data)
        .catch(error => {console.error(error)})
    }

export function useGetItems() {
    const {loggedInUser} = useContext(UserDataContext);
    return useQuery(['user'], () => getItems(loggedInUser.userData?.user.district, loggedInUser.userData?.token))
    }