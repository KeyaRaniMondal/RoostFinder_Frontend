// "use client";

// import {
//   createContext,
//   useCallback,
//   useContext,
//   useEffect,
//   useMemo,
//   useRef,
//   useState,
//   ReactNode,
// } from "react";
// import { useRouter } from "next/navigation";
// import { signOut, useSession } from "next-auth/react";
// import { toast } from "sonner";
// import { api } from "@/lib/api";
// import {
//   clearAuth,
//   getAccessToken,
//   getStoredUser,
//   parseAuthToken,
//   persistAuth,
//   writeAuthCookie,
// } from "@/lib/token";
// import { DASHBOARD_ROLE_BASE_URL } from "@/lib/constants";
// import { AuthTokens, JwtPayload, User } from "@/types";

// interface AuthContextValue {
//   user: JwtPayload | null;
//   me: User | null;
//   token: string | null;
//   status: "loading" | "authenticated" | "unauthenticated";
//   login: (email: string, password: string) => Promise<JwtPayload>;
//   register: (payload: RegisterPayload) => Promise<JwtPayload>;
//   logout: () => void;
//   setMe: (user: User) => void;
// }

// interface RegisterPayload {
//   name: string;
//   email: string;
//   password: string;
//   role: string;
//   profilePhoto?: string;
// }

// const AuthContext = createContext<AuthContextValue | null>(null);

// export function AuthProvider({ children }: { children: ReactNode }) {
//   const router = useRouter();
//   const { data: session, status: sessionStatus } = useSession();
//   const [user, setUser] = useState<JwtPayload | null>(null);
//   const [me, setMeState] = useState<User | null>(null);
//   const [token, setToken] = useState<string | null>(null);
//   const [status, setStatus] = useState<AuthContextValue["status"]>("loading");

//   useEffect(() => {
//     const stored = getAccessToken();
//     const parsed = stored ? parseAuthToken(stored) : null;
//     const cached = getStoredUser();

//     if (stored && (parsed || cached)) {
//       setToken(stored);
//       setUser(parsed ?? cached);
//       setStatus("authenticated");
//       writeAuthCookie(stored);
//       refreshMe(stored);
//     } else {
//       clearAuth();
//       setStatus("unauthenticated");
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   const refreshMe = useCallback(async (accessToken?: string | null) => {
//     try {
//       const { profile } = await api.get<{ profile: User }>("/api/auth/me");
//       setMeState(profile);
//     } catch {
//       const current = getAccessToken();
//       const parsed = current ? parseAuthToken(current) : null;
//       if (!parsed) {
//         clearAuth();
//         setUser(null);
//         setMeState(null);
//         setToken(null);
//         setStatus("unauthenticated");
//       }
//     }
//   }, []);

//   // Bridge a fresh NextAuth (Google) session into the backend JWT auth system.
//   const exchangingGoogle = useRef(false);

//   useEffect(() => {
//     if (sessionStatus !== "authenticated") return;
//     const sessionUser = session?.user;
//     if (!sessionUser?.email) return;
//     if (getAccessToken()) return; // already authenticated with a backend token
//     if (exchangingGoogle.current) return;
//     exchangingGoogle.current = true;

//     (async () => {
//       try {
//         const tokens = await api.post<AuthTokens>("/api/auth/google", {
//           name: sessionUser.name ?? undefined,
//           email: sessionUser.email,
//           emailVerified: true,
//           image: sessionUser.image ?? undefined,
//         });
//         applyAuth(tokens);
//         toast.success("Welcome to RoostFinder!");
//         const payload = parseAuthToken(tokens.accessToken);
//         router.push(DASHBOARD_ROLE_BASE_URL[payload?.role ?? "Tenant"]);
//       } catch (error) {
//         clearAuth();
//         setUser(null);
//         setMeState(null);
//         setToken(null);
//         setStatus("unauthenticated");
//         toast.error((error as Error).message || "Google sign-in failed");
//       } finally {
//         // The backend JWT (localStorage + rf_token cookie) is now the single
//         // source of truth, so drop the one-time NextAuth session.
//         await signOut({ redirect: false });
//         exchangingGoogle.current = false;
//       }
//     })();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [sessionStatus, session]);

//   const applyAuth = useCallback((tokens: AuthTokens) => {
//     const payload = parseAuthToken(tokens.accessToken);
//     if (!payload) throw new Error("Invalid authentication response");
//     persistAuth(tokens, payload);
//     setToken(tokens.accessToken);
//     setUser(payload);
//     setStatus("authenticated");
//     refreshMe(tokens.accessToken);
//   }, [refreshMe]);

//   const login = useCallback(
//     async (email: string, password: string) => {
//       const tokens = await api.post<AuthTokens>("/api/auth/login", { email, password });
//       applyAuth(tokens);
//       return parseAuthToken(tokens.accessToken) as JwtPayload;
//     },
//     [applyAuth]
//   );

//   const register = useCallback(
//     async (payload: RegisterPayload) => {
//       await api.post("/api/auth/register", payload);
//       const tokens = await api.post<AuthTokens>("/api/auth/login", {
//         email: payload.email,
//         password: payload.password,
//       });
//       applyAuth(tokens);
//       return parseAuthToken(tokens.accessToken) as JwtPayload;
//     },
//     [applyAuth]
//   );

//   const logout = useCallback(() => {
//     clearAuth();
//     setUser(null);
//     setMeState(null);
//     setToken(null);
//     setStatus("unauthenticated");
//     signOut({ redirect: false });
//     router.push("/");
//   }, [router]);

//   const setMe = useCallback((next: User) => setMeState(next), []);

//   const value = useMemo(
//     () => ({ user, me, token, status, login, register, logout, setMe }),
//     [user, me, token, status, login, register, logout, setMe]
//   );

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// }

// export function useAuth() {
//   const ctx = useContext(AuthContext);
//   if (!ctx) throw new Error("useAuth must be used within AuthProvider");
//   return ctx;
// }
"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import {
  clearAuth,
  getAccessToken,
  getStoredUser,
  isClient,
  parseAuthToken,
  persistAuth,
  writeAuthCookie,
  USER_KEY,
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
  updateProfile: (payload: UpdateProfilePayload) => Promise<User>;
}

interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role: string;
  profilePhoto?: string;
}

