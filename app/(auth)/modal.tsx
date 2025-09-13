import { colors } from "@/constants/colors";
import { useAuth } from "@/context/AuthContext";
import { insertquestionsData } from "@/hooks/RealtimeDatabase";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, BackHandler, Keyboard, StyleSheet, View } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";

export default function CreateQuestion() {
  const router: any = useRouter();
  const [title, setTitle] = useState("");
  const [question, setQuestion] = useState("");
  const [description, setDescription] = useState("");

  const { UserID, clearuserID, UserName, clearuserName } = useAuth();

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

  const handleSubmit = async () => {
    Keyboard.dismiss();
    if (!title || !question || !description) {
      Alert.alert("Alert!", "Please fill all fields");
      return;
    }

    submitForm();
  };

  const submitForm = async () => {
    const payload = {
      userid: UserID,
      name: UserName,
      title,
      question,
      description,
      interviewstatus: "Pending",
      comments: "",
      score: 0,
      video_url: "",
      status: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await insertquestionsData("questions", payload);
    Alert.alert("Alert!", "Question submitted successfully!");

    setTitle("");
    setQuestion("");
    setDescription("");
    clearuserID();
    clearuserName();
    router.back();
  };

  return (
    <View style={styles.container}>
      <Text variant="titleLarge" style={styles.heading}>
        Create Question
      </Text>

      <TextInput
        label="Title"
        value={title}
        onChangeText={setTitle}
        mode="outlined"
        style={styles.input}
      />

      <TextInput
        label="Description"
        value={description}
        onChangeText={setDescription}
        mode="outlined"
        multiline
        numberOfLines={4}
        style={styles.input}
      />

      <TextInput
        label="Question"
        value={question}
        onChangeText={setQuestion}
        mode="outlined"
        style={styles.input}
      />

      <Button mode="contained" onPress={handleSubmit} style={styles.button}>
        Submit
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  heading: {
    marginBottom: 20,
    textAlign: "center",
    color: colors.black,
  },
  input: {
    marginBottom: 15,
    color: colors.black,
  },
  button: {
    marginTop: 10,
    backgroundColor: colors.blue,
  },
});
