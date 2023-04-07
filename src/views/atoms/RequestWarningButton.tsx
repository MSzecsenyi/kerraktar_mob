import {
	FlatList,
	ListRenderItemInfo,
	StyleSheet,
	Text,
	TouchableOpacity,
} from "react-native";
import { OtherRequestInfo, RequestItem } from "../../interfaces";
import DefaultModal from "../molecules/DefaultModal";
import { useCallback, useState } from "react";
import { modalStyles } from "../../styles";

interface RequestWarningButtonProps {
	item: RequestItem;
}

const RequestWarningButton = ({ item }: RequestWarningButtonProps) => {
	const [modalIsVisible, setModalIsVisible] = useState(false);

	const renderRow = useCallback(
		({ item }: ListRenderItemInfo<OtherRequestInfo>) => {
			return <Text>{`${item.user} - ${item.amount}`}</Text>;
		},
		[]
	);

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
							data={item.other_requests}
							keyExtractor={(item) => item.user}
							renderItem={renderRow}
						/>
					</TouchableOpacity>
				</>
			</DefaultModal>
			<TouchableOpacity
				onPress={() => setModalIsVisible(true)}
				style={styles.warning_button}>
				<Text style={styles.light_text}>!</Text>
			</TouchableOpacity>
		</>
	);
};

export default RequestWarningButton;

const styles = StyleSheet.create({
	warning_button: {
		width: 30,
		height: 30,
		backgroundColor: "red",
		borderRadius: 50,
		alignItems: "center",
		justifyContent: "center",
	},
	light_text: {
		color: "white",
	},
});
