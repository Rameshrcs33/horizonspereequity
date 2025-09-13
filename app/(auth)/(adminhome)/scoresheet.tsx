import { db } from "@/config/firebaseAppConfig";
import { colors } from "@/constants/colors";
import { useEvent } from "expo";
import { useVideoPlayer, VideoView } from "expo-video";
import { child, get, ref, update } from "firebase/database";
import { useEffect, useState } from "react";
import {
  Alert,
  Button,
  FlatList,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { RadioButton } from "react-native-paper";

type InterviewStatus = "Pending" | "In Progress" | "Completed" | "Rejected";
const STATUS_OPTIONS: any = ["Pending", "In Progress", "Completed", "Rejected"];

export default function ReviewerQuestionsScreen() {
  const [data, setData] = useState<any>([]);
  const [selected, setSelected] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [scoreText, setScoreText] = useState("");
  const [selectstatus, setselectstatus] = useState("Pending");

  useEffect(() => {
    fetchScoreList();
  }, []);

  async function fetchScoreList() {
    try {
      const dbRef = ref(db);
      const snapshot = await get(child(dbRef, "questions"));

      if (snapshot.exists()) {
        const data = snapshot.val();
        const formatted = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        setData(formatted);
      } else {
        setData([]);
      }
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  }

  function openModal(item: any) {
    setselectstatus(item?.interviewstatus);
    setSelected(item);
    setCommentText(item.comments != null ? String(item.comments) : "");
    setScoreText(item.score != null ? String(item.score) : "");
    setModalVisible(true);
  }

  function saveCommentAndScore() {
    if (!selected) return;

    if (commentText == "") {
      Alert.alert("Error", "Please enter comments.");
      return;
    } else if (scoreText == "") {
      Alert.alert("Invalid score", "Please enter a number between 0 and 100.");
      return;
    } else if (scoreText.trim() !== "") {
      const n = Number(scoreText);
      if (Number.isNaN(n) || n < 0 || n > 100) {
        Alert.alert(
          "Invalid score",
          "Please enter a number between 0 and 100."
        );
        return;
      }
    }
    handleUpdateAnswer();
  }
  const handleUpdateAnswer = async () => {
    const fields: any = {
      comments: commentText,
      score: Number(scoreText),
      interviewstatus: selectstatus,
      updatedAt: new Date().toISOString(),
    };
    const answerRef = await ref(db, `questions/${selected?.id}`);
    await update(answerRef, fields);

    setModalVisible(false);
    setSelected(null);
    fetchScoreList();
  };

  function RenderItem({ item, index }: { item: any; index: number }) {
    const player = useVideoPlayer({ uri: item?.video_url }, (player) => {
      player.loop = false;
      player.pause();
    });

    const { isPlaying } = useEvent(player, "playingChange", {
      isPlaying: player.playing,
    });

    return (
      <View style={styles.card}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.candidateName}>{item.name}</Text>
            <Text style={styles.title}>{item.title}</Text>
          </View>
          <View style={styles.statusBadgeContainer}>
            <Text
              style={[styles.statusBadge, statusColor(item.interviewstatus)]}
            >
              {item.interviewstatus}
            </Text>
          </View>
        </View>

        <Text style={styles.description}>{item.description}</Text>

        <Text style={styles.questionLabel}>Question:</Text>
        <Text style={styles.question}>{item.question}</Text>

        {item.video_url ? (
          <View style={styles.videoContainer}>
            <VideoView
              style={styles.video}
              player={player}
              allowsPictureInPicture
            />
            <View style={styles.controlsContainer}>
              <Button
                title={isPlaying ? "Pause" : "Play"}
                onPress={() => {
                  if (isPlaying) {
                    player.pause();
                  } else {
                    player.play();
                  }
                }}
              />
            </View>
          </View>
        ) : (
          <Text style={styles.noVideo}>No video provided.</Text>
        )}

        <View style={styles.footerRow}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => openModal(item)}
          >
            <Text style={styles.buttonText}>Add Comment / Score</Text>
          </TouchableOpacity>

          <View style={{ alignItems: "flex-end" }}>
            <Text style={styles.smallLabel}>Score</Text>
            <Text style={styles.scoreText}>
              {item.score != null ? String(item.score) : "—"}
            </Text>
            <Text style={styles.smallLabel}>Comments</Text>
            <Text numberOfLines={1} style={styles.commentsPreview}>
              {item.comments && item.comments.length > 0
                ? item.comments
                : "No comments"}
            </Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.screenTitle}>Reviewer Questions</Text>

      <FlatList
        data={data}
        contentContainerStyle={{ padding: 12, paddingBottom: 80 }}
        keyExtractor={(i) => i.id}
        renderItem={({ item, index }: any) => (
          <RenderItem item={item} index={index} />
        )}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
      />

      <Modal
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Add comment & score</Text>
          {selected && (
            <View style={{ width: "100%" }}>
              <Text style={styles.modalLabel}>Candidate</Text>
              <Text style={styles.modalValue}>
                {selected.name} — {selected.title}
              </Text>

              <Text style={styles.modalLabel}>Comment</Text>
              <TextInput
                value={commentText}
                onChangeText={setCommentText}
                placeholder="Write your comment..."
                style={styles.input}
                multiline
              />

              <Text style={styles.modalLabel}>Score (0 - 100)</Text>
              <TextInput
                value={scoreText}
                onChangeText={setScoreText}
                placeholder="e.g. 85"
                style={styles.input}
                keyboardType={Platform.OS === "ios" ? "number-pad" : "numeric"}
              />
              <Text style={styles.selected}>Select status:</Text>

              <FlatList
                horizontal={true}
                data={STATUS_OPTIONS}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                  <View style={styles.item}>
                    <RadioButton
                      value={item}
                      status={selectstatus === item ? "checked" : "unchecked"}
                      onPress={() => setselectstatus(item)}
                    />

                    <Text style={styles.label}>{item}</Text>
                  </View>
                )}
              />

              <View style={{ flexDirection: "row", marginTop: 20 }}>
                <TouchableOpacity
                  style={[styles.button, { flex: 1, marginRight: 8 }]}
                  onPress={saveCommentAndScore}
                >
                  <Text style={styles.buttonText}>Save</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, { backgroundColor: "#ccc", flex: 1 }]}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={[styles.buttonText, { color: "#000" }]}>
                    Cancel
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </Modal>
    </View>
  );
}

