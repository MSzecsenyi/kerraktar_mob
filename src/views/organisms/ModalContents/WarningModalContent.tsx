import { Text, TouchableOpacity, View } from "react-native";
import { modalStyles } from "../../../styles";
import { useState } from "react";
import LoadingSpinner from "../../atoms/LoadingSpinner";

interface WarningModalContentProps {
	closeModal: () => void;
	acceptModal: () => void;
	mainText?: string;
	explainText?: string;
	loading?: boolean;
}
const WarningModalContent = ({
	closeModal,
	acceptModal,
	mainText = "Biztosan kilépsz?",
	explainText = "A most végrehajtott módosítások nem lesznek elmentve!",
	loading = false,
}: WarningModalContentProps) => {
	const [acceptPressed, setAcceptPressed] = useState(false);
	return (
		<View>
			<Text style={modalStyles.infoText}>
				<Text style={modalStyles.boldText}>{mainText}</Text>
				{`\n\n ${explainText}`}
			</Text>
			<View style={modalStyles.buttonContainer}>
				{!loading ? (
					<>
						<TouchableOpacity
							style={modalStyles.buttonReject}
							onPress={closeModal}>
							<Text style={modalStyles.buttonRejectText}>Mégse</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={modalStyles.buttonDelete}
							onPress={() => {
								if (!acceptPressed) acceptModal();
								setAcceptPressed(true);
							}}>
							<Text style={modalStyles.buttonAcceptText}>Igen</Text>
						</TouchableOpacity>
					</>
				) : (
					<LoadingSpinner />
				)}
			</View>
		</View>
	);
};

export default WarningModalContent;
