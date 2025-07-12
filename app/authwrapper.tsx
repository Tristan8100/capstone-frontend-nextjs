// app/AuthProviderWrapper.tsx
//idk why need this for auth context to work, but it does
"use client";

import { ReactNode } from "react";
import { AuthProvider } from "../contexts/AuthContext";

export default function AuthProviderWrapper({ children }: { children: ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}