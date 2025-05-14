import React, { createContext, useState, useEffect } from "react";
import { api } from "./refreshToken";
import Employees from "./employees";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [isLoggedIn, setIsLoggedIn] = useState(null);
  const [showComponent, setShowComponent] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isLoggedIn) setShowComponent(true);
    }, 5000);
    return () => clearTimeout(timer);
  }, [isLoggedIn]);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    console.log("Retrieved token from localStorage:", savedToken); // Debug

    if (savedToken) {
      setToken(savedToken);
      setIsLoggedIn(true);
      api.defaults.headers.common["Authorization"] = `Bearer ${savedToken}`;
    }
  }, []);

  const register = async (username, password, email) => {
    try {
      const response = await api.post("/register", {
        user: username,
        pwd: password,
        email: email,
      });
      return response;
    } catch (err) {
      return err.response?.data || { status: 500, message: "Registration failed" };
    }
  };

  const login = async (username, password) => {
    try {
      const response = await api.post("/auth", {
        user: username,
        pwd: password,
      });
      console.log("Login API Response:", response); // Debugging response
      console.log("Response Data:", response.data); // Debugging response data
      if (response.status === 200) {
        const accessToken = response.data.accessToken;
        console.log("Access Token Received:", accessToken);

        if (!accessToken || typeof accessToken !== "string") {
          console.error(
            "Access token is missing or not a string:",
            accessToken
          );
          return;
        }
        setToken(accessToken);
        localStorage.setItem("token", accessToken);
        localStorage.setItem("username", response.data.username);
        localStorage.setItem("roles", JSON.stringify(response.data.roles));
        api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
      return response;
    } catch (err) {
      console.error("Login error:", err);
      console.error("Error response:", err.response?.data);
      setIsLoggedIn(false);
      return err.response?.data || { status: 500, message: "Login failed" };
    }
  };

  const logout = async () => {
    try {
      console.log("Logout in frontend authcontext function called");
      await api.post("/logout", {}, { withCredentials: true }); // Call the backend to remove refreshToken
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      // Clear tokens from frontend
      console.log("Logout in finally authcontext function called");
      localStorage.removeItem("token");
      localStorage.removeItem("roles");
      localStorage.removeItem("username");
      delete api.defaults.headers.common["Authorization"];
      console.log("Logout in replace authcontext function called");
      window.location.replace("/"); // Redirect user after logout
    }
  };

  const forgotPassword = async (mail) => {
    try {
      console.log("Mail sent is", mail);
      const response = await api.post("/forgotPassword", {
        email: mail,
      });
      console.log("Handle forgot password returned from backend");
      return response;
    } catch (err) {
      return (
        err.response?.data || {
          status: 500,
          message: "Reset Mail initiation failed",
        }
      );
    }
  };

  const resetPassword = async (token, newPassword) => {
    try {
      const response = await api.post("/resetPassword", {
        token: token,
        newPassword: newPassword,
      });
      return response;
    } catch (err) {
      return (
        err.response?.data || { status: 500, message: "Password Change failed" }
      );
    }
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        login,
        register,
        logout,
        forgotPassword,
        resetPassword,
      }}
    >
      {isLoggedIn && showComponent ? <Employees /> : children}
    </AuthContext.Provider>
  );
};
