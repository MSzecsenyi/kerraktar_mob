import { Text, TouchableOpacity, View } from "react-native";
import { modalStyles } from "../../../styles";
import { useState } from "react";
import LoadingSpinner from "../../atoms/LoadingSpinner";

interface AcceptModalContentProps {
	closeModal: () => void;
	acceptModal: () => void;
	mainText?: string;
	explainText?: string;
	loading?: boolean;
}
const AcceptModalContent = ({
	closeModal,
	acceptModal,
	mainText = "Hozzáadod az eszközt a raktárhoz?",
	loading = false,
}: AcceptModalContentProps) => {
	const [acceptPressed, setAcceptPressed] = useState(false);
	return (
		<View>
			<Text style={modalStyles.infoText}>
				<Text style={modalStyles.boldText}>{mainText}</Text>
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
							style={modalStyles.buttonAccept}
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

export default AcceptModalContent;
