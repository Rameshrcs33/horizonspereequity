import { LogoTitle } from "@/components/HomeHeader";
import { colors } from "@/constants/colors";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";

export default function AdminRootLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "blue",
        headerShown: true,
        headerStyle: {
          backgroundColor: colors.blue,
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "bold",
        },
        headerTitle: () => <LogoTitle title={"Reviewer Dashboard"} />,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Users",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="code" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="scoresheet"
        options={{
          title: "Scores",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="code" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
