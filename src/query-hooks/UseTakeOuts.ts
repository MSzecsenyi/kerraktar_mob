import { TakenOutItem } from "./../interfaces";
import { useMutation, useQuery, useQueryClient } from "react-query";
import axios from "axios";
import { API_URL } from "../constants";
import { TakeOut, TakeOutList } from "../interfaces";
import { useContext } from "react";
import { UserDataContext } from "../contexts/UserDataContext";
import { TakeOutListCreatorManagerProps } from "../views/pages/TakeOutListCreatorManager";
interface usePostTakeOutProps {
	takeOutList: TakeOutList;
	navigationProps: TakeOutListCreatorManagerProps;
}

//Create a new takeout
const postTakeOut = (token: string, takeOutList: TakeOutList) =>
	axios.post(API_URL + "takeouts", takeOutList, {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});

export function usePostTakeOut({
	takeOutList,
	navigationProps,
}: usePostTakeOutProps) {
	const { loggedInUser } = useContext(UserDataContext);
	return useMutation(() => postTakeOut(loggedInUser.token, takeOutList), {
		onSuccess: () => {
			navigationProps.navigation.navigate("TakeOutSelectorScreen");
		},
		onError: (error) => console.error(error),
	});
}

//Get all previous takeouts.
//If user is group:         returns all takeouts made by him
//If user is storekeeper:   returns all takeouts made from their stores
async function getTakeOuts(token: string): Promise<TakeOut[]> {
	try {
		const response = await axios.get(API_URL + `takeouts`, {
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

export function useGetTakeOuts() {
	const { loggedInUser } = useContext(UserDataContext);
	return useQuery(["takeOuts"], () => getTakeOuts(loggedInUser.token));
}

//Get a specific takeout based on id
async function getDetailedTakeOut(
	token: string,
	takeOutId: number
): Promise<TakenOutItem[]> {
	try {
		const response = await axios.get(API_URL + `takeouts/${takeOutId}`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		return response.data;
	} catch (error) {
		console.error(error);
		throw error;
	}
}

export function useGetDetailedTakeOut(takeOutId: number) {
	const { loggedInUser } = useContext(UserDataContext);
	return useQuery(["takeOut", takeOutId], () =>
		getDetailedTakeOut(loggedInUser.token, takeOutId)
	);
}

//Return a specific takeout to the store
const putTakeOut = (takeOutId: number, token: string) =>
	axios.put(API_URL + `takeouts/${takeOutId}`, null, {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});

interface usePutTakeOutProps {
	takeOutId: number;
	acceptOnPress: () => void;
}

export function usePutTakeOut({
	takeOutId,
	acceptOnPress,
}: usePutTakeOutProps) {
	const { loggedInUser } = useContext(UserDataContext);
	const queryClient = useQueryClient();

	return useMutation(() => putTakeOut(takeOutId, loggedInUser.token), {
		onSuccess: (response) => {
			const oldData = queryClient.getQueryData<TakeOut[]>("takeOuts");
			const updatedTakeOut = response.data;
			if (oldData) {
				const newData = oldData.map((takeOut) => {
					return takeOut.id === updatedTakeOut.id ? updatedTakeOut : takeOut;
				});
				queryClient.setQueryData("takeOuts", newData);
			}
			acceptOnPress();
		},
	});
}
