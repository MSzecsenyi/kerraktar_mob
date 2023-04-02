import { View, Text, TouchableHighlight } from "react-native";
import { modalStyles } from "../../styles";
import { usePutTakeOut } from "../../query-hooks/UseTakeOuts";
import LoadingSpinner from "../atoms/LoadingSpinner";

interface ReturnTakeOutModalContentProps {
	closeFn: () => void;
	takeOutId: number;
	setChosenTakeOut: React.Dispatch<React.SetStateAction<number>>;
}

const ReturnTakeOutModalContent = ({
	closeFn,
	takeOutId,
	setChosenTakeOut,
}: ReturnTakeOutModalContentProps) => {
	const putTakeOut = usePutTakeOut({ takeOutId, setChosenTakeOut });

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
						<TouchableHighlight
							style={modalStyles.buttonReject}
							onPress={closeFn}
						>
							<Text style={modalStyles.buttonRejectText}>Mégse</Text>
						</TouchableHighlight>
						<TouchableHighlight
							style={modalStyles.buttonAccept}
							onPress={() => {
								putTakeOut.mutate();
							}}
						>
							<Text style={modalStyles.buttonAcceptText}>Igen</Text>
						</TouchableHighlight>
					</>
				)}
			</View>
		</View>
	);
};

export default ReturnTakeOutModalContent;