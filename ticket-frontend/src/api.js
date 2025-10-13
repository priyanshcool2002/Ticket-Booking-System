import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE || "http://localhost:8080",
  headers: { "Content-Type": "application/json" },
  // optionally: timeout: 5000
});

// helper to unwrap .data and parse JSON string if backend returned a stringified JSON
const unwrap = (res) => {
  if (!res) return null;
  const payload = res.data;
  if (typeof payload === "string") {
    try {
      return JSON.parse(payload);
    } catch (e) {
      // if parsing fails, return raw string
      return payload;
    }
  }
  return payload;
};

export const getMovies = () => api.get("/movie/getMovies").then(unwrap);
export const getMovie = (id) => api.get(`/movie/getMovies/${id}`).then(unwrap);
export const registerUser = (data) => api.post("/user/addNew", data).then(unwrap);
export const bookTicket = (data) => api.post("/ticket/book", data).then(unwrap);

export default api;