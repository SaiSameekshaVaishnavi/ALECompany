import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { FaUser, FaEnvelope, FaLock, FaUserPlus } from "react-icons/fa";
import { AuthContext } from "./authContext";
import "../css/register.css";

function Register() {
  const [user, setUser] = useState("");
  const [pwd, setPwd] = useState("");
  const [currPwd, setCurrPwd] = useState("");
  const [emailName, setEmailName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { register } = useContext(AuthContext);
  const [finalMessage, setFinalMessage] = useState("");

  function validateEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  }

  async function handleLogin(event) {
    event.preventDefault();
    setErrorMessage("");
    setFinalMessage("");

    if (!validateEmail(emailName)) {
      setErrorMessage("❌ Please enter a valid email.");
      return;
    }

    if (pwd !== currPwd) {
      setErrorMessage("❌ Passwords do not match!");
      return;
    }
    
    try {
      const response = await register(user, pwd, emailName);
      if (response.status === 201) {
        setFinalMessage("✅ Your account has been created successfully!");
      } else if (response.status === 409) {
        setFinalMessage(response.message);
      } else {
        setFinalMessage("⚠️ An error occurred. Please try again later.");
      }
    } catch (err) {
      const errMsg = err.response?.data?.message;
      setFinalMessage(errMsg || "❌ Registration Failed! Please Try Again");
    }
  }

  return (
    <div className="register">
      <div className="card">
        <a className="signup" href="/register">
          <FaUserPlus className="register-icon" /> Register
        </a>
        <form onSubmit={handleLogin} className="registerforms">
          <div className="inputBox1">
            <input
              type="text"
              required="required"
              value={emailName}
              onChange={(e) => setEmailName(e.target.value)}
            />
            <span className="user">
              {" "}
              <FaEnvelope className="icon" /> Email
            </span>
          </div>

          <div className="inputBox">
            <input
              type="text"
              required="required"
              value={user}
              onChange={(e) => setUser(e.target.value)}
            />
            <span>
              <FaUser className="icon" /> Username
            </span>
          </div>

          <div className="inputBox">
            <input
              type="password"
              required="required"
              value={pwd}
              onChange={(e) => setPwd(e.target.value)}
            />
            <span>
              <FaLock className="icon" /> Password
            </span>
          </div>
          <div className="inputBox iba">
            <input
              type="password"
              required="required"
              value={currPwd}
              onChange={(e) => setCurrPwd(e.target.value)}
            />
            <span>
              <FaLock className="icon" /> Confirm Password
            </span>
          </div>
          <div>
            <input type="checkbox" className="check" required="required" />
            <span>Accept Terms and Conditions</span>
          </div>

          {errorMessage && <p className="data-error">{errorMessage}</p>}

          <div className="divbtn">
            <button className="enter">Register</button>
          </div>

          <p>
            Already have an Account?{" "}
            <Link to="/LoginData">
              <i>Login</i>
            </Link>{" "}
          </p>
        </form>
      </div>
      <h3 className="successMsg">{finalMessage}</h3>
    </div>
  );
}
export default Register;
