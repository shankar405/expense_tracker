// server.js
import express from "express";
import dotenv from "dotenv";
import transactionRoutes from "./routes/transaction.routes.js";
import cors from "cors";
dotenv.config();

const app = express();
app.use(cors({
  origin: "http://localhost:5173",  // or "http://localhost:3000" if you're using CRA
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
app.use(express.json());

app.use("/api/transactions", transactionRoutes);

export default app;