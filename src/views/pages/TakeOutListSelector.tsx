import { ListRenderItemInfo, StyleSheet, View } from "react-native";
import { useGetTakeOuts } from "../../query-hooks/UseTakeOuts";
import { useCallback, useEffect, useState } from "react";
import { TakeOut } from "../../interfaces";
import HeaderWithSearchBar from "../molecules/HeaderWithSearchBar";
import { FlatList } from "react-native-gesture-handler";
import TakeOutTile from "../organisms/Tiles/TakeOutTile";
import LoadingSpinner from "../atoms/LoadingSpinner";
import { CompositeScreenProps, useFocusEffect } from "@react-navigation/native";
import BottomControlButtons from "../organisms/BottomControlButtons";
import BottomCreateNewButton from "../atoms/BottomCreateNewButton";
import { DrawerScreenProps } from "@react-navigation/drawer";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { TakeOutStackParams, LoginDrawerParamList } from "../../navigation/ParamStacks";

export type TakeOutListSelectorProps = CompositeScreenProps<
	NativeStackScreenProps<TakeOutStackParams, "TakeOutSelectorScreen">,
	DrawerScreenProps<LoginDrawerParamList>
>

const TakeOutListSelector = (navigationProps: TakeOutListSelectorProps) => {
	const [searchTerm, setSearchTerm] = useState("");
	const getTakeOuts = useGetTakeOuts();
	const [filteredTakeOuts, setFilteredTakeOuts] = useState<TakeOut[]>([]);

	useFocusEffect(
		useCallback(() => {
			getTakeOuts.refetch();
		}, [])
	);

	useEffect(() => {
		if (getTakeOuts.isSuccess) {
			const filtered = getTakeOuts.data
				.filter((takeOut) => {
					return takeOut.take_out_name
						.toLowerCase()
						.includes(searchTerm.toLowerCase());
				})
				.sort((a, b) => b.id - a.id);
			setFilteredTakeOuts(filtered);
		}
	}, [searchTerm, getTakeOuts.data]);

	const renderRow = useCallback(({ item }: ListRenderItemInfo<TakeOut>) => {
		return (
			<TakeOutTile
				takeOut={item}
				navigationProps={navigationProps}
			/>
		);
	}, []);

	const keyExtractor = (takeOut: TakeOut) => takeOut.id.toString();

	return (
		<View style={{ flex: 1 }}>
				<>
					<HeaderWithSearchBar
						openDrawer={navigationProps.navigation.openDrawer}
						searchTerm={searchTerm}
						setSearchTerm={setSearchTerm}
					/>
					{getTakeOuts.isSuccess ? (
						<>
							<FlatList
								data={filteredTakeOuts}
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
									onPress={() => navigationProps.navigation.navigate("TakeOutCreatorScreen")}
								/>
							</BottomControlButtons>
						</>
					) : (
						<LoadingSpinner />
					)}
				</>
		</View>
	);
};

export default TakeOutListSelector;
