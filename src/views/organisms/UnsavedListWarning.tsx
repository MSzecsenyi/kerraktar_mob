import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { modalStyles } from '../../styles'

interface UnsavedListWarningProps {
    closeModal: () => void
    acceptModal: () => void
}
const UnsavedListWarning = ({closeModal, acceptModal}: UnsavedListWarningProps) => {
  return (
    <View>
					<Text style={modalStyles.infoText}>
								<Text style={modalStyles.boldText}>
									Biztos kilépsz?
								</Text>
						{`\n\n A most hozzáadott elemek nem lesznek elmentve!`}
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
							<Text style={modalStyles.buttonAcceptText}>
								Kilépés
							</Text>
						</TouchableOpacity>
					</View>
				</View>
  )
}

export default UnsavedListWarning

const styles = StyleSheet.create({})