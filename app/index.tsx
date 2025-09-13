import { colors } from "@/constants/colors";
import { useAuth } from "@/context/AuthContext";
import { getData } from "@/hooks/asyncStorage";
import { fetchUserData } from "@/hooks/RealtimeDatabase";
import { useFocusEffect, useRouter } from "expo-router";
import { Image, View } from "react-native";

export default function SplashScreen() {
  const router: any = useRouter();
  const { saveuserID } = useAuth();

  useFocusEffect(() => {
    fetchuserInfo();
  });

  const fetchuserInfo = async () => {
    let uid: any = null;
    try {
      uid = await getData("uid");
    } catch (error) {}
    let res: any = null;
    if (uid != null) {
      let tableName = `users/${uid}`;
      res = await fetchUserData(tableName);
    }
    let timeout = 0;
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      redirectUser(uid, res);
    }, 1500);
  };

  const redirectUser = async (val: any, res: any) => {
    if (val != null) {
      if (res != null && res?.role == "User") {
        await saveuserID(val);
        router.replace("/(userhome)");
      } else if (res != null && res?.role == "Reviewer") {
        router.replace("/(adminhome)");
      } else {
        redirectToUserLogin();
      }
    } else {
      redirectToUserLogin();
    }
  };

  const redirectToUserLogin = () => {
    router.replace("/login");
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
