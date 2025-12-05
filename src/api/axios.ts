import axios from "axios";

// Create an Axios instance
const api = axios.create({
baseURL: "http://localhost:5000/api/v1",
withCredentials: true, // include cookies automatically
headers: {
"Content-Type": "application/json",
},
});

// Optional: request interceptor to attach Authorization header from localStorage if available
api.interceptors.request.use((config) => {
const token = localStorage.getItem("token"); // fallback if cookie not used
if (token && config.headers) {
config.headers.Authorization = `Bearer ${token}`;
}
return config;
});

export default api;
