import { createContext, ReactNode, useContext, useState } from "react";

type AuthContextType = {
  UserID: any | null;
  saveuserID: (val: any) => void;
  clearuserID: () => void;
};

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [UserID, setUserID] = useState<any | null>(null);

  const saveuserID = (val: any) => {
    setUserID(val);
  };

  const clearuserID = () => {
    setUserID(null);
  };

  return (
    <AuthContext.Provider value={{ UserID, saveuserID, clearuserID }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
