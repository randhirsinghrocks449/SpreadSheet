import axios from "axios";
import { serverPath } from "./keys";

const getToken = () => localStorage.getItem("token");

export const axiosInstance = (useAuth = true) => {
  const token = getToken();
  return axios.create({
    baseURL: `${serverPath}/api`,
    headers: useAuth && token ? { Authorization: `Bearer ${token}` } : {},
  });
};
