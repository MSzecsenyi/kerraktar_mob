import { useQuery } from "react-query";
import { useContext } from "react";
import { API_URL } from "./../constants";
import axios from "axios";
import { UserDataContext } from "../contexts/UserDataContext";
import { Item, RequestItem, StringDateRange } from "../interfaces";

function getItems(store_id: number, token: string): Promise<Item[]> {
	return axios
		.get(API_URL + `items?store_id=[${store_id}]`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		})
		.then((response) => response.data.data)
		.catch((error) => {
			console.error(error);
		});
}

export function useGetItems(store_id: number) {
	const { loggedInUser } = useContext(UserDataContext);
	return useQuery(
		["items", store_id],
		() => getItems(store_id, loggedInUser.token),
		{
			enabled: store_id != -1,
		}
	);
}

//Items for Requests
function getRequestItems(
	store_id: number,
	dateRange: StringDateRange,
	token: string
): Promise<RequestItem[]> {
	const url =
		API_URL +
		`request_items?store_id=[${store_id}]&startDate=${dateRange.startDate}&endDate=${dateRange.endDate}`;
	return axios
		.get(url, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		})
		.then((response) => response.data.data)
		.catch((error) => {
			console.error(error);
		});
}

export function useGetRequestItems(
	store_id: number,
	dateRange: StringDateRange,
	dateIsSelected: boolean
) {
	const { loggedInUser } = useContext(UserDataContext);
	return useQuery(
		["items", store_id, dateRange],
		() => getRequestItems(store_id, dateRange, loggedInUser.token),
		{
			enabled: store_id != -1 && dateIsSelected,
		}
	);
}

//Get used UUIds
function getUUIds(token: string): Promise<string[]> {
	return axios
		.get(API_URL + `uuids`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		})
		.then((response) => response.data)
		.catch((error) => {
			console.error(error);
		});
}

export function useGetUUIds() {
	const { loggedInUser } = useContext(UserDataContext);
	return useQuery("uuids", () => getUUIds(loggedInUser.token));
}
