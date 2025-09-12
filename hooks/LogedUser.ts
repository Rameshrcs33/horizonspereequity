import { auth } from "@/config/firebaseAppConfig";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";

export function LogedUser() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });
    return unsubscribe;
  }, []);

  return { user };
}
