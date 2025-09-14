import { colors } from "@/constants/colors";
import { Stack, useRouter } from "expo-router";
import { View } from "react-native";
import { Button } from "react-native-paper";

export default function AuthLayout() {
  const router: any = useRouter();

  const Header = ({ title }: any) => {
    return (
      <View
        style={{
          backgroundColor: colors.blue,
          paddingHorizontal: 20,
          paddingVertical: 8,
          alignItems: "flex-start",
        }}
      >
        <Button
          mode={"text"}
          onPress={() => router.back()}
          labelStyle={{ color: colors.white, fontSize: 14 }}
        >
          {title}
        </Button>
      </View>
    );
  };
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName={"login"}
    >
      <Stack.Screen name="login" />
      <Stack.Screen name="signup" />
      <Stack.Screen name="(userhome)" />
      <Stack.Screen name="(adminhome)" />
      <Stack.Screen
        name="modal"
        options={{
          presentation: "modal",
          headerShown: true,
          header: () => <Header title={"Go Back"} />,
        }}
      />

      <Stack.Screen
        name="videorecorder"
        options={{
          presentation: "modal",
          headerShown: true,
          header: () => <Header title={"Go Back"} />,
        }}
      />
    </Stack>
  );
}
