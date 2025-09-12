import { colors } from "@/constants/colors";
import { ActivityIndicator, Modal, StyleSheet, Text, View } from "react-native";

const Loader = ({ Visible }: { Visible: boolean }) => {
  return (
    <Modal visible={Visible} transparent={true} animationType={"fade"}>
      <View style={styles.container}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <ActivityIndicator size={"large"} color={colors.blue} />
          <Text style={{ color: colors.black }}>Loading....</Text>
        </View>
      </View>
    </Modal>
  );
};

export default Loader;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
});
