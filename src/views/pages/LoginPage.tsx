import {
	StyleSheet,
	Text,
	SafeAreaView,
	Button,
	TextInput,
} from "react-native";
import { useState, useContext } from "react";
import { LoginInfo } from "../../interfaces";
import { useLoginUser, useLogoutUser } from "../../query-hooks/useLoginUser";
import { UserDataContext } from "../../contexts/UserData";

export default function LoginPage() {
	const { loggedInUser } = useContext(UserDataContext);
	const [loginInfo, setLoginInfo] = useState<LoginInfo>({
		email: "admin@nn.nn",
		password: "password",
	});

	// console.log(loggedInUser);

	const loginUser = useLoginUser(loginInfo);
	const logoutUser = useLogoutUser();

	const handleOnChange = (text: string, name: string) => {
		setLoginInfo((prev) => ({
			...prev,
			[name]: text,
		}));
	};

	return (
		<SafeAreaView style={styles.container}>
			<Text>Felhasználónév</Text>
			<TextInput
				onChangeText={(text) => handleOnChange(text, "email")}
				style={styles.textInput}
			>
				{loginInfo.email}
			</TextInput>

			<Text>Jelszó</Text>
			<TextInput
				onChangeText={(text) => handleOnChange(text, "password")}
				style={styles.textInput}
			>
				{loginInfo.password}
			</TextInput>

			<Button
				title="Belépés"
				onPress={() => loginUser.mutate()}
			/>
			<Button
				title="Kilépés"
				onPress={() => logoutUser.mutate()}
			/>

			{loginUser.isLoading && <Text>Loading...</Text>}
			{loginUser.isError && <Text>Helytelen bejelentkezési adatok</Text>}
			{loggedInUser.userData ? (
				<Text>Belépve: {loggedInUser.userData?.user.email}</Text>
			) : (
				<Text>Kilépve</Text>
			)}
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
		alignItems: "center",
		justifyContent: "center",
	},
	textInput: {
		height: 40,
		margin: 12,
		width: 200,
		borderWidth: 1,
		padding: 10,
	},
});
