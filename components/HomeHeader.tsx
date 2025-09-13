import { auth } from "@/config/firebaseAppConfig";
import { colors } from "@/constants/colors";
import { removeData } from "@/hooks/asyncStorage";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import { useRouter } from "expo-router";
import { Alert, View, Text } from "react-native";

export function LogoTitle({ title }: { title: string }) {
  const router: any = useRouter();

  const logout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel" },
      {
        text: "OK",
        onPress: () => {
          removeData();
          auth.signOut();
          router.replace("/login");
        },
      },
    ]);
  };

  return (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <SimpleLineIcons
        size={26}
        name="logout"
        color={colors.white}
        onPress={logout}
      />

      <View style={{ marginHorizontal: 10 }} />
      <Text style={{ color: colors.white, fontWeight: "bold", fontSize: 18 }}>
        {title}
      </Text>
    </View>
  );
}
