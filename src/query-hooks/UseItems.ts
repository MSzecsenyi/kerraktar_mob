import { useQuery } from 'react-query';
import { useContext } from 'react';
import { API_URL } from './../constants';
import axios from "axios";
import { UserDataContext } from '../contexts/UserDataContext';
import { Item } from '../interfaces';


    function getItems(store_id: number, token: string): Promise<Item[]> {
        return axios.get(API_URL + `items?store_id=[${store_id}]`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }})
            .then((response) => response.data.data)
            .catch(error => {console.error(error)})
        }

export function useGetItems(store_id: number) {
    const {loggedInUser} = useContext(UserDataContext);
    return useQuery(['items',store_id], () => getItems(store_id, loggedInUser.token), {
        enabled: store_id != -1
    })
    }