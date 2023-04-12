import { Text, TouchableOpacity, View } from "react-native";
import { modalStyles } from "../../styles";
import { useState } from "react";

interface WarningModalContentProps {
	closeModal: () => void;
	acceptModal: () => void;
	mainText?: string;
	explainText?: string;
}
const WarningModalContent = ({
	closeModal,
	acceptModal,
	mainText = "Biztosan kilépsz?",
	explainText = "A most végrehajtott módosítások nem lesznek elmentve!",
}: WarningModalContentProps) => {
	const [acceptPressed, setAcceptPressed] = useState(false);
	return (
		<View>
			<Text style={modalStyles.infoText}>
				<Text style={modalStyles.boldText}>{mainText}</Text>
				{`\n\n ${explainText}`}
			</Text>
			<View style={modalStyles.buttonContainer}>
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
			</View>
		</View>
	);
};

export default WarningModalContent;
