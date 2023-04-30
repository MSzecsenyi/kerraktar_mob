import {
	FlatList,
	ListRenderItemInfo,
	StyleSheet,
	Text,
	TouchableOpacity,
	TouchableWithoutFeedback,
	View,
} from "react-native";
import { OtherRequestInfo, RequestItem } from "../../interfaces";
import DefaultModal from "../molecules/DefaultModal";
import { useCallback, useState } from "react";
import { modalStyles } from "../../styles";
import { displayShortDate } from "../../functions";
import Entypo from "react-native-vector-icons/Entypo";
import { COLORS } from "../../colors";

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
				<TouchableWithoutFeedback>
					<View style={styles.renderRowContainer}>
						<Text>{item.user}</Text>
						<Text>|</Text>
						<Text style={{ color: COLORS.border }}>
							{`${displayShortDate(item.start_date)} - ${displayShortDate(
								item.end_date
							)}`}
						</Text>
						<Text>|</Text>
						<Text>{item.amount} db</Text>
					</View>
				</TouchableWithoutFeedback>
			);
		},
		[]
	);
	const styles = StyleSheet.create({
		warning_button: {
			width: 30,
			height: 30,
			backgroundColor: isConflicted ? COLORS.warning : COLORS.mainColor,
			borderRadius: 50,
			alignItems: "center",
			justifyContent: "center",
		},
		light_text: {
			color: COLORS.white,
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
							keyboardShouldPersistTaps="always"
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
					color={COLORS.white}
				/>
			</TouchableOpacity>
		</>
	);
};

export default RequestWarningButton;
