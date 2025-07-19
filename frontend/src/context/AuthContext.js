import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Set auth token in axios headers
  const setAuthToken = (token) => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      localStorage.setItem("token", token);
    } else {
      delete axios.defaults.headers.common["Authorization"];
      localStorage.removeItem("token");
    }
  };

  // Register user
  const register = async (name, email, password) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post(`${process.env.BACKEND_URI}/api/auth/register`, {
        name,
        email,
        password,
      });
      setToken(res.data.token);
      setAuthToken(res.data.token);
      setUser(res.data.user);
      setIsAuthenticated(true);
      setLoading(false);
      return res.data;
    } catch (err) {
      setError(
        err.response?.data.message || "An error occurred during registration",
      );
      setLoading(false);
      throw err;
    }
  };

  // Login user
  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post(`${process.env.BACKEND_URI}/api/auth/login`, {
        email,
        password,
      });
      setToken(res.data.token);
      setAuthToken(res.data.token);
      setUser(res.data.user);
      setIsAuthenticated(true);
      setLoading(false);
      return res.data;
    } catch (err) {
      setError(err.response?.data.message || "Invalid credentials");
      setLoading(false);
      throw err;
    }
  };

  // Logout user
  const logout = () => {
    setAuthToken(null);
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  // Clear error messages
  const clearErrors = () => setError(null);

  // Load user
  const loadUser = async () => {
    if (token) {
      setAuthToken(token);
      try {
        setLoading(true);
        const res = await axios.get(`${process.env.BACKEND_URI}/api/auth/me`);
        setUser(res.data.user);
        setIsAuthenticated(true);
        setLoading(false);
      } catch (err) {
        setAuthToken(null);
        setToken(null);
        setUser(null);
        setIsAuthenticated(false);
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  };

  // Set token on initial load
  useEffect(() => {
    if (token) {
      setAuthToken(token);
      loadUser();
    } else {
      setLoading(false);
    }
    // eslint-disable-next-line
  }, []);

  return (
    <AuthContext.Provider
      value={{
        token,
        isAuthenticated,
        loading,
        user,
        error,
        register,
        login,
        logout,
        loadUser,
        clearErrors,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
