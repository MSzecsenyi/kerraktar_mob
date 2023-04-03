import { FlatList, ListRenderItemInfo, StyleSheet, Text, View } from "react-native";
import { useGetRequests } from "../../query-hooks/UseRequests";
import HeaderWithSearchBar from "./HeaderWithSearchBar";
import LoadingSpinner from "../atoms/LoadingSpinner";
import { ItemRequest, LoginDrawerProps } from "../../interfaces";
import { useCallback, useEffect, useState } from "react";
import RequestTile from "../organisms/Tiles/RequestTile";
import BottomCreateNewButton from "../atoms/BottomCreateNewButton";
import BottomControlButtons from "../organisms/BottomControlButtons";
import { useFocusEffect } from "@react-navigation/native";

const RequestSelector = (drawerProps: LoginDrawerProps) => {
	const [searchTerm, setSearchTerm] = useState("");
	const [chosenRequest, setChosenRequest] = useState(-1);
	const [filteredRequests, setFilteredRequests] = useState<ItemRequest[]>([]);
	const getRequests = useGetRequests();

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
				setChosenRequest={setChosenRequest}
			/>
		);
	}, []);

	const keyExtractor = (request: ItemRequest) => request.id.toString();

	return (
		<View style={{ flex: 1 }}>
			{getRequests.isSuccess ? (
				<>
					<HeaderWithSearchBar drawerProps={drawerProps} searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
					<View style={{flex: 1}}>
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
							/>
							<BottomControlButtons>
								<BottomCreateNewButton
									text="Új kivétel"
									onPress={() =>
										drawerProps.navigation.navigate("RequestStack", {
											screen: "RequestCreatorScreen",
										})
									}
								/>
							</BottomControlButtons>
					</View>
				</>
			) : (
				<LoadingSpinner />
			)}
		</View>
	);
};

export default RequestSelector;

const styles = StyleSheet.create({});