function statusColor(status: InterviewStatus) {
  switch (status) {
    case "Pending":
      return { backgroundColor: "#f0ad4e", color: "#fff" } as any;
    case "In Progress":
      return { backgroundColor: "#5bc0de", color: "#fff" } as any;
    case "Completed":
      return { backgroundColor: "#5cb85c", color: "#fff" } as any;
    case "Rejected":
      return { backgroundColor: "#d9534f", color: "#fff" } as any;
    default:
      return { backgroundColor: "#777", color: "#fff" } as any;
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f7f7fb" },
  screenTitle: { fontSize: 20, fontWeight: "700", margin: 12 },
  card: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  candidateName: { fontSize: 16, fontWeight: "700" },
  title: { fontSize: 13, color: "#555" },
  statusBadgeContainer: { minWidth: 100, alignItems: "flex-end" },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    overflow: "hidden",
    fontWeight: "700",
  },
  description: { marginTop: 8, color: "#444" },
  questionLabel: { marginTop: 8, fontWeight: "700" },
  question: { color: "#333" },
  videoContainer: {
    marginTop: 12,
    height: 180,
    backgroundColor: "#000",
    borderRadius: 8,
    overflow: "hidden",
  },
  video: { flex: 1 },
  noVideo: { marginTop: 12, color: "#888", fontStyle: "italic" },
  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
  },
  button: {
    backgroundColor: "#2e6ef7",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  buttonText: { color: "#fff", fontWeight: "700", textAlign: "center" },
  smallLabel: { fontSize: 11, color: "#666" },
  scoreText: { fontSize: 18, fontWeight: "700" },
  commentsPreview: { maxWidth: 200, color: "#444" },

  modalContainer: { flex: 1, padding: 16, backgroundColor: "#fff" },
  modalTitle: { fontSize: 18, fontWeight: "800", marginBottom: 12 },
  modalLabel: { fontWeight: "700", marginTop: 8 },
  modalValue: { color: "#333", marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    padding: 10,
    marginTop: 6,
    minHeight: 44,
  },
  playButton: {
    position: "absolute",
    top: "40%",
    left: "40%",
    backgroundColor: "rgba(0,0,0,0.6)",
    padding: 10,
    borderRadius: 50,
  },
  playButtonText: {
    color: "#fff",
    fontSize: 18,
  },
  controlsContainer: {
    marginTop: 10,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    marginHorizontal: 5,
  },
  label: {
    fontSize: 14,
    color: colors.black,
  },
  selected: {
    marginTop: 20,
    fontSize: 14,
    fontWeight: "bold",
    color: "green",
  },
});
