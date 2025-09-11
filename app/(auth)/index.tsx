import { colors } from "@/constants/colors";
import { StyleSheet, Text, View } from "react-native";

export default function Login() {
  return (
    <View
      style={{ flex: 1, alignItems: "center", backgroundColor: colors.white }}
    >
      <View style={{ height: "30%" }} />

      <Text style={styles.text}>Login Screen !!!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 10,
    paddingHorizontal: 50,
    borderRadius: 10,
    backgroundColor: colors.blue,
  },
  text: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.black,
  },
});
