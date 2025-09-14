import { db } from "@/config/firebaseAppConfig";
import { useAuth } from "@/context/AuthContext";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { equalTo, get, orderByChild, query, ref } from "firebase/database";
import { useCallback, useState } from "react";
import {
  FlatList,
  Modal,
  Platform,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function InterviewScreen() {
  const [selected, setSelected] = useState<any>(null);
  const [Data, setData] = useState<any>([]);
  const [ModalVisible, setModalVisible] = useState<boolean>(false);
  const router: any = useRouter();

  const { UserID, savequestionID, QuestionID } = useAuth();

  useFocusEffect(
    useCallback(() => {
      if (!UserID) return;
      fetchanswers();
      return () => {
        console.log("Home tab unfocused");
      };
    }, [UserID, QuestionID])
  );
  
  const fetchanswers = async () => {
    try {
      const usersRef = ref(db, "questions");
      const usersQuery = query(
        usersRef,
        orderByChild("userid"),
        equalTo(UserID)
      );

      const snapshot = await get(usersQuery);

      if (snapshot.exists()) {
        const data = snapshot.val();
        const formatted = Object.keys(data)
          .map((key) => ({
            id: key,
            ...data[key],
          }))
          .filter((item) => item.interviewstatus == "Pending");
        setData(formatted);
      } else {
        setData([]);
      }
    } catch (error) {
      console.log("Error fetching users:", error);
    }
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <View style={styles.row}>
        <View style={styles.meta}>
          <Text style={styles.title}>{item.title}</Text>
          <Text
            style={styles.description}
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {item.description}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.button}
          onPress={() => onselectItem(item)}
          accessibilityLabel={`Start interview for ${item.title}`}
        >
          <Text style={styles.buttonText}>Interview</Text>
        </TouchableOpacity>
      </View>
      <Text
        style={styles.questionPreview}
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {item.question}
      </Text>
    </View>
  );

  const onselectItem = (item: any) => {
    savequestionID(item?.id);
    setSelected(item);
    setModalVisible(true);
  };

  const toggleModal = () => {
    setModalVisible(false);
    router.push("/videorecorder");
    setSelected(null);
  };

  const hideModal = () => {
    setSelected(null);
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle={Platform.OS === "ios" ? "dark-content" : "light-content"}
      />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Interview Questions</Text>
        <Text style={styles.headerSubtitle}>
          Select a topic and tap Interview to begin
        </Text>
      </View>

      <FlatList
        data={Data}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />

      <Modal visible={ModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{selected?.title}</Text>
            <Text style={styles.modalDescription}>{selected?.description}</Text>

            <View style={styles.modalQuestionBox}>
              <Text style={styles.modalQuestionLabel}>Question</Text>
              <Text style={styles.modalQuestion}>{selected?.question}</Text>
            </View>

            <View style={styles.modalActions}>
              <Pressable
                style={[styles.modalActionButton, styles.startButton]}
                onPress={toggleModal}
              >
                <Text style={styles.startButtonText}>Start Interview</Text>
              </Pressable>

              <Pressable
                style={[styles.modalActionButton, styles.closeButton]}
                onPress={hideModal}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f6f7fb" },
  header: { padding: 16, paddingTop: 20 },
  headerTitle: { fontSize: 22, fontWeight: "700", marginBottom: 4 },
  headerSubtitle: { fontSize: 13, color: "#6b7280" },
  list: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 24 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  row: { flexDirection: "row", alignItems: "center" },
  meta: { flex: 1, paddingRight: 12 },
  title: { fontSize: 16, fontWeight: "700" },
  description: { fontSize: 13, color: "#4b5563", marginTop: 4 },
  button: {
    backgroundColor: "#2563eb",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  buttonText: { color: "#fff", fontWeight: "600" },
  questionPreview: { marginTop: 10, color: "#374151", fontSize: 13 },
  separator: { height: 12 },

  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  modalContent: {
    width: "92%",
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 18,
  },
  modalTitle: { fontSize: 18, fontWeight: "800" },
  modalDescription: { fontSize: 13, color: "#6b7280", marginTop: 6 },
  modalQuestionBox: {
    marginTop: 14,
    padding: 12,
    backgroundColor: "#f3f4f6",
    borderRadius: 8,
  },
  modalQuestionLabel: { fontSize: 12, color: "#374151", fontWeight: "700" },
  modalQuestion: { marginTop: 6, fontSize: 15, color: "#111827" },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 18,
  },
  modalActionButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
    marginHorizontal: 6,
  },
  startButton: { backgroundColor: "#065f46" },
  closeButton: { backgroundColor: "#e5e7eb" },
  startButtonText: { color: "#fff", fontWeight: "700" },
  closeButtonText: { color: "#111827", fontWeight: "700" },
});
