import { db } from "@/config/firebaseAppConfig";
import { useAuth } from "@/context/AuthContext";
import { ResizeMode, Video } from "expo-av";
import { equalTo, get, orderByChild, query, ref } from "firebase/database";
import React, { useEffect, useRef, useState } from "react";
import {
  FlatList,
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const statusColor = (status: any) => {
  switch (status) {
    case "Pending":
      return "#f0ad4e" as any;
    case "In Progress":
      return "#5bc0de" as any;
    case "Completed":
      return "#5cb85c" as any;
    case "Rejected":
      return "#d9534f" as any;
    default:
      return "#777" as any;
  }
};

const AnswerCard: React.FC<{
  item: any;
  onPlayVideo: (uri: string) => void;
}> = ({ item, onPlayVideo }) => {
  return (
    <View style={styles.card}>
      <View style={styles.rowSpace}>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.question}>{item.question}</Text>
          <Text style={styles.description}>{item.description}</Text>
        </View>
        <View style={styles.statusBadgeContainer}>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: statusColor(item?.interviewstatus) },
            ]}
          >
            <Text style={styles.statusText}>{item?.interviewstatus}</Text>
          </View>
        </View>
      </View>

      {item.video_url ? (
        <TouchableOpacity
          onPress={() => onPlayVideo(item.video_url)}
          style={styles.videoThumb}
        >
          <Image
            source={require("@/assets/images/play.png")}
            style={styles.thumbImage}
            resizeMode="contain"
          />
        </TouchableOpacity>
      ) : (
        <View style={styles.noVideoBox}>
          <Text style={{ color: "#666" }}>No video attached</Text>
        </View>
      )}

      <View style={styles.metaRow}>
        <Text style={styles.commentsCount}>comments</Text>
        <Text style={styles.score}>Score: {item.score ?? "—"}</Text>
      </View>

      <View style={styles.commentsSection}>
        <Text>{item?.comments}</Text>
      </View>
    </View>
  );
};

export default function AnswerListScreen() {
  const [data, setData] = useState<any>([]);
  const [playingUri, setPlayingUri] = useState<string | null>(null);
  const videoRef = useRef<Video | null>(null);
  const { UserID } = useAuth();

  useEffect(() => {
    if (!UserID) return;
    fetchanswers();
  }, [UserID]);

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
        const formatted = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        console.log("Fetched answers:");
        setData(formatted);
      } else {
        setData([]);
      }
    } catch (error) {
      console.log("Error fetching users:", error);
    }
  };

  const handlePlayVideo = (uri: string) => {
    setPlayingUri(uri);
  };

  const closeVideo = () => {
    if (videoRef.current) {
      videoRef.current.pauseAsync().catch(() => {});
    }
    setPlayingUri(null);
  };

  const renderItem = ({ item }: { item: any }) => (
    <AnswerCard item={item} onPlayVideo={handlePlayVideo} />
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Answers</Text>

      <FlatList
        data={data}
        keyExtractor={(i) => i.id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 12, paddingBottom: 120 }}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        removeClippedSubviews={true}
        initialNumToRender={5}
        maxToRenderPerBatch={10}
        windowSize={11}
      />

      <Modal
        visible={!!playingUri}
        animationType="slide"
        onRequestClose={closeVideo}
      >
        <View style={styles.modalRoot}>
          <Pressable style={styles.closeBtn} onPress={closeVideo}>
            <Text style={{ color: "#fff" }}>Close</Text>
          </Pressable>

          {playingUri ? (
            <Video
              ref={(ref: any) => (videoRef.current = ref)}
              source={{ uri: playingUri }}
              rate={1.0}
              volume={1.0}
              isMuted={false}
              resizeMode={ResizeMode.CONTAIN}
              shouldPlay
              useNativeControls
              style={styles.videoPlayer}
            />
          ) : null}
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fafafa" },
  header: { fontSize: 22, fontWeight: "700", padding: 16 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  rowSpace: { flexDirection: "row", alignItems: "flex-start" },
  title: { fontSize: 16, fontWeight: "700" },
  question: { fontSize: 13, color: "#444", marginTop: 6 },
  description: { fontSize: 13, color: "#666", marginTop: 6 },
  videoThumb: {
    marginTop: 12,
    borderRadius: 8,
    overflow: "hidden",
    height: 180,
    justifyContent: "center",
    alignItems: "center",
  },
  thumbImage: { width: "25%", height: "25%" },

  playText: {
    fontSize: 40,
    color: "#fff",
    textShadowColor: "#000",
    textShadowRadius: 6,
  },
  noVideoBox: {
    marginTop: 12,
    height: 80,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#eee",
    justifyContent: "center",
    alignItems: "center",
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  score: { fontWeight: "700" },
  commentsCount: { color: "#888" },
  commentsSection: { marginTop: 10 },
  commentText: { color: "#333", marginBottom: 6 },

  modalRoot: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  videoPlayer: { width: "100%", height: 300, backgroundColor: "#000" },
  closeBtn: {
    position: "absolute",
    top: 40,
    right: 16,
    padding: 8,
    backgroundColor: "#111",
    borderRadius: 6,
    zIndex: 10,
  },
  statusBadgeContainer: { marginLeft: 10 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 16 },
  statusText: { color: "#fff", fontWeight: "700", fontSize: 12 },
});
