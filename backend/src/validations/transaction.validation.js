// validations/transaction.validation.js
import { z } from "zod";

export const transactionSchema = z.object({
  type: z.enum(["income", "expense"], {
    required_error: "Transaction type is required",
  }),
  amount: z.number().positive("Amount must be positive"),
  description: z.string().optional(),
  category: z.string().min(1, "Category is required"),
  date: z.string().refine(
    (val) => !isNaN(Date.parse(val)),
    "Invalid date format"
  ),
});
