import { ListRenderItemInfo, StyleSheet, Text, View } from "react-native";
import { useGetTakeOuts } from "../../query-hooks/UseTakeOuts";
import { useCallback, useEffect, useState } from "react";
import { LoginDrawerProps, TakeOut } from "../../interfaces";
import HeaderWithSearchBar from "./HeaderWithSearchBar";
import { FlatList } from "react-native-gesture-handler";
import TakeOutTile from "../organisms/Tiles/TakeOutTile";
import LoadingSpinner from "../atoms/LoadingSpinner";
import { useFocusEffect } from "@react-navigation/native";
import TakeOutDetails from "../organisms/TakeOutDetails";
import BottomControlButtons from "../organisms/BottomControlButtons";
import BottomCreateNewButton from "../atoms/BottomCreateNewButton";

const TakeOutListSelector = (drawerProps: LoginDrawerProps) => {
	const [searchTerm, setSearchTerm] = useState("");
	const [chosenTakeOut, setChosenTakeOut] = useState(-1);
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
				setChosenTakeOut={setChosenTakeOut}
				drawerProps={drawerProps}
			/>
		);
	}, []);

	const keyExtractor = (takeOut: TakeOut) => takeOut.id.toString();

	return (
		<View style={{ flex: 1 }}>
			{chosenTakeOut === -1 ? (
				<>
					<HeaderWithSearchBar
						drawerProps={drawerProps}
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
									onPress={() =>
										drawerProps.navigation.navigate("TakeOutCreatorDrawer", {})
									}
								/>
							</BottomControlButtons>
						</>
					) : (
						<LoadingSpinner />
					)}
				</>
			) : (
				getTakeOuts.isSuccess &&
				getTakeOuts.data.some((takeOut) => takeOut.id === chosenTakeOut) && (
					<TakeOutDetails
						takeOut={
							getTakeOuts.data.find(
								(takeOut) => takeOut.id === chosenTakeOut
							) as TakeOut
						}
						setChosenTakeOut={setChosenTakeOut}
						drawerProps={drawerProps}
					/>
				)
			)}
		</View>
	);
};

export default TakeOutListSelector;

const styles = StyleSheet.create({});
