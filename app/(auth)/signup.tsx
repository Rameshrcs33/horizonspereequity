import Loader from "@/components/Loader";
import { auth } from "@/config/firebaseAppConfig";
import { colors } from "@/constants/colors";
import { useRouter } from "expo-router";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
} from "firebase/auth";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  BackHandler,
  Keyboard,
  KeyboardAvoidingView,
} from "react-native";

export default function SignupScreen() {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loader, setLoader] = useState<boolean>(false);

  const router: any = useRouter();

  useEffect(() => {
    const unsubscribe = BackHandler.addEventListener(
      "hardwareBackPress",
      backHandler
    );

    return () => unsubscribe.remove();
  }, []);

  const backHandler = () => {
    router.back();
    return true;
  };

  const isValidEmail = (email: string) => /\S+@\S+\.\S+/.test(email);
  const handleSignUp = async () => {
    Keyboard.dismiss();
    if (!name) {
      Alert.alert("Error", "Please enter name");
      return;
    } else if (!email) {
      Alert.alert("Error", "Please enter email");
      return;
    } else if (!isValidEmail(email)) {
      Alert.alert("Invalid Email", "Please enter a valid email address");
      return;
    } else if (!password) {
      Alert.alert("Error", "Please enter password");
      return;
    }
    try {
      setLoader(true);
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );
      const user = userCredential.user;
      await sendEmailVerification(user);
      Alert.alert("Alert", "Verification email sent! Please check your inbox.");

      await updateProfile(user, {
        displayName: name.trim(),
      });
      setLoader(false);
      router.push("/");
    } catch (error: any) {
      setLoader(false);
      Alert.alert("Alert", JSON.stringify(error?.message));
      return;
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={"height"}
      keyboardVerticalOffset={0}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Sign Up</Text>
        <View style={{ marginVertical: 20 }} />

        <TextInput
          style={styles.input}
          placeholder="Name"
          value={name}
          onChangeText={setName}
        />

        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <View style={{ marginVertical: 20 }} />

        <TouchableOpacity style={styles.button} onPress={handleSignUp}>
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
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 30,
    color: colors.black,
  },
  input: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 15,
    fontSize: 16,
    color: colors.black,
  },
  button: {
    backgroundColor: colors.blue,
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});
