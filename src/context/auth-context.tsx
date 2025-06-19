// src/context/auth-context.tsx
"use client";

import React, { createContext, useContext, useState } from "react";
import { useToast } from "@/hooks/use-toast";

// Minimal User type if Firebase is removed
type MinimalUser = {
  displayName?: string | null;
  email?: string | null;
  photoURL?: string | null;
} | null;

interface AuthContextType {
  user: MinimalUser;
  loading: boolean;
  loginWithGoogle: () => Promise<void>; // Will be no-op
  logout: () => Promise<void>; // Will be no-op
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<MinimalUser>(null);
  const [loading, setLoading] = useState(false); // Default to false as no auth op
  const { toast } = useToast();

  const loginWithGoogle = async () => {
    toast({ variant: "destructive", title: "Login Not Available", description: "Firebase authentication has been removed. Please use the site's primary login method." });
  };

  const logout = async () => {
    toast({ variant: "destructive", title: "Logout Not Available", description: "Firebase authentication has been removed. Please use the site's primary logout method." });
  };

  return (
    <AuthContext.Provider value={{ user, loading, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
