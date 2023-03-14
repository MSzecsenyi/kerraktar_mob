import { StyleSheet, Text, View } from "react-native";
import { useGetTakeOuts } from "../../query-hooks/UseTakeOuts";

const TakeOutListSelector = () => {
	const getTakeOuts = useGetTakeOuts();
	return (
		<View>
			<Text>Hali</Text>
			{getTakeOuts.isSuccess &&
				getTakeOuts.data &&
				getTakeOuts.data.map((takeOut) => <Text>{takeOut.take_out_name}</Text>)}
		</View>
	);
};

export default TakeOutListSelector;

const styles = StyleSheet.create({});
