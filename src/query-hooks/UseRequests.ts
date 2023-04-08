import { AcceptListCommonItem, RequestItem } from "./../interfaces";
import { useMutation, useQuery, useQueryClient } from "react-query";
import axios from "axios";
import { API_URL } from "../constants";
import { ItemRequest, RequestList } from "../interfaces";
import { useContext } from "react";
import { UserDataContext } from "../contexts/UserDataContext";
import { RequestListCreatorManagerNavigationProps } from "../views/pages/RequestCreatorManager";
import { isQueryKey } from "react-query/types/core/utils";

interface usePostRequestProps {
	requestList: RequestList;
	navigationProps: RequestListCreatorManagerNavigationProps;
}

//Create a new request
const postRequest = async (token: string, requestList: RequestList) => {
	axios.post(API_URL + "requests", requestList, {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});
};

export function usePostRequest({
	requestList,
	navigationProps,
}: usePostRequestProps) {
	const { loggedInUser } = useContext(UserDataContext);
	return useMutation(() => postRequest(loggedInUser.token, requestList), {
		onSuccess: () => {
			navigationProps.navigation.navigate("RequestSelectorScreen");
		},
		onError: (error) => console.error(error),
	});
}

//Get all previous requests.
//If user is group:         returns all requests made by him
//If user is storekeeper:   returns all requests made from their stores
async function getRequests(token: string): Promise<ItemRequest[]> {
	try {
		const response = await axios.get(API_URL + `requests`, {
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

export function useGetRequests() {
	const { loggedInUser } = useContext(UserDataContext);
	return useQuery(["requests"], () => getRequests(loggedInUser.token));
}

//Get a specific request based on id
async function getDetailedRequest(
	token: string,
	requestId: number
): Promise<RequestItem[]> {
	try {
		const response = await axios.get(API_URL + `requests/${requestId}`, {
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

export function useGetDetailedRequest(requestId: number) {
	const { loggedInUser } = useContext(UserDataContext);
	return useQuery(["request", requestId], () =>
		getDetailedRequest(loggedInUser.token, requestId)
	);
}

//Update items in a specific request
const updateRequest = (
	requestId: number,
	itemList: AcceptListCommonItem[],
	token: string
) =>
	axios.put(API_URL + `requests/${requestId}`, itemList, {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});

export function useUpdateRequest(
	requestId: number,
	onSuccessFn: () => void,
	itemList: AcceptListCommonItem[]
) {
	const { loggedInUser } = useContext(UserDataContext);
	const queryClient = useQueryClient();
	return useMutation(
		() => updateRequest(requestId, itemList, loggedInUser.token),
		{
			onSuccess: (response) => {
				queryClient.setQueryData(["request", requestId], response.data.data);
				onSuccessFn();
			},
		}
	);
}

//Update items in a specific request
const deleteRequest = (requestId: number, token: string) =>
	axios.delete(API_URL + `requests/${requestId}`, {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});

export function useDeleteRequest(requestId: number, onSuccessFn: () => void) {
	const { loggedInUser } = useContext(UserDataContext);
	const queryClient = useQueryClient();

	return useMutation(() => deleteRequest(requestId, loggedInUser.token), {
		onSuccess: () => {
			const oldData = queryClient.getQueryData<ItemRequest[]>("requests");
			if (oldData) {
				const newData = oldData.filter((request) => request.id !== requestId);
				queryClient.setQueryData("requests", newData);
			}
			onSuccessFn();
		},
	});
}
