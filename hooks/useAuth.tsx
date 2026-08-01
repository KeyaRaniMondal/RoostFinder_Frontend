"use client";

import {
  createContext, useCallback, useContext, useEffect, useMemo, useState, ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import {
  clearAuth, getAccessToken, getStoredUser, parseAuthToken, persistAuth, writeAuthCookie,
} from "@/lib/token";
import { AuthTokens, JwtPayload, User } from "@/types";

interface AuthContextValue {
  user: JwtPayload | null;
  me: User | null;
  token: string | null;
  status: "loading" | "authenticated" | "unauthenticated";
  login: (email: string, password: string) => Promise<JwtPayload>;
  register: (payload: RegisterPayload) => Promise<JwtPayload>;
  logout: () => void;
  setMe: (user: User) => void;
}

interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role: string;
  profilePhoto?: string;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<JwtPayload | null>(null);
  const [me, setMeState] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [status, setStatus] = useState<AuthContextValue["status"]>("loading");

  useEffect(() => {
    const stored = getAccessToken();
    const parsed = stored ? parseAuthToken(stored) : null;
    const cached = getStoredUser();

    if (stored && (parsed || cached)) {
      setToken(stored);
      setUser(parsed ?? cached);
      setStatus("authenticated");
      writeAuthCookie(stored);
      refreshMe(stored);
    } else {
      clearAuth();
      setStatus("unauthenticated");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const refreshMe = useCallback(async (accessToken?: string | null) => {
    try {
      const { profile } = await api.get<{ profile: User }>("/api/auth/me");
      setMeState(profile);
    } catch {
      const current = getAccessToken();
      const parsed = current ? parseAuthToken(current) : null;
      if (!parsed) {
        clearAuth();
        setUser(null);
        setMeState(null);
        setToken(null);
        setStatus("unauthenticated");
      }
    }
  }, []);

  const applyAuth = useCallback((tokens: AuthTokens) => {
    const payload = parseAuthToken(tokens.accessToken);
    if (!payload) throw new Error("Invalid authentication response");
    persistAuth(tokens, payload);
    setToken(tokens.accessToken);
    setUser(payload);
    setStatus("authenticated");
    refreshMe(tokens.accessToken);
  }, [refreshMe]);

  const login = useCallback(
    async (email: string, password: string) => {
      const tokens = await api.post<AuthTokens>("/api/auth/login", { email, password });
      applyAuth(tokens);
      return parseAuthToken(tokens.accessToken) as JwtPayload;
    },
    [applyAuth]
  );

  const register = useCallback(
    async (payload: RegisterPayload) => {
      await api.post("/api/auth/register", payload);
      const tokens = await api.post<AuthTokens>("/api/auth/login", {
        email: payload.email,
        password: payload.password,
      });
      applyAuth(tokens);
      return parseAuthToken(tokens.accessToken) as JwtPayload;
    },
    [applyAuth]
  );

  const logout = useCallback(() => {
    clearAuth();
    setUser(null);
    setMeState(null);
    setToken(null);
    setStatus("unauthenticated");
    router.push("/");
  }, [router]);

  const setMe = useCallback((next: User) => setMeState(next), []);

  const value = useMemo(
    () => ({ user, me, token, status, login, register, logout, setMe }),
    [user, me, token, status, login, register, logout, setMe]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
