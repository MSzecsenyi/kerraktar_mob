import { ListRenderItemInfo, RefreshControl, View } from "react-native";
import { useGetTakeOuts } from "../../query-hooks/UseTakeOuts";
import { useCallback, useEffect, useState } from "react";
import { TakeOut } from "../../interfaces";
import HeaderWithSearchBar from "../molecules/HeaderWithSearchBar";
import { FlatList } from "react-native-gesture-handler";
import TakeOutTile from "../organisms/Tiles/TakeOutTile";
import LoadingSpinner from "../atoms/LoadingSpinner";
import { CompositeScreenProps, useFocusEffect } from "@react-navigation/native";
import BottomControlButtons from "../atoms/bottomButtons/BottomButtonContainer";
import BottomCreateNewButton from "../atoms/bottomButtons/BottomCreateNewButton";
import { DrawerScreenProps } from "@react-navigation/drawer";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import {
	TakeOutStackParams,
	LoginDrawerParamList,
} from "../../navigation/ParamStacks";
import EmptyList from "../atoms/EmptyList";

export type TakeOutListSelectorProps = CompositeScreenProps<
	NativeStackScreenProps<TakeOutStackParams, "TakeOutSelectorScreen">,
	DrawerScreenProps<LoginDrawerParamList>
>;

const TakeOutListSelector = (navigationProps: TakeOutListSelectorProps) => {
	const [searchTerm, setSearchTerm] = useState("");
	const getTakeOuts = useGetTakeOuts();
	const [listIsRefreshing, setListIsRefreshing] = useState(false);
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
				.sort((a, b) => b.id - a.id)
				.sort((a, b) => {
					const endDateAIsNull = a.end_date === null;
					const endDateBIsNull = b.end_date === null;

					if (endDateAIsNull && endDateBIsNull) {
						return 0;
					} else if (endDateAIsNull) {
						return -1;
					} else {
						return 1;
					}
				});
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
					title="Eddigi eszközkivételek"
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
							ListEmptyComponent={() => (
								<EmptyList text="Még nem történt egy eszközkivétel sem" />
							)}
							refreshControl={
								<RefreshControl
									refreshing={listIsRefreshing}
									onRefresh={() => {
										setListIsRefreshing(true);
										getTakeOuts.refetch().then(() => {
											setListIsRefreshing(false);
										});
									}}
									colors={["green"]}
									tintColor={"green"}
								/>
							}
						/>
						<BottomControlButtons>
							<BottomCreateNewButton
								text="Új eszközkivétel"
								onPress={() =>
									navigationProps.navigation.navigate("TakeOutCreatorScreen")
								}
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
