import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { modalStyles } from "../../styles";

interface UnsavedListWarningProps {
	closeModal: () => void;
	acceptModal: () => void;
	mainText?: string;
	explainText?: string;
}
const UnsavedListWarning = ({
	closeModal,
	acceptModal,
	mainText = "Biztosan kilépsz?",
	explainText = "A most végrehajtott módosítások nem lesznek elmentve!",
}: UnsavedListWarningProps) => {
	return (
		<View>
			<Text style={modalStyles.infoText}>
				<Text style={modalStyles.boldText}>{mainText}</Text>
				{`\n\n ${explainText}`}
			</Text>
			<View style={modalStyles.buttonContainer}>
				<TouchableOpacity
					style={modalStyles.buttonReject}
					onPress={closeModal}
				>
					<Text style={modalStyles.buttonRejectText}>Mégse</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={modalStyles.buttonDelete}
					onPress={acceptModal}
				>
					<Text style={modalStyles.buttonAcceptText}>Igen</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
};

export default UnsavedListWarning;

const styles = StyleSheet.create({});
