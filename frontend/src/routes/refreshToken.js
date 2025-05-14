import axios from "axios";

// Create an axios instance with a base URL
const api = axios.create({
  baseURL: "http://localhost:3500",
  withCredentials: true, // Important for sending cookies with refresh tokens
});

// Function to refresh the access token
async function RefreshAccessToken(logout) {
  console.log("Refresh token function called");
  try {
    console.log("Refresh token function called in try block");
    const response = await api.get("/refresh", { withCredentials: true });
    console.log("Refresh token function called in try block after backend");
    const newToken = response.data.accessToken;
    const username = response.data.username;
    const roles = JSON.stringify(response.data.roles);
    console.log("Token refreshed:", newToken);
    return { newToken, username, roles }; // Return the new token for usage
  } catch (error) {
    console.error("Failed to refresh token:", error);
    if (error.response && error.response.status === 403) {
      console.log("Refresh token expired. Logging out.");
      logout();
      window.location.replace("/login");
    }
    throw error; // Ensure the error is handled correctly
  }
}

function setupInterceptors(logout) {
  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      if (
        originalRequest.url === "/LoginData" ||
        originalRequest.url === "/register"
      ) {
        return Promise.reject(error); // Don't attempt token refresh for login or registration
      }
      if (error.response) {
        if (error.response.status === 401) {
          console.log("401 Unauthorized - Redirecting to login...");
          await logout();
          window.location.replace("/login"); // Redirect to login page
          return Promise.reject(error);
        }

        if (error.response.status === 403 && !originalRequest._retry) {
          originalRequest._retry = true;
          console.log("Access token expired, attempting to refresh...");
          try {
            const { newToken, username, roles } = await RefreshAccessToken(
              logout
            ); // Get new token
            api.defaults.headers.common["Authorization"] = `Bearer ${newToken}`; // Set new token globally
            localStorage.setItem("token", newToken);
            localStorage.setItem("username", username);
            localStorage.setItem("roles", roles);
            originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
            console.log("New access token", newToken);
            return api(originalRequest); // Retry failed request
          } catch (refreshError) {
            console.error("Token refresh failed, logging out...");
            await logout();
            window.location.replace("/login");
            return Promise.reject(refreshError); // Reject if refresh fails
          }
        }
      }
      return Promise.reject(error);
    }
  );
}

export { api, RefreshAccessToken, setupInterceptors };
