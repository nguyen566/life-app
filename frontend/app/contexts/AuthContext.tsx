import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { SpinnerCustom } from "~/components/ui/spinner";
import api from "~/lib/api";

enum AuthCacheType {
  TOKEN = "auth_token",
}

interface AuthContextType {
  token?: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  login: async () => {},
  logout: async () => {},
});

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>();
  const navigate = useNavigate();

  useEffect(() => {
    const access_token = localStorage.getItem(AuthCacheType.TOKEN);
    if (access_token) {
      setToken(access_token);
      api.setSecurityData(access_token);
    } else {
      setToken(null);
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const { data } = await api.user.loginUserUserLoginPost({
        username: email,
        password,
      });

      if (data?.access_token) {
        setToken(data.access_token);
        api.setSecurityData(data.access_token);

        // Cache the token
        localStorage.setItem(AuthCacheType.TOKEN, data.access_token);

        toast.success("Login successful!");
        navigate("/dashboard");
      }
    } catch (e) {
      toast.error("Login failed. Please check your credentials and try again.");
    }
  };

  const logout = async () => {
    await api.user.logoutUserUserLogoutGet();
    setToken(null);
    api.setSecurityData(null);

    // Clear the cached token
    localStorage.removeItem(AuthCacheType.TOKEN);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {token === undefined ? <SpinnerCustom /> : children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider, type AuthCacheType, type AuthContextType };
