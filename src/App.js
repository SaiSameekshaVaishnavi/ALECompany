import React, { useContext, useEffect, useCallback } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Register from "./routes/register";
import LoginData from "./routes/loginData";
import MainPage from "./routes/mainPage";
import Navbar from "./components/Navsbar";
import Contact from "./routes/contact";
import { AuthContext } from "./routes/authContext";
import { setupInterceptors } from "./routes/refreshToken";
import ForgotPassword from "./routes/forgotPassword";
import ResetPassword from "./routes/resetPassword";
import "./app.css";

function App() {
  const { logout } = useContext(AuthContext); // This is valid inside a component

  const handleLogout = useCallback(() => {
    logout();
  }, [logout]);

  useEffect(() => {
    setupInterceptors(handleLogout); // Pass logout to interceptors
  }, [handleLogout]);

  const initializeApp = useCallback(() => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.log("No token found, refreshing...");
        setupInterceptors(handleLogout);
      }
    } catch (error) {
      console.error("Failed to initialize token:", error);
      handleLogout();
      window.location.href = "/LoginData";
    }
  }, [handleLogout]);

  useEffect(() => {
    initializeApp();
  }, [initializeApp]);

  return (
    <div>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/LoginData" element={<LoginData />} />
          <Route path="/register" element={<Register />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/forgotPassword" element={<ForgotPassword />} />
          <Route path="/resetPassword" element={<ResetPassword />} />
          <Route path="*" element={<Navigate to="/" replace={true} />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
