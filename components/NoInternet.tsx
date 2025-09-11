import { colors } from "@/constants/colors";
import React from "react";
import { Text, View } from "react-native";

const NoInternet = ({ message, title }: { message: string; title: string }) => {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ color: colors.red, fontWeight: "600" }}>{title}</Text>
      <Text style={{ marginVertical: 20 }} />
      <Text style={{ color: colors.black }}>{message}</Text>
    </View>
  );
};

export default NoInternet;
