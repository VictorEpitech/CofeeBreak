import { Axios } from "axios";

const BASE_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:4000"
    : "https://cofeebreakapi-production.up.railway.app";

const client = new Axios({
  baseURL: BASE_URL,
  headers: {
    "content-type": "application/json",
  },
});

const login = async (data) => {
  return client.post("/auth/login", JSON.stringify(data));
};

const verify = async (token) => {
  return client.get("/auth/verify", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("coffee-token")}`,
    },
  });
};

const getCharges = async () => {
  return client.get("/charges", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("coffee-token")}`,
    },
  });
};

const getPaymentMethods = async () => {
  return client.get("/payments", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("coffee-token")}`,
    },
  });
};

const recharge = async (id, charges) => {
  return client.put(`/charges/${id}`, JSON.stringify({ charges }), {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("coffee-token")}`,
    },
  });
};

const getFunds = async () => {
  return client.get("/funds", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("coffee-token")}`,
    },
  });
};

const addFunds = async (date, amount, payment_method, reason = null) => {
  return client.post(
    "/funds",
    JSON.stringify({ date, amount, reason, payment_method }),
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("coffee-token")}`,
      },
    }
  );
};

const deleteFunds = async (id) => {
  return client.delete(`/funds/${id}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("coffee-token")}`,
    },
  });
};

const getConsumed = async () => {
  return client.get("/consumed", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("coffee-token")}`,
    },
  });
};

const createConsumed = async (data) => {
  return client.post("/consumed", JSON.stringify(data), {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("coffee-token")}`,
    },
  });
};

export {
  client,
  login,
  verify,
  getCharges,
  getPaymentMethods,
  recharge,
  getFunds,
  addFunds,
  deleteFunds,
  getConsumed,
  createConsumed,
};
