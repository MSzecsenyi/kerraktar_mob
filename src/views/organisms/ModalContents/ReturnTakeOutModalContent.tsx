import { View, Text, TouchableOpacity } from "react-native";
import { modalStyles } from "../../../styles";
import { usePutTakeOut } from "../../../query-hooks/UseTakeOuts";
import LoadingSpinner from "../../atoms/LoadingSpinner";

interface ReturnTakeOutModalContentProps {
	closeFn: () => void;
	takeOutId: number;
	acceptOnPress: () => void;
}

const ReturnTakeOutModalContent = ({
	closeFn,
	takeOutId,
	acceptOnPress,
}: ReturnTakeOutModalContentProps) => {
	const putTakeOut = usePutTakeOut({ takeOutId, acceptOnPress });

	return (
		<View>
			<Text style={modalStyles.mainText}>
				Raktárba rakod a kivett eszközöket?
			</Text>
			<View style={modalStyles.buttonContainer}>
				{putTakeOut.isLoading ? (
					<LoadingSpinner />
				) : (
					<>
						<TouchableOpacity
							style={modalStyles.buttonReject}
							onPress={closeFn}>
							<Text style={modalStyles.buttonRejectText}>Mégse</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={modalStyles.buttonAccept}
							onPress={() => {
								putTakeOut.mutate();
							}}>
							<Text style={modalStyles.buttonAcceptText}>Igen</Text>
						</TouchableOpacity>
					</>
				)}
			</View>
		</View>
	);
};

export default ReturnTakeOutModalContent;
