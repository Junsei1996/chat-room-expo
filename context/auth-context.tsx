import {
    loginRequest,
    registerRequest,
    setAuthToken,
    User,
} from "@/services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

// Check if AsyncStorage is available
const isAsyncStorageAvailable = async (): Promise<boolean> => {
  try {
    await AsyncStorage.getItem("test");
    return true;
  } catch {
    return false;
  }
};

const TOKEN_KEY = "chatroom_token";
const USER_KEY = "chatroom_user";

type AuthContextValue = {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function restoreSession() {
      const asyncStorageAvailable = await isAsyncStorageAvailable();
      if (!asyncStorageAvailable) {
        console.warn(
          "AsyncStorage not available, skipping session restoration",
        );
        setLoading(false);
        return;
      }

      try {
        const storedToken = await AsyncStorage.getItem(TOKEN_KEY);
        const storedUser = await AsyncStorage.getItem(USER_KEY);

        if (storedToken) {
          setAuthToken(storedToken);
          setToken(storedToken);
        }

        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.warn("Failed to restore auth session:", error);
      } finally {
        setLoading(false);
      }
    }

    restoreSession();
  }, []);

  const login = async (email: string, password: string) => {
    console.log("Starting login for:", email);
    const { user: loggedUser, token: accessToken } = await loginRequest(
      email,
      password,
    );
    console.log("Login API response received");
    const asyncStorageAvailable = await isAsyncStorageAvailable();
    if (asyncStorageAvailable) {
      try {
        await AsyncStorage.setItem(TOKEN_KEY, accessToken);
        await AsyncStorage.setItem(USER_KEY, JSON.stringify(loggedUser));
        console.log("Auth data saved to AsyncStorage");
      } catch (error) {
        console.warn("Failed to save auth data:", error);
      }
    } else {
      console.warn("AsyncStorage not available, auth data not persisted");
    }
    setAuthToken(accessToken);
    setUser(loggedUser);
    setToken(accessToken);
    console.log("Login completed successfully");
  };

  const register = async (name: string, email: string, password: string) => {
    console.log("Starting registration for:", email);
    try {
      const result = await registerRequest(name, email, password);
      console.log("Registration API response:", result);
      const { user: createdUser, token: accessToken } = result;
      const asyncStorageAvailable = await isAsyncStorageAvailable();
      if (asyncStorageAvailable) {
        try {
          await AsyncStorage.setItem(TOKEN_KEY, accessToken);
          await AsyncStorage.setItem(USER_KEY, JSON.stringify(createdUser));
          console.log("Auth data saved to AsyncStorage");
        } catch (error) {
          console.warn("Failed to save auth data:", error);
        }
      } else {
        console.warn("AsyncStorage not available, auth data not persisted");
      }
      setAuthToken(accessToken);
      setUser(createdUser);
      setToken(accessToken);
      console.log("Registration completed successfully");
    } catch (error) {
      console.error("Registration failed:", error);
      throw error;
    }
  };

  const logout = async () => {
    const asyncStorageAvailable = await isAsyncStorageAvailable();
    if (asyncStorageAvailable) {
      try {
        await AsyncStorage.removeItem(TOKEN_KEY);
        await AsyncStorage.removeItem(USER_KEY);
      } catch (error) {
        console.warn("Failed to clear auth data:", error);
      }
    }
    setAuthToken(null);
    setUser(null);
    setToken(null);
  };

  const value = useMemo(
    () => ({ user, token, loading, login, register, logout }),
    [user, token, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
}
