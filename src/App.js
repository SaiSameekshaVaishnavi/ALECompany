import React, { useContext, useEffect } from "react";
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
  useEffect(() => {
    setupInterceptors(logout); // Pass logout to interceptors
  }, [logout]);

  useEffect(() => {
    initializeApp(logout);
  }, []);

  async function initializeApp(logout) {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.log("No token found, refreshing...");
        setupInterceptors(logout);
      }
    } catch (error) {
      console.error("Failed to initialize token:", error);
      logout();
      <Navigate to="/LoginData" replace />;
    }
  }

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
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
