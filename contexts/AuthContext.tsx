// contexts/AuthContext.tsx
"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { api2 } from "@/lib/api";

export type User = {
  id: number;
  name: string;
  email: string;
  course: string | null;
  batch: number | null;
  course_id: number | null;
  qr_code_path: string | null;
  profile_path: string | null;
};

type AuthContextType = {
  user: User | null;
  setUser: (user: User | null) => void;  // expose setter to update user externally
  login: (user: User, token: string) => void;
  logout: () => void;
};


const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  const login = (user: User, token: string) => {
    setUser(user);
    console.log(token);
  };

  const logout = async () => {
  setUser(null);

    // Try ALUMNI logout first
    try {
      const res = await api2.post("/api/logout", {}, { withCredentials: true });
      if (res.status === 200) {
        console.log("Logged out successfully");
        router.push("/login");
      }
    } catch (err) {
      console.log("Logout failed:", err.response?.status);

      // Try ADMIN logout next
      try {
        const res2 = await api2.post("/api/admin-logout", {}, { withCredentials: true });
        if (res2.status === 200) {
          console.log("Admin Logged out successfully");
          router.push("/login");
        }
      } catch (err2) {
        console.log("Admin Logout failed:", err2.response?.status);
      }
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
