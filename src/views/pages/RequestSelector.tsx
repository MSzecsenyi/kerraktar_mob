import { FlatList, ListRenderItemInfo, StyleSheet, Text, View } from "react-native";
import { useGetRequests } from "../../query-hooks/UseRequests";
import HeaderWithSearchBar from "./HeaderWithSearchBar";
import LoadingSpinner from "../atoms/LoadingSpinner";
import { ItemRequest, LoginDrawerProps } from "../../interfaces";
import { useCallback, useEffect, useState } from "react";
import RequestTile from "../organisms/Tiles/RequestTile";

const RequestSelector = (drawerProps: LoginDrawerProps) => {
	const [searchTerm, setSearchTerm] = useState("");
	const [chosenRequest, setChosenRequest] = useState(-1);
	const [filteredRequests, setFilteredRequests] = useState<ItemRequest[]>([]);
	const getRequests = useGetRequests();

	useEffect(() => {
		if (getRequests.isSuccess) {
			const filtered = getRequests.data
				.filter((request) => {
					return request.request_name
						.toLowerCase()
						.includes(searchTerm.toLowerCase());
				})
				.sort((a, b) => b.id - a.id);
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

	console.log(filteredRequests)

	return (
		<View style={{ flex: 1 }}>
			{getRequests.isSuccess ? (
				<>
					<HeaderWithSearchBar drawerProps={drawerProps} searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
					<View style={{flex: 1}}>
						<Text>RequestSelector</Text>
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
