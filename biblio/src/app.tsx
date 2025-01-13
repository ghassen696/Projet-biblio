import 'src/global.css';

import { Router as AppRouter } from 'src/routes/sections';
import { useScrollToTop } from 'src/hooks/use-scroll-to-top';
import { ThemeProvider } from 'src/theme/theme-provider';
import { useState, useEffect, createContext, useContext, useMemo } from 'react';
import { Navigate } from 'react-router-dom';


interface AuthContextProps {
    token: string | null;
    role: string | null;
    setToken: (token: string | null) => void;
    setRole: (role: string | null) => void;
    logout: () => void;
  }
  
  const AuthContext = createContext<AuthContextProps>({
    token: localStorage.getItem('token'),
    role: localStorage.getItem('role'),
    setToken: () => {},
    setRole: () => {},
    logout: () => {}
  });

export const useAuth = () => useContext(AuthContext);
// ----------------------------------------------------------------------
function AuthProvider({ children }: { children: React.ReactNode }) {
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
    const [role, setRole] = useState<string | null>(localStorage.getItem('role'));
  
    const setTokenHandler = (newToken: string | null) => {
      setToken(newToken);
      if (newToken) {
        localStorage.setItem('token', newToken);
      } else {
        localStorage.removeItem('token');
      }
    };
    
    const setRoleHandler = (newRole: string | null) => {
        setRole(newRole);
        if (newRole) {
          localStorage.setItem('role', newRole);
        } else {
          localStorage.removeItem('role');
        }
      };
  
    const logout = () => {
      setTokenHandler(null);
      setRoleHandler(null);
    };
  
    const contextValue = useMemo(() => ({
        token,
        role,
      setToken: setTokenHandler,
      setRole: setRoleHandler,
      logout
    }), [token,role])

    return (
      <AuthContext.Provider
        value={contextValue}
      >
        {children}
      </AuthContext.Provider>
    );
  }

export default function App() {
  useScrollToTop();
    const { token } = useAuth();
    return (
    <ThemeProvider>
        <AuthProvider>
             {token ? <AppRouter /> : <Navigate to="/sign-in" />}
        </AuthProvider>
    </ThemeProvider>
   );
}