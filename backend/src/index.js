
import dotenv from "dotenv";
import databaseConnect from "./config/db.js";
import app from "./app.js";
import cors from "cors";
dotenv.config();
databaseConnect();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🟢 Server running on http://localhost:${PORT}`);
});
