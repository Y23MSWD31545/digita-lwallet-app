import React, { createContext, useContext, useState, ReactNode } from "react";

interface UserData {
  fullName: string;
  username: string; // Used as a mock email identifier in this demo
}

interface UserContextType {
  user: UserData | null;
  setUser: (data: UserData) => void;
  clearUser: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize state from local storage for persistence
  const [user, setUserState] = useState<UserData | null>(() => {
    const savedUser = localStorage.getItem("appUser");
    try {
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (e) {
      console.error("Could not parse user data from localStorage:", e);
      return null;
    }
  });

  const setUser = (data: UserData) => {
    setUserState(data);
    localStorage.setItem("appUser", JSON.stringify(data));
  };

  const clearUser = () => {
    setUserState(null);
    localStorage.removeItem("appUser");
  };

  return (
    <UserContext.Provider value={{ user, setUser, clearUser }}>
      {children}
    </UserContext.Provider>
  );
};
