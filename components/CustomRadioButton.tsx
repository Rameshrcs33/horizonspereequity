import { colors } from "@/constants/colors";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const CustomRadioButton = ({ options, selected, onSelect }: any) => {
  return (
    <View>
      {options.map((option: any) => (
        <TouchableOpacity
          key={option}
          style={styles.option}
          onPress={() => onSelect(option)}
        >
          <View
            style={[
              styles.outerCircle,
              selected === option && styles.selectedCircle,
            ]}
          >
            {selected === option && <View style={styles.innerCircle} />}
          </View>
          <Text style={styles.text}>{option}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default CustomRadioButton;

const styles = StyleSheet.create({
  option: { flexDirection: "row", alignItems: "center", marginVertical: 5 },
  outerCircle: {
    height: 24,
    width: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  selectedCircle: { borderColor: "#007AFF" },
  innerCircle: {
    height: 12,
    width: 12,
    borderRadius: 6,
    backgroundColor: "#007AFF",
  },
  text: { fontSize: 16, color: colors.black },
});
