import {
	View,
	Button,
	Text,
	ScrollView,
	StyleSheet,
	TouchableHighlight,
} from "react-native";
import { useLogoutUser } from "../../query-hooks/UseLoginUser";
import { useGetItems } from "../../query-hooks/UseItems";
import ItemTile from "../organisms/ItemTile";
import { TakeOutListProvider } from "../../contexts/TakeOutListContext";
import { Ionicons } from "@expo/vector-icons";

const TakeOutListMaker = () => {
	const logoutUser = useLogoutUser();
	const getItems = useGetItems();

	return (
		<View>
			<TakeOutListProvider>
				{getItems.isLoading && <Text>Loading...</Text>}
				{getItems.isSuccess && (
					<ScrollView>
						<View>
							{getItems.data.map((item) => (
								<ItemTile
									item={item}
									key={item.id}
								/>
							))}
						</View>
					</ScrollView>
				)}
				<Button
					title="Kilépés"
					onPress={() => logoutUser.mutate()}
				/>
				<View style={styles.bottomContainer}>
					<TouchableHighlight style={styles.leftButton}>
						<Ionicons
							name="ios-search"
							size={24}
							color="#fff"
						/>
					</TouchableHighlight>
					<TouchableHighlight style={styles.rightButton}>
						<Ionicons
							name="ios-arrow-forward"
							size={24}
							color="#fff"
						/>
					</TouchableHighlight>
				</View>
			</TakeOutListProvider>
		</View>
	);
};

export default TakeOutListMaker;

const styles = StyleSheet.create({
	bottom_menu: {
		flexDirection: "row",
	},
	bottomContainer: {
		position: "absolute",
		bottom: 20,
		left: 0,
		right: 0,
		flexDirection: "row",
		justifyContent: "center",
	},
	leftButton: {
		backgroundColor: "#007aff",
		width: 60,
		height: 60,
		borderRadius: 30,
		justifyContent: "center",
		alignItems: "center",
		marginRight: 20,
	},
	rightButton: {
		backgroundColor: "#007aff",
		width: 60,
		height: 60,
		borderRadius: 30,
		justifyContent: "center",
		alignItems: "center",
		marginLeft: 20,
	},
});
