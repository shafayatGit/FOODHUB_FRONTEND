"use client";

import { createContext, useContext } from "react";
import type { UserInfo } from "@/types/user.types";

interface UserContextValue {
  userInfo: UserInfo | null;
}

const UserContext = createContext<UserContextValue | null>(null);

export function UserProvider({
  children,
  userInfo,
}: {
  children: React.ReactNode;
  userInfo: UserInfo | null;
}) {
  return (
    <UserContext.Provider value={{ userInfo }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);

  if (context === null) {
    throw new Error("useUser must be used within UserProvider");
  }

  return context;
}