export interface UpdateProfilePayload {
  name?: string;
  email?: string;
  profilePhoto?: string;
  bio?: string;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const PROFILE_ENDPOINTS = ["/api/auth/me"];

function normalizeProfile(payload: unknown): User | null {
  if (!payload || typeof payload !== "object") return null;

  const record = payload as Record<string, unknown>;
  const candidate = record.profile ?? record.user ?? record.me ?? payload;

  if (!candidate || typeof candidate !== "object") return null;

  const profile = candidate as Partial<User>;
  const hasIdentity = typeof profile.id === "string" && (typeof profile.name === "string" || typeof profile.email === "string");

  return hasIdentity ? (profile as User) : null;
}

async function fetchCurrentProfile() {
  const errors: unknown[] = [];

  for (const path of PROFILE_ENDPOINTS) {
    try {
      const payload = await api.get<unknown>(path);
      const profile = normalizeProfile(payload);
      if (profile) return profile;
    } catch (error) {
      errors.push(error);
    }
  }

  throw errors.at(-1) instanceof Error
    ? errors.at(-1)
    : new Error("Could not load profile");
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<JwtPayload | null>(null);
  const [me, setMeState] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [status, setStatus] = useState<AuthContextValue["status"]>("loading");

  const refreshMe = useCallback(async () => {
    try {
      const profile = await fetchCurrentProfile();
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

  useEffect(() => {
    const stored = getAccessToken();
    const parsed = stored ? parseAuthToken(stored) : null;
    const cached = getStoredUser();

    if (stored && (parsed || cached)) {
      queueMicrotask(() => {
        setToken(stored);
        setUser(parsed ?? cached);
        setStatus("authenticated");
        writeAuthCookie(stored);
        void refreshMe();
      });
    } else {
      clearAuth();
      setStatus("unauthenticated");
    }
  }, [refreshMe]);

  const applyAuth = useCallback((tokens: AuthTokens) => {
    const payload = parseAuthToken(tokens.accessToken);
    if (!payload) throw new Error("Invalid authentication response");
    persistAuth(tokens, payload);
    setToken(tokens.accessToken);
    setUser(payload);
    setStatus("authenticated");
    refreshMe();
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

  const updateProfile = useCallback(
    async (payload: UpdateProfilePayload) => {
      const response = await api.patch<unknown>("/api/auth/me", payload);
      let profile = normalizeProfile(response);

      if (!profile) {
        profile = await fetchCurrentProfile();
      }

      if (!profile) {
        throw new Error('Could not update profile');
      }

      setMeState(profile);
      if (profile.name) {
        const nextUser = {
          ...(user ?? {}),
          id: user?.id ?? profile.id,
          name: profile.name,
          email: profile.email ?? user?.email,
          role: user?.role ?? profile.role,
        } as JwtPayload;
        setUser(nextUser);
        if (isClient()) {
          window.localStorage.setItem(USER_KEY, JSON.stringify(nextUser));
        }
      }
      return profile;
    },
    [user]
  );

  const value = useMemo(
    () => ({ user, me, token, status, login, register, logout, setMe, updateProfile }),
    [user, me, token, status, login, register, logout, setMe, updateProfile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
