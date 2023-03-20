import { StyleSheet, Text, View } from "react-native";
import { useGetRequests } from "../../query-hooks/UseRequests";
import HeaderWithSearchBar from "./HeaderWithSearchBar";
import LoadingSpinner from "../atoms/LoadingSpinner";
import { LoginDrawerProps } from "../../interfaces";

const RequestSelector = (drawerProps: LoginDrawerProps) => {
	const getRequests = useGetRequests();

	console.log(getRequests.isSuccess);

	return (
		<View style={{ flex: 1 }}>
			{getRequests.isSuccess ? (
				<>
					<HeaderWithSearchBar drawerProps={drawerProps} />
					<View>
						<Text>RequestSelector</Text>
						{getRequests.data.map((request) => (
							<Text>{request.request_name}</Text>
						))}
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
