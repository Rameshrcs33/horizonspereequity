import { LogoTitle } from "@/components/HomeHeader";
import { colors } from "@/constants/colors";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";

export default function UserRootLayout() {
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
        headerTitle: () => <LogoTitle title={"Candidate Dashboard"} />,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Interview",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="code" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="answersheet"
        options={{
          title: "Answers / Score",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="code" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
