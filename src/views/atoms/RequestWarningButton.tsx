import {
	FlatList,
	ListRenderItemInfo,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import { OtherRequestInfo, RequestItem } from "../../interfaces";
import DefaultModal from "../molecules/DefaultModal";
import { useCallback, useState } from "react";
import { modalStyles } from "../../styles";
import { displayShortDate } from "../../functions";
import Entypo from "react-native-vector-icons/Entypo";

interface RequestWarningButtonProps {
	item: RequestItem;
	isConflicted: boolean;
}

const RequestWarningButton = ({
	item,
	isConflicted,
}: RequestWarningButtonProps) => {
	const [modalIsVisible, setModalIsVisible] = useState(false);

	const renderRow = useCallback(
		({ item }: ListRenderItemInfo<OtherRequestInfo>) => {
			return (
				<View style={styles.renderRowContainer}>
					<Text>{item.user}</Text>
					<Text>|</Text>
					<Text style={{ color: "gray" }}>
						{`${displayShortDate(item.start_date)} - ${displayShortDate(
							item.end_date
						)}`}
					</Text>
					<Text>|</Text>
					<Text>{item.amount}</Text>
				</View>
			);
		},
		[]
	);
	const styles = StyleSheet.create({
		warning_button: {
			width: 30,
			height: 30,
			backgroundColor: isConflicted ? "red" : "green",
			borderRadius: 50,
			alignItems: "center",
			justifyContent: "center",
		},
		light_text: {
			color: "white",
		},
		renderRowContainer: {
			flex: 1,
			flexDirection: "row",
			justifyContent: "space-between",
			marginBottom: 10,
			paddingHorizontal: "10%",
		},
	});
	return (
		<>
			<DefaultModal
				visible={modalIsVisible}
				closeFn={() => setModalIsVisible(false)}>
				<>
					<TouchableOpacity onPress={() => setModalIsVisible(false)}>
						<Text style={modalStyles.mainText}>
							Mások is foglaltak ebből az eszközből:
						</Text>
						<FlatList
							data={item.other_requests.sort((a, b) => {
								if (a.start_date < b.start_date) {
									return -1;
								}
								if (a.start_date > b.start_date) {
									return 1;
								}
								return 0;
							})}
							keyExtractor={(item) => item.user}
							renderItem={renderRow}
						/>
					</TouchableOpacity>
				</>
			</DefaultModal>
			<TouchableOpacity
				onPress={() => setModalIsVisible(true)}
				style={styles.warning_button}>
				<Entypo
					name={"info"}
					size={14}
					color="white"
				/>
			</TouchableOpacity>
		</>
	);
};

export default RequestWarningButton;
