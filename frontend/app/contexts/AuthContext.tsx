import axios from "axios";
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
    const initializeAuth = async () => {
      try {
        const access_token = localStorage.getItem(AuthCacheType.TOKEN);
        if (!access_token) {
          setToken(null);
          return;
        }

        api.setSecurityData(access_token);

        // Validate token - if invalid, clear it
        const { data } = await api.user.validateTokenUserValidateTokenGet({
          token: access_token,
        });

        if (data?.valid) {
          setToken(access_token);
        } else {
          localStorage.removeItem(AuthCacheType.TOKEN);
          setToken(null);
        }
      } catch {
        setToken(null);
      }
    };

    initializeAuth();
  }, []);

  useEffect(() => {
    if (token === null) {
      logout();
    }
  }, [token]);

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
        navigate("/");
      }
    } catch (e) {
      if (axios.isAxiosError(e) && e?.response?.data?.detail) {
        toast.error(e.response.data.detail);
        return;
      }

      toast.error("Login failed. Please check your credentials and try again.");
    }
  };

  const logout = async () => {
    try {
      // Attempt to log user out but if cannot, we need to remove cache
      await api.user.logoutUserUserLogoutGet();
    } finally {
      setToken(null);
      api.setSecurityData(null);

      // Clear the cached token
      localStorage.removeItem(AuthCacheType.TOKEN);
      navigate("/login");
    }
    // await api.user.logoutUserUserLogoutGet();
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
