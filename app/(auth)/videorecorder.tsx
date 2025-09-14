import {
  Camera,
  CameraType,
  useCameraPermissions,
  CameraView,
} from "expo-camera";
import * as MediaLibrary from "expo-media-library";
import { useEffect, useRef, useState } from "react";
import { Button, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function VideoRecorder() {
  const cameraRef = useRef<CameraView>(null);
  const [recording, setRecording] = useState<boolean>(false);
  const [videoUri, setVideoUri] = useState<string | null>(null);
  const [facing, setFacing] = useState<CameraType>("front");
  const [permission, requestPermission] = useCameraPermissions();
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  useEffect(() => {
    (async () => {
      const { status: cameraStatus } =
        await Camera.requestCameraPermissionsAsync();

      const { status: audioStatus } =
        await Camera.requestMicrophonePermissionsAsync();

      setHasPermission(cameraStatus === "granted" && audioStatus === "granted");
    })();
  }, []);

  if (hasPermission === null) {
    return <Text>Requesting for camera permission...</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: "center" }}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="Grant permission" />
      </View>
    );
  }

  const startRecording = async () => {
    if (cameraRef.current) {
      try {
        const videoRecordPromise = cameraRef.current.recordAsync();
        await setRecording(true);

        const data = await videoRecordPromise;
        if (data && data.uri) {
          console.log("Video recording completed", data.uri);
          await MediaLibrary.createAssetAsync(data.uri);
        } else {
          console.error("Video recording failed: No data returned.");
        }
      } catch (error) {
        console.error("Error recording video:", error);
      }
    }
  };

  const stopRecording = async () => {
    if (cameraRef.current) {
      try {
        await cameraRef.current.stopRecording();
        await setRecording(false);
      } catch (error) {
        console.error("Error stopping recording:", error);
      }
    }
  };

  function handleRecord() {
    if (!recording) {
      startRecording();
    } else {
      stopRecording();
    }
  }

  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} ref={cameraRef} facing={facing} />
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleRecord}>
          <Text style={styles.text}>
            {recording ? "Stop Recording" : "Start Recording"}
          </Text>
        </TouchableOpacity>
        <View style={{ marginHorizontal: 10 }} />
        <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
          <Text style={styles.text}>Flip Camera</Text>
        </TouchableOpacity>
      </View>
      {videoUri && <Text>Video Recorded: {videoUri}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    padding: 20,
  },
  button: {
    backgroundColor: "blue",
    padding: 15,
    borderRadius: 10,
  },
  text: {
    color: "white",
    fontSize: 18,
  },
});
