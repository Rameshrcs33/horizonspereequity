import { db } from "@/config/firebaseAppConfig";
import { colors } from "@/constants/colors";
import { useAuth } from "@/context/AuthContext";
import { useIsFocused } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { equalTo, get, orderByChild, query, ref } from "firebase/database";
import { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { Button } from "react-native-paper";

export default function CandidateList() {
  const router: any = useRouter();
  const isFocused = useIsFocused();

  const [Users, setUsers] = useState<any>([]);
  const { saveuserID } = useAuth();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const usersRef = ref(db, "users");
      const usersQuery = query(usersRef, orderByChild("role"), equalTo("User"));

      const snapshot = await get(usersQuery);

      if (snapshot.exists()) {
        const data = snapshot.val();
        const formatted = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        setUsers(formatted);
      } else {
        setUsers([]);
      }
    } catch (error) {
      console.log("Error fetching users:", error);
    }
  };

  const handleCreateQuestion = (item: any) => {
    saveuserID(item?.id);
    router.push("/modal");
  };

  const renderItem = ({ item }: any) => (
    <View style={styles.card}>
      <View style={styles.info}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.email}>{item.email}</Text>
      </View>
      <Button
        mode="contained"
        onPress={() => handleCreateQuestion(item)}
        style={styles.button}
        labelStyle={{ color: colors.white }}
      >
        Create Question
      </Button>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Candidate List</Text>
      <View style={{ marginVertical: 5 }} />

      <FlatList
        data={Users}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
    color: colors.black,
  },
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: "#f9f9f9",
  },
  info: {
    flex: 1,
    marginRight: 10,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.black,
  },
  email: {
    fontSize: 14,
    color: "#555",
  },
  button: {
    borderRadius: 6,
  },
});
