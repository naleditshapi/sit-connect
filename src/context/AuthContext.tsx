import React, { createContext, ReactNode, useContext, useState } from "react";

export interface User {
  id: number;
  name: string;
  surname: string;
  username: string;
  email: string;
  role?: string;
  profileImage?: string | null;
}

type AuthContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => { },
  login: async (email: string, password: string) => { },
  logout: () => { },
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = (u: User) => setUser(u);

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, setUser, login: async (email: string, password: string) => { setUser({ id: 0, name: "", surname: "", username: "", email }) }, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
