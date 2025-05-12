import { createContext, ReactNode, useContext } from "react";
import {
  useQuery,
  useMutation,
  UseMutationResult,
} from "..tanstack/react-query";
import { insertUserSchema, User as SelectUser, InsertUser } from "..shared/schema";
import { getQueryFn, apiRequest, queryClient } from "@lib/queryClient";
import { useToast } from "@hooks/use-toast";

const baseURL = import.meta.env.VITE_API_BASE_URL;

type AuthContextType = {
  user: SelectUser | null;
  isLoading: boolean;
  error: Error | null;
  loginMutation: UseMutationResult<SelectUser, Error, LoginData>;
  logoutMutation: UseMutationResult<void, Error, void>;
  registerMutation: UseMutationResult<SelectUser, Error, InsertUser>;
};

type LoginData = Pick<InsertUser, "username" | "password">;

export const AuthContext = createContext<AuthContextType | null>(null);
export function AuthProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const {
    data: user,
    error,
    isLoading,
  } = useQuery<SelectUser | undefined, Error>({
    queryKey: ["https://oplayeni.onrender.com/api/user"],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });

  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginData) => {
      try {
        const res = await fetch(`https://oplayeni.onrender.com/api/login`, {  
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          body: JSON.stringify(credentials),
          credentials: "include"
        });

        console.log("[Auth] Login response:", res);

        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || "Invalid credentials");
        }

        const data = await res.json();
        console.log("[Auth] Login data:", data);
        return data;
      } catch (error: any) {
        console.error("[Auth] Login error:", error);
        throw new Error(error.message || "Login failed");
      }
    },
    onSuccess: (user: SelectUser) => {
      queryClient.setQueryData(["https://oplayeni.onrender.com/api/user"], user);
    },
    onError: (error: Error) => {
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (credentials: InsertUser) => {
      const res = await apiRequest("POST", "https://oplayeni.onrender.com/api/register", credentials);
      return await res.json();
    },
    onSuccess: (user: SelectUser) => {
      queryClient.setQueryData(["https://oplayeni.onrender.com/api/user"], user);
    },
    onError: (error: Error) => {
      toast({
        title: "Registration failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "https://oplayeni.onrender.com/api/logout");
    },
    onSuccess: () => {
      queryClient.setQueryData(["https://oplayeni.onrender.com/api/user"], null);
    },
    onError: (error: Error) => {
      toast({
        title: "Logout failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return (
    <AuthContext.Provider
      value={{
        user: user ?? null,
        isLoading,
        error,
        loginMutation,
        logoutMutation,
        registerMutation,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
