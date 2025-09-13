import { createContext, ReactNode, useContext, useState } from "react";

type AuthContextType = {
  UserID: any | null;
  saveuserID: (val: any) => void;
  clearuserID: () => void;
  UserName: string | null;
  saveuserName: (val: string) => void;
  clearuserName: () => void;
};

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [UserID, setUserID] = useState<any | null>(null);
  const [UserName, setUserName] = useState<string | null>(null);

  const saveuserID = (val: any) => {
    setUserID(val);
  };

  const clearuserID = () => {
    setUserID(null);
  };

  const saveuserName = (val: string) => {
    setUserName(val);
  };

  const clearuserName = () => {
    setUserName(null);
  };

  const initialState = {
    UserID,
    saveuserID,
    clearuserID,
    UserName,
    saveuserName,
    clearuserName,
  };

  return (
    <AuthContext.Provider value={initialState}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
