import { createContext, useContext, useState, useEffect } from "react";

const API_URL = "http://127.0.0.1:8000";

interface AuthContextType {
  token: string | null;
  user: any;
  authLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (data: any) => Promise<void>;
  updateProfile: (data: { full_name: string; email: string }) => Promise<void>;
  changePassword: (oldPassword: string, newPassword: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("access_token")
  );
  const [user, setUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);

  /* ---------------- LOAD CURRENT USER ---------------- */
  useEffect(() => {
    if (!token) {
      setAuthLoading(false);
      return;
    }

    fetch(`${API_URL}/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => {
        if (!res.ok) throw new Error("Unauthorized");
        return res.json();
      })
      .then(data => setUser(data))
      .catch(() => logout())
      .finally(() => setAuthLoading(false));
  }, [token]);

  /* ---------------- LOGIN ---------------- */
  const login = async (email: string, password: string) => {
    const res = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) throw new Error("Login failed");

    const data = await res.json();
    localStorage.setItem("access_token", data.access_token);
    setToken(data.access_token);
  };

  /* ---------------- SIGNUP ---------------- */
  const signup = async (data: any) => {
    const res = await fetch(`${API_URL}/registration`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        full_name: data.full_name,
        email: data.email,
        password: data.password,
      }),
    });

    if (!res.ok) throw new Error("Signup failed");
  };

  /* ---------------- UPDATE PROFILE ---------------- */
  const updateProfile = async (data: {
    full_name: string;
    email: string;
  }) => {
    const res = await fetch(`${API_URL}/update`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error("Profile update failed");

    const updatedUser = await res.json();
    setUser(updatedUser);
  };

  /* ---------------- CHANGE PASSWORD ---------------- */
  const changePassword = async (
    oldPassword: string,
    newPassword: string
  ) => {
    const res = await fetch(`${API_URL}/updatePass`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        old_password: oldPassword,
        new_password: newPassword,
      }),
    });

    if (!res.ok) throw new Error("Password change failed");
  };

  /* ---------------- LOGOUT ---------------- */
  const logout = () => {
    localStorage.removeItem("access_token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        authLoading,
        login,
        signup,
        updateProfile,
        changePassword,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
