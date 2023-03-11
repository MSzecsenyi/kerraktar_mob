import { StyleSheet } from 'react-native';

export const modalStyles = StyleSheet.create({
    textContainer: {
		flex: 1,
		flexDirection: "column",
		justifyContent: "center",
	},
    mainText: {
		fontSize: 20,
		textAlign: "center",
		marginBottom: 10,
	},
	infoText: {
		fontSize: 16,
		textAlign: "center",
	},
    boldText: {
		fontWeight: "bold",
	},
	buttonContainer: {
		marginTop: 20,
		flexDirection: "row",
		justifyContent: "space-around",
	},
	buttonReject: {
		paddingHorizontal: 10,
        minWidth: 100,
        maxWidth: "50%",
		height: 40,
		borderColor: "green",
		borderWidth: 2,
		borderRadius: 15,
		justifyContent: "center",
	},
	buttonAccept: {
		paddingHorizontal: 10,
        minWidth: 100,
        maxWidth: "50%",
		height: 40,
		backgroundColor: "green",
		borderRadius: 15,
		justifyContent: "center",
	},
    buttonRejectDelete: {
		paddingHorizontal: 10,
        minWidth: 100,
        maxWidth: "50%",
		height: 40,
		borderColor: "red",
		borderWidth: 2,
		borderRadius: 15,
		justifyContent: "center",
	},
    buttonDelete: {
		paddingHorizontal: 10,
        minWidth: 100,
        maxWidth: "50%",
		height: 40,
		backgroundColor: "red",
		borderRadius: 15,
		justifyContent: "center",
	},
	buttonRejectText: {
		textAlign: "center",
	},
	buttonAcceptText: {
		textAlign: "center",
		color: "white",
	},
})