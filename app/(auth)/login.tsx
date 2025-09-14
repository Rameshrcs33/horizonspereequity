import Loader from "@/components/Loader";
import { auth } from "../../config/firebaseAppConfig";
import { colors } from "@/constants/colors";
import { useAuth } from "@/context/AuthContext";
import { saveData } from "@/hooks/asyncStorage";
import { fetchUserData } from "@/hooks/RealtimeDatabase";
import { useRouter } from "expo-router";
import { reload, signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function LoginScreen() {
  const router: any = useRouter();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loader, setLoader] = useState<boolean>(false);
  const { saveuserID } = useAuth();

  const handleLogin = async () => {
    Keyboard.dismiss();
    if (!email || !password) {
      Alert.alert("Error", "Please enter email and password");
      return;
    }
    try {
      setLoader(true);
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential?.user;
      refreshUser(user);
    } catch (error: any) {
      setLoader(false);
      Alert.alert("Alert", JSON.stringify(error?.message));
    }
  };

  const refreshUser = async (user: any) => {
    if (auth.currentUser) {
      await reload(auth.currentUser);
      setLoader(false);
      if (!auth.currentUser.emailVerified) {
        Alert.alert("Alert", "Please verify your email before login.");
        return;
      }
    }
    let res: any = auth.currentUser;
    saveData("email", res?.email);
    saveData("name", res?.displayName);
    saveData("uid", res?.uid);
    saveData("accessToken", res?.stsTokenManager?.accessToken);
    let tableName = `users/${res?.uid}`;
    const responseData: any = await fetchUserData(tableName);
    setLoader(false);
    if (!responseData) {
      Alert.alert("Alert", "No user data found!");
      return;
    }

    if (responseData?.role == "Reviewer") {
      router.replace("/(adminhome)");
    }
    if (responseData?.role == "User") {
      await saveuserID(res?.uid);
      router.replace("/(userhome)");
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={"height"}
      keyboardVerticalOffset={0}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Login</Text>
        <View style={{ marginVertical: 30 }} />

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#888"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#888"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <View style={{ marginVertical: 10 }} />

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <View style={{ marginVertical: 20 }} />

        <TouchableOpacity
          style={[styles.button, styles.signup]}
          onPress={() => router.push("/signup")}
        >
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>

        <Loader Visible={loader} />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
    color: colors.black,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 16,
    color: colors.black,
  },
  button: {
    backgroundColor: colors.blue,
    padding: 15,
    borderRadius: 8,
    marginVertical: 8,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
  },
  signup: {
    backgroundColor: "#34C759",
  },
});
