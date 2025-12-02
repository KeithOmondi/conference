import axios from "axios";

export default axios.create({
  baseURL: "https://conference1.onrender.com/api/v1",
  withCredentials: true,
});
