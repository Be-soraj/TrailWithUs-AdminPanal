import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface AuthState {
  token: string;
  userInfo: any | null;
  isLoggedIn: boolean;
  loginUser: (token: string, userInfo: any) => void;
  logOut: () => void;
}

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      token: "",
      userInfo: null,
      isLoggedIn: false,
      loginUser: (token, userInfo) =>
        set({ isLoggedIn: true, token, userInfo }),
      logOut: () => {
        set({ isLoggedIn: false, token: "", userInfo: null });
        localStorage.removeItem("auth-access");
      },
    }),
    {
      name: "auth-access",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
