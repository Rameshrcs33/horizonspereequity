import Loader from "@/components/Loader";
import { db, storage } from "../../config/firebaseAppConfig";
import { colors } from "@/constants/colors";
import { useAuth } from "@/context/AuthContext";
import { Camera, CameraType, CameraView } from "expo-camera";
import { useRouter } from "expo-router";
import { ref as databaseRef, update } from "firebase/database";
import {
  getDownloadURL,
  ref as storageRef,
  uploadBytes,
} from "firebase/storage";
import { useEffect, useRef, useState } from "react";
import { Alert, Button, Linking, StyleSheet, Text, View } from "react-native";

export default function App() {
  const router: any = useRouter();
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [cameraReady, setCameraReady] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const cameraRef = useRef<CameraView>(null);
  const [facing, setFacing] = useState<CameraType>("front");
  const [videoUri, setVideoUri] = useState<string | null>(null);
  const [loader, setLoader] = useState<boolean>(false);

  const { QuestionID, clearquestionID } = useAuth();

  useEffect(() => {
    setVideoUri(null);
    checkPermissions();
  }, []);

  const checkPermissions = async () => {
    const { status: cameraStatus } =
      await Camera.requestCameraPermissionsAsync();
    const { status: micStatus } =
      await Camera.requestMicrophonePermissionsAsync();

    setHasPermission(cameraStatus === "granted" && micStatus === "granted");
  };

  const openSettings = () => {
    Linking.openSettings();
  };

  const uriToBlob = async (uri: any) => {
    const response = await fetch(uri);
    return await response.blob();
  };

  const uploadVideoToFirebase = async (uri: any) => {
    setLoader(true);
    try {
      const blob = await uriToBlob(uri);
      const filename = `videos/${Date.now()}.mp4`;
      const videoRef = storageRef(storage, filename);

      await uploadBytes(videoRef, blob);
      const downloadURL = await getDownloadURL(videoRef);
      updateanswerwithVideo(downloadURL);
    } catch (error: any) {
      setLoader(false);
      Alert.alert("Upload failed", error.message);
    }
  };

  const updateanswerwithVideo = async (url: any) => {
    const fields: any = {
      video_url: url,
      interviewstatus: "In Progress",
      updatedAt: new Date().toISOString(),
    };
    const answerRef = databaseRef(db, `questions/${QuestionID}`);
    await update(answerRef, fields);
    setVideoUri(null);
    Alert.alert("Success", "Video uploaded successfully!");
    setLoader(false);
    clearquestionID();
    router.back();
  };

  const recordVideo = async () => {
    setVideoUri(null);
    if (cameraRef.current) {
      try {
        setIsRecording(true);
        const video: any = await cameraRef.current.recordAsync({
          maxDuration: 120,
        });

        console.log("Video recorded:", video.uri);
        setVideoUri(video?.uri);
      } catch (error) {
        console.error("Recording error:", error);
      } finally {
        setIsRecording(false);
      }
    }
  };

  const stopRecording = async () => {
    if (cameraRef.current) {
      cameraRef.current.stopRecording();
    }
  };

  if (hasPermission === null) {
    return <Text>Checking permissions...</Text>;
  }

  if (hasPermission === false) {
    return (
      <View>
        <Text>No access to camera/mic</Text>
        <Button title="Re-request Permission" onPress={checkPermissions} />
        <Button title="Open Settings" onPress={openSettings} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        mode="video"
        facing={facing}
        flash={"auto"}
        ref={cameraRef}
        onCameraReady={() => setCameraReady(true)}
      />

      <View style={styles.controls}>
        <>
          {isRecording ? (
            <Button title="Stop" onPress={stopRecording} color={colors.red} />
          ) : (
            <Button
              title="Record"
              onPress={recordVideo}
              disabled={!cameraReady}
              color={colors.blue}
            />
          )}
        </>
        <View style={{ marginHorizontal: 10 }} />

        <>
          {videoUri != null ? (
            <Button
              title="Upload"
              onPress={() => uploadVideoToFirebase(videoUri)}
              color={colors.blue}
            />
          ) : (
            <Button
              title="Flip Camera"
              onPress={() =>
                setFacing((prev) => (prev == "front" ? "back" : "front"))
              }
              disabled={!cameraReady}
              color={colors.blue}
            />
          )}
        </>
      </View>
      <Loader Visible={loader} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  controls: {
    backgroundColor: "transparent",
    flexDirection: "row",
    justifyContent: "center",
    position: "absolute",
    bottom: 40,
    zIndex: 10,
    width: "100%",
  },
});
