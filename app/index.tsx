import { colors } from "@/constants/colors";
import { LogedUser } from "@/hooks/LogedUser";
import { useFocusEffect, useRouter } from "expo-router";
import { Image, View } from "react-native";

export default function SplashScreen() {
  const router: any = useRouter();
  const { user } = LogedUser();

  useFocusEffect(() => {
    goToLogin();
  });

  const goToLogin = async () => {
    console.log("login user --------> ", user);
    let timeout = 0;
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      router.push("/(auth)");
    }, 1500);
  };

  return (
    <View
      style={{ flex: 1, alignItems: "center", backgroundColor: colors.white }}
    >
      <View style={{ height: "30%" }} />
      <Image
        source={require("@/assets/images/horizons.png")}
        style={{ width: "80%", height: 100 }}
      />
    </View>
  );
}
