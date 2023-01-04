import { View, Button, StyleSheet } from "react-native";
import { useLogoutUser } from "../../query-hooks/useLoginUser";

type Props = {};

const TakeOutListMaker = () => {
	const logoutUser = useLogoutUser();

	return (
		<View>
			<Button
				title="Kilépés"
				onPress={() => logoutUser.mutate()}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
		alignItems: "center",
		justifyContent: "center",
	},
});

export default TakeOutListMaker;
