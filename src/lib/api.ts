// lib/api.ts
import axios from "axios";
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const getLatestData = async () => {
  try {
    const r = await axios.get(`${API_URL}/data/latest`);
    return r.data;
  } catch (e) {
    console.error(e);
    return null;
  }
};

export const getHistory = async (limit = 50, page = 1) => {
  try {
    const r = await axios.get(
      `${API_URL}/data/history?limit=${limit}&page=${page}`
    );
    return r.data; // { page, limit, count, data: [...] }
  } catch (e) {
    console.error(e);
    return null;
  }
};
