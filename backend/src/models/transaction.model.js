import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    type: { type: String, required: true, enum: ["income", "expense"] },
     amount: { type: Number, required: true, min: 1 },
    description: { type: String, default: "" },
    category: { type: String, required: true },
    date: { type: Date, required: true },
  },
   { timestamps: true }
);

export default mongoose.model("Transaction", transactionSchema);
