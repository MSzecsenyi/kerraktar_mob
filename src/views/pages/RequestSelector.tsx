import {
	FlatList,
	ListRenderItemInfo,
	RefreshControl,
	View,
} from "react-native";
import { useGetRequests } from "../../query-hooks/UseRequests";
import HeaderWithSearchBar from "../molecules/HeaderWithSearchBar";
import LoadingSpinner from "../atoms/LoadingSpinner";
import { ItemRequest } from "../../interfaces";
import { useCallback, useContext, useEffect, useState } from "react";
import RequestTile from "../organisms/Tiles/RequestTile";
import BottomCreateNewButton from "../atoms/bottomButtons/BottomCreateNewButton";
import BottomControlButtons from "../atoms/bottomButtons/BottomButtonContainer";
import { CompositeScreenProps, useFocusEffect } from "@react-navigation/native";
import {
	LoginDrawerParamList,
	RequestStackParamList,
} from "../../navigation/ParamStacks";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { DrawerScreenProps } from "@react-navigation/drawer";
import { UserDataContext } from "../../contexts/UserDataContext";
import EmptyList from "../atoms/EmptyList";

type RequestSelectorNavigationProp = CompositeScreenProps<
	NativeStackScreenProps<RequestStackParamList, "RequestSelectorScreen">,
	DrawerScreenProps<LoginDrawerParamList>
>;

const RequestSelector = ({ navigation }: RequestSelectorNavigationProp) => {
	const [searchTerm, setSearchTerm] = useState("");
	const [filteredRequests, setFilteredRequests] = useState<ItemRequest[]>([]);
	const [listIsRefreshing, setListIsRefreshing] = useState(false);
	const getRequests = useGetRequests();
	const user = useContext(UserDataContext).loggedInUser.user;

	useFocusEffect(
		useCallback(() => {
			getRequests.refetch();
		}, [])
	);

	useEffect(() => {
		if (getRequests.isSuccess) {
			const filtered = getRequests.data
				.filter((request) => {
					return request.request_name
						.toLowerCase()
						.includes(searchTerm.toLowerCase());
				})
				.sort((a, b) => {
					const dateA = new Date(a.start_date);
					const dateB = new Date(b.start_date);
					return dateB.getTime() - dateA.getTime();
				});
			setFilteredRequests(filtered);
		}
	}, [searchTerm, getRequests.data]);

	const renderRow = useCallback(({ item }: ListRenderItemInfo<ItemRequest>) => {
		return (
			<RequestTile
				request={item}
				onTilePress={() => {
					navigation.navigate("RequestDetailsScreen", {
						request: item,
					});
				}}
			/>
		);
	}, []);

	const keyExtractor = (request: ItemRequest) => request.id.toString();

	return (
		<View style={{ flex: 1 }}>
			{getRequests.isSuccess ? (
				<>
					<HeaderWithSearchBar
						openDrawer={() => navigation.openDrawer()}
						searchTerm={searchTerm}
						setSearchTerm={setSearchTerm}
						title="Eddigi foglalások"
					/>
					<View style={{ flex: 1 }}>
						<FlatList
							data={filteredRequests}
							style={{ flex: 1 }}
							keyExtractor={keyExtractor}
							getItemLayout={(data, index) => ({
								length: 80,
								offset: 80 * (index + 1),
								index,
							})}
							renderItem={renderRow}
							ListEmptyComponent={() => (
								<EmptyList text="Még nem történt egy eszközfoglalás sem" />
							)}
							refreshControl={
								<RefreshControl
									refreshing={listIsRefreshing}
									onRefresh={() => {
										setListIsRefreshing(true);
										getRequests.refetch().then(() => {
											setListIsRefreshing(false);
										});
									}}
									colors={["green"]}
									tintColor={"green"}
								/>
							}
						/>
						{user.is_group && (
							<BottomControlButtons>
								<BottomCreateNewButton
									text="Új foglalás"
									onPress={() => navigation.navigate("RequestCreatorScreen")}
								/>
							</BottomControlButtons>
						)}
					</View>
				</>
			) : (
				<LoadingSpinner />
			)}
		</View>
	);
};

export default RequestSelector;
