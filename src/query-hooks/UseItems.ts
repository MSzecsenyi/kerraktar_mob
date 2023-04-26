import { UniqueItem } from "./../interfaces";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useContext } from "react";
import { API_URL } from "./../constants";
import axios from "axios";
import { UserDataContext } from "../contexts/UserDataContext";
import {
	Item,
	ItemHistoryData,
	ModifyItemData,
	RequestItem,
	SaveItemData,
	StringDateRange,
	TakeOut,
} from "../interfaces";

// Items for TakeOuts and item management
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
			staleTime: Infinity,
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

// Create new item
const postItem = (token: string, takeOutList: SaveItemData) =>
	axios.post(API_URL + "items", takeOutList, {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});

export function usePostItem(
	item: SaveItemData,
	onSuccessFn: () => void,
	storeId: number
) {
	const { loggedInUser } = useContext(UserDataContext);
	const queryClient = useQueryClient();
	return useMutation(() => postItem(loggedInUser.token, item), {
		onSuccess: (response: { data: Item }) => {
			const oldData = queryClient.getQueryData(["items", storeId]) as Item[];
			queryClient.setQueryData(["items", storeId], [...oldData, response.data]);

			onSuccessFn();
		},
		onError: (error) => console.error(error),
	});
}

//Update an item
const updateItem = (item: ModifyItemData, token: string) =>
	axios.put(API_URL + `items`, item, {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});

export function useUpdateItem(
	item: ModifyItemData,
	onSuccessFn: () => void,
	storeId: number
) {
	const { loggedInUser } = useContext(UserDataContext);
	const queryClient = useQueryClient();
	return useMutation(() => updateItem(item, loggedInUser.token), {
		onSuccess: (response) => {
			const oldData = queryClient.getQueryData(["items", storeId]) as Item[];
			if (oldData) {
				const newData = oldData.map((existingItem) => {
					if (existingItem.id === response.data.id) {
						return response.data;
					}
					return existingItem;
				});
				queryClient.setQueryData(["items", storeId], newData);
			}
			onSuccessFn();
		},
	});
}

//Delete an item
const deleteItem = (itemId: number, token: string) =>
	axios.delete(API_URL + `items/${itemId}`, {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});

export function useDeleteItem(
	itemId: number,
	onSuccessFn: () => void,
	storeId: number
) {
	const { loggedInUser } = useContext(UserDataContext);
	const queryClient = useQueryClient();

	return useMutation(() => deleteItem(itemId, loggedInUser.token), {
		onSuccess: () => {
			const oldData = queryClient.getQueryData(["items", storeId]) as Item[];
			if (oldData) {
				const newData = oldData.filter((item) => item.id !== itemId);
				queryClient.setQueryData(["items", storeId], newData);
			}
			onSuccessFn();
		},
	});
}

//Get history of an item
async function getItemHistory(
	itemId: number,
	token: string
): Promise<ItemHistoryData[]> {
	try {
		const response = await axios.get(API_URL + `items/history/` + itemId, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		return response.data.data;
	} catch (error) {
		console.error(error);
		throw error;
	}
}

export function useGetItemHistory(itemId: number, infoModalVisible: boolean) {
	const { loggedInUser } = useContext(UserDataContext);
	return useQuery(
		["itemHistory", itemId],
		() => getItemHistory(itemId, loggedInUser.token),
		{
			enabled: infoModalVisible,
		}
	);
}

//Get history of an item
async function getUniqueItemHistory(
	UniqueItemId: number,
	token: string
): Promise<TakeOut[]> {
	try {
		const response = await axios.get(
			API_URL + `items/uitem_history/` + UniqueItemId,
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		);
		return response.data.data;
	} catch (error) {
		console.error(error);
		throw error;
	}
}

export function useGetUniqueItemHistory(
	UniqueItemId: number,
	infoModalVisible: boolean
) {
	const { loggedInUser } = useContext(UserDataContext);
	return useQuery(
		["uitemHistory", UniqueItemId],
		() => getUniqueItemHistory(UniqueItemId, loggedInUser.token),
		{
			enabled: infoModalVisible,
		}
	);
}
