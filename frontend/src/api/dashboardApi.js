import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL;

export const getDashboardFull = async () => {
  const res = await axios.get(`${API_BASE}/dashboard/full`);
  return res.data;
};
