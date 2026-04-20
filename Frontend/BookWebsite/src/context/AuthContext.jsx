import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

// Configure Axios globally to append cookies automatically bypassing LocalStorage
axios.defaults.withCredentials = true;

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if the secure HTTPOnly cookie is valid and loads the user role
    const verifySession = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/users/me');
        setUser(res.data.user);
      } catch (err) {
        setUser(null);
      }
      setLoading(false); // Finished checking
    };
    verifySession();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await axios.post('http://localhost:5000/api/users/login', { email, password });
      setUser(res.data.user);
      return { success: true, role: res.data.user.role };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Login Failed' };
    }
  };

  const register = async (name, email, password) => {
    try {
      const res = await axios.post('http://localhost:5000/api/users/register', { name, email, password });
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Registration Failed' };
    }
  };

  const googleLogin = async (credential) => {
    try {
      const res = await axios.post('http://localhost:5000/api/users/google-login', { token: credential });
      setUser(res.data.user);
      return { success: true, role: res.data.user.role };
    } catch (err) {
      return { success: false, message: 'Google Authentication Failed' };
    }
  };

  const logout = async () => {
    try {
      await axios.post('http://localhost:5000/api/users/logout');
      setUser(null);
    } catch (err) {
      console.error('Logout error', err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, googleLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
