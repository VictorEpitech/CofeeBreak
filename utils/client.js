import axios, { Axios } from "axios";

const BASE_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:4000"
    : "https://cofee-break.vercel.app";

const client = new Axios({
  baseURL: BASE_URL,
  headers: {
    "content-type": "application/json",
  },
});

const login = async (data) => {
  return client.post("/auth/login", JSON.stringify(data));
};

export { client, login };
