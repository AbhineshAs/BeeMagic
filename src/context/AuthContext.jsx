import { createContext, useContext, useState, useEffect } from 'react';
import API_URL from '../config/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('bee_magic_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = async (email, password, name = '', address = '', phoneNumber = '', provider = null) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name, address, phoneNumber, provider })
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }
      const userData = await response.json();
      setUser(userData);
      localStorage.setItem('bee_magic_user', JSON.stringify(userData));
      return userData;
    } catch (err) {
      throw err;
    }
  };

  const register = async (name, address, email, phoneNumber, password, otp) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, address, email, phoneNumber, password, otp })
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
      }
      const userData = await response.json();
      setUser(userData);
      localStorage.setItem('bee_magic_user', JSON.stringify(userData));
      return userData;
    } catch (err) {
      throw err;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('bee_magic_user');
  };

  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'ADMIN';

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAuthenticated, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
