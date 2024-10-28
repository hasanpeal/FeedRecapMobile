import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

// Create the AuthContext
const AuthContext = createContext();
const router = useRouter(); // Initialize router

// Custom hook to use AuthContext
export const useAuth = () => useContext(AuthContext);

// Provider component
export const AuthProvider = ({ children }) => {
  const [mail, setMail] = useState(null);
  const [loading, setLoading] = useState(true);

  // Function to load email from AsyncStorage
  const loadEmail = async () => {
    try {
      const storedEmail = await AsyncStorage.getItem("userEmail");
      if (storedEmail) {
        setMail(storedEmail);
      }
    } catch (error) {
      console.error("Failed to load email from storage", error);
    } finally {
      setLoading(false);
    }
  };

  // Call loadEmail on mount to retrieve stored session
  useEffect(() => {
    loadEmail();
  }, []);

  // Function to log in (store email in both state and AsyncStorage)
  const login = async (userEmail) => {
    try {
      await AsyncStorage.setItem("userEmail", userEmail);
      setMail(userEmail);
    } catch (error) {
      console.error("Failed to store email", error);
    }
  };

  // Function to log out (clear email from state and AsyncStorage)
  const logout = async () => {
    try {
      await AsyncStorage.removeItem("userEmail");
      setMail(null);
      router.navigate("/");
    } catch (error) {
      console.error("Failed to remove email", error);
    }
  };

  return (
    <AuthContext.Provider value={{ mail, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
