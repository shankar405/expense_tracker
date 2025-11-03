import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

export const fetchTransactionsAPI = async (filters = {}) => {
  const res = await API.get("/transactions", { params: filters });
  return res.data;
};

export const addTransaction = async (data) => {
  const res = await API.post("/transactions", data);
  return res.data.transaction;
};

export const deleteTransaction = async (id) => {
  const res = await API.delete(`/transactions/${id}`);
  return res.data;
};

export const updateTransaction = async (id, data) => {
  const res = await API.put(`/transactions/${id}`, data);
  return res.data.transaction;
};
