import NoInternet from "@/components/NoInternet";
import { colors } from "@/constants/colors";
import { AuthProvider } from "@/context/AuthContext";
import * as Network from "expo-network";
import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import { StatusBar } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function RootLayout() {
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    let subscription: { remove: () => void } | null = null;

    const subscribe = async () => {
      subscription = Network.addNetworkStateListener((state) => {
        setIsConnected(state.isConnected ?? false);
      });
    };

    subscribe();

    return () => {
      subscription?.remove();
    };
  }, []);

  if (!isConnected) {
    return (
      <NoInternet
        title={"No Internet Connection!"}
        message={"You’re offline. Connect to Wi-Fi or mobile data to continue."}
      />
    );
  } else {
    return (
      <SafeAreaProvider>
        <AuthProvider>
          <SafeAreaView style={{ flex: 1 }}>
            <StatusBar backgroundColor={colors.blue} />
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="index" />
              <Stack.Screen name="(auth)" />
            </Stack>
          </SafeAreaView>
        </AuthProvider>
      </SafeAreaProvider>
    );
  }
}
