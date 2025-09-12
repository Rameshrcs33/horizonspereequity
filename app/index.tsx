import { colors } from "@/constants/colors";
import { useFocusEffect, useRouter } from "expo-router";
import { Image, View } from "react-native";

export default function SplashScreen() {
  const router: any = useRouter();
  
  useFocusEffect(() => {
    let timeout = 0;
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      goToLogin();
    }, 1500);
  });


  const goToLogin = () => {
    router.push("/(auth)");
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
