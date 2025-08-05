import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({children}) => {
  const [user, setUser] = useState(null);

  // Persist login in the localStorage
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('manthan-user'));
    if (storedUser) setUser(storedUser);
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('manthan-user', JSON.stringify(userData));
  }

  const logout = () => {
    setUser(null);
    localStorage.removeItem('manthan-user');
  }

  return (
    <AuthContext.Provider value={{user, login, logout}} >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);