import AsyncStorage from "@react-native-async-storage/async-storage";

export async function saveData(key: string, value: any) {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (error) {}
}

export async function getData(key: string) {
  let data: any = null;
  try {
    data = await AsyncStorage.getItem(key);
  } catch (error) {}
  return data;
}
