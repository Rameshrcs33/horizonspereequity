import { colors } from "@/constants/colors";
import * as Updates from "expo-updates";
import { Pressable, Text, View } from "react-native";

const NoInternet = ({ message, title }: { message: string; title: string }) => {
  const restartApp = async () => {
    try {
      await Updates.reloadAsync();
    } catch (e) {
      console.error("Failed to restart app:", e);
    }
  };
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ color: colors.red, fontWeight: "600" }}>{title}</Text>
      <Text style={{ marginVertical: 5 }} />
      <Text style={{ color: colors.black }}>{message}</Text>
      <Text style={{ marginVertical: 20 }} />

      <Pressable
        style={{
          paddingVertical: 10,
          paddingHorizontal: 20,
          borderRadius: 5,
          borderWidth: 1,
          borderColor: colors.blue,
        }}
        onPress={restartApp}
      >
        <Text style={{ color: colors.blue, fontWeight: "bold" }}>Restart</Text>
      </Pressable>
    </View>
  );
};

export default NoInternet;
