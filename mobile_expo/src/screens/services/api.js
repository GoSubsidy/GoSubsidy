import axios from "axios";

// 👉 Change this to your backend URL
const BASE_URL = "https://your-api-url.com";

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000, // 10 seconds
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

/* ==============================
   REQUEST INTERCEPTOR
================================ */
api.interceptors.request.use(
  async config => {
    // Example: attach token if you use authentication
    // const token = await AsyncStorage.getItem("token");
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }

    return config;
  },
  error => Promise.reject(error)
);

/* ==============================
   RESPONSE INTERCEPTOR
================================ */
api.interceptors.response.use(
  response => response.data,
  error => {
    if (error.response) {
      console.log("API Error:", error.response.data);
    } else if (error.request) {
      console.log("Network Error: No response from server");
    } else {
      console.log("Error:", error.message);
    }
    return Promise.reject(error);
  }
);

export default api;
