import { useState, useContext } from "react";
import { AuthContext } from "./authContext";
import "../css/forgotPassword.css";

function ForgotPassword() {
  const [email, setEmail] = useState(null);
  const { forgotPassword } = useContext(AuthContext);
  const [message, setMessage] = useState("");

  async function handleForgotPassword(event, email) {
    event.preventDefault();
    console.log("Handle forgot password called");
    try {
      const response = await forgotPassword(email);
      if (response.status === 200) {
        setMessage("Password reset email sent to your registered email!");
      } else {
        setMessage(response.message);
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message;
      setMessage(errorMessage || "Reset Failed. Please try again.");
    }
  }

  return (
    <div className="forgotPass">
      <form onSubmit={(e) => handleForgotPassword(e, email)}>
        <div class="cardforgot">
          <div class="BGforgot">
            <svg
              viewBox="0 0 512 512"
              class="ionicon"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M256 176a80 80 0 1080 80 80.24 80.24 0 00-80-80zm172.72 80a165.53 165.53 0 01-1.64 22.34l48.69 38.12a11.59 11.59 0 012.63 14.78l-46.06 79.52a11.64 11.64 0 01-14.14 4.93l-57.25-23a176.56 176.56 0 01-38.82 22.67l-8.56 60.78a11.93 11.93 0 01-11.51 9.86h-92.12a12 12 0 01-11.51-9.53l-8.56-60.78A169.3 169.3 0 01151.05 393L93.8 416a11.64 11.64 0 01-14.14-4.92L33.6 331.57a11.59 11.59 0 012.63-14.78l48.69-38.12A174.58 174.58 0 0183.28 256a165.53 165.53 0 011.64-22.34l-48.69-38.12a11.59 11.59 0 01-2.63-14.78l46.06-79.52a11.64 11.64 0 0114.14-4.93l57.25 23a176.56 176.56 0 0138.82-22.67l8.56-60.78A11.93 11.93 0 01209.94 26h92.12a12 12 0 0111.51 9.53l8.56 60.78A169.3 169.3 0 01361 119l57.2-23a11.64 11.64 0 0114.14 4.92l46.06 79.52a11.59 11.59 0 01-2.63 14.78l-48.69 38.12a174.58 174.58 0 011.64 22.66z"></path>
            </svg>
          </div>
          <div class="contentforgot">
            <p class="headingforgot">Oops!</p>
            <p class="sub-headingforgot">Forgot Password?</p>
            <p class="sub-sub-headingforgot">Type your email to recover</p>
            <input
              class="emailforgot"
              placeholder="Email"
              type="text"
              required
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
            <button class="card-btnforgot" type="submit">
              Reset Password
            </button>
            {message && <p className="msgfp">{message}</p>}
          </div>
        </div>
      </form>
    </div>
  );
}

export default ForgotPassword;
