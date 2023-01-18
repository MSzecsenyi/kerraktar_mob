import { View, Button, Text, ScrollView } from "react-native";
import { useLogoutUser } from "../../query-hooks/UseLoginUser";
import { useGetItems } from "../../query-hooks/UseItems";
import ItemTile from "../organisms/ItemTile";
import AmountSelector from "../atoms/AmountSelector";

const TakeOutListMaker = () => {
	const logoutUser = useLogoutUser();
	const getItems = useGetItems();

	return (
		<View>
			{getItems.isLoading && <Text>Loading...</Text>}
			{getItems.isSuccess && (
				<ScrollView>
					{getItems.data.map((item) => (
						<ItemTile
							item={item}
							key={item.id}
						/>
					))}
				</ScrollView>
			)}
			<Button
				title="Kilépés"
				onPress={() => logoutUser.mutate()}
			/>
		</View>
	);
};

export default TakeOutListMaker;
