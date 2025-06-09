import React, { useEffect, useState, createContext, useContext } from 'react';
interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
}
interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);
export function AuthProvider({
  children
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    // Check for stored auth token
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);
  const login = async (email: string, password: string) => {
    // In a real app, this would make an API call
    // Mock authentication
    if (email === 'admin@example.com' && password === 'password') {
      const user = {
        id: '1',
        email,
        name: 'Admin User',
        role: 'admin' as const
      };
      setUser(user);
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      throw new Error('Invalid credentials');
    }
  };
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };
  return <AuthContext.Provider value={{
    user,
    login,
    logout,
    isLoading
  }}>
      {children}
    </AuthContext.Provider>;
}
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}