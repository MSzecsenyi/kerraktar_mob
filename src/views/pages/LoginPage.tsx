import { StyleSheet, Text, TextInput, View, Image } from "react-native";
import { useState } from "react";
import { LoginInfo } from "../../interfaces";
import { useLoginUser } from "../../query-hooks/useLoginUser";
import LoadingSpinner from "../atoms/LoadingSpinner";
import { TouchableOpacity } from "react-native";
import { COLORS } from "../../colors";

export default function LoginPage() {
	const [loginInfo, setLoginInfo] = useState<LoginInfo>({
		email: "csapat@nn.nn",
		password: "password",
	});

	const loginUser = useLoginUser(loginInfo);

	const handleOnChange = (text: string, name: string) => {
		setLoginInfo((prev) => ({
			...prev,
			[name]: text,
		}));
	};

	return (
		<View style={styles.container}>
			<Image
				source={require("../../../assets/icon.png")}
				style={styles.image}
			/>
			<Text>Felhasználónév</Text>
			<TextInput
				onChangeText={(text) => handleOnChange(text, "email")}
				style={styles.textInput}>
				{loginInfo.email}
			</TextInput>

			<Text>Jelszó</Text>
			<TextInput
				secureTextEntry
				onChangeText={(text) => handleOnChange(text, "password")}
				style={styles.textInput}>
				{loginInfo.password}
			</TextInput>
			<View style={styles.loginContainer}>
				{loginUser.isLoading || loginUser.isSuccess ? (
					<LoadingSpinner />
				) : (
					<TouchableOpacity
						style={styles.loginButton}
						onPress={() => loginUser.mutate()}>
						<Text style={styles.loginButtonText}>Bejelentkezés</Text>
					</TouchableOpacity>
				)}
			</View>
			{loginUser.isError && <Text>Helytelen bejelentkezési adatok</Text>}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: COLORS.white,
		alignItems: "center",
		justifyContent: "center",
	},
	textInput: {
		height: 40,
		margin: 12,
		width: 200,
		borderWidth: 1,
		padding: 10,
		borderRadius: 15,
	},
	loginContainer: {
		height: 50,
	},
	loginButton: {
		width: 120,
		height: 40,
		backgroundColor: COLORS.mainColor,
		borderRadius: 10,
		justifyContent: "center",
	},
	loginButtonText: {
		fontSize: 16,
		color: COLORS.white,
		textAlign: "center",
	},
	image: {
		resizeMode: "center",
		height: 50,
	},
});
