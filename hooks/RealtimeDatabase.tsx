import { db } from "@/config/firebaseAppConfig";
import { get, push, ref, set } from "firebase/database";
import { Alert } from "react-native";

export const fetchUserData = async (uid: string) => {
  const snapshot = await get(ref(db, `users/${uid}`));

  if (snapshot.exists()) {
    return snapshot.val();
  } else {
    Alert.alert("Alert", "No data available");
    return null;
  }
};

export const insertUserData = async (table: any, payload: any) => {
  const snapshot: any = await set(ref(db, table), payload);
  return snapshot;
};

export const insertquestionsData = async (table: any, payload: any) => {
  const snapshot: any = await push(ref(db, table), payload);
  return snapshot;
};
