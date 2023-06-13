"use client";
import { createContext, useContext, useState } from "react";

const UserContext = createContext();

export function UserContextProvider({ children }) {
  const [userContext, setContextUser] = useState({});

  return (
    <UserContext.Provider value={{ userContext, setContextUser }}>
      {children}
    </UserContext.Provider>
  );
}

export default function useUserContext() {
  const context = useContext(UserContext);
  return context;
}
