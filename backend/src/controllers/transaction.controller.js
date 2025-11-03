import Transaction from "../models/transaction.model.js";
import { transactionSchema } from "../validations/transaction.validation.js";


export const getAllTransactions = async (req, res) => {
  try {
    const { type, category, startDate, endDate, page = 1, limit = 10 } = req.query;

    // Build dynamic filter object
    const filter = {};
   if (type && type !== "all") filter.type = type;
  if (category) {
      filter.category = { $regex: category, $options: "i" }; // i → case-insensitive
    }

    // Date range filter
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = startDate;
      if (endDate) filter.date.$lte = endDate;
    }

    const skip = (Number(page) - 1) * Number(limit);

    // Get total count for pagination
    const total = await Transaction.countDocuments(filter);

    // Get filtered + paginated transactions
    const transactions = await Transaction.find(filter)
      .sort({ date: -1 })
      .skip(skip)
      .limit(Number(limit));

    res.status(200).json({
      success: true,
      message: "Transactions fetched successfully",
      total,
      page: Number(page),
      limit: Number(limit),
      transactions,
    });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching transactions",
      error: error.message,
    });
  }
};

//createTransaction
export const createTransaction = async (req, res) => {
  try {
    const parsed = transactionSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid transaction data",
        errors: parsed.error.errors,
      });
    }

    const newTransaction = new Transaction(parsed.data);
    await newTransaction.save();

    res.status(201).json({
      success: true,
      message: "Transaction created successfully",
      transaction: newTransaction,
    });
  } catch (error) {
    console.error("Error creating transaction:", error);
    res.status(500).json({
      success: false,
      message: "Error creating transaction",
      error: error.message,
    });
  }
};


//  UPDATE TRANSACTION

export const updateTransaction = async (req, res) => {
  try {
    const { id } = req.params;

    const parsed = transactionSchema.partial().safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid data for update",
        errors: parsed.error.errors,
      });
    }

    const updatedTransaction = await Transaction.findByIdAndUpdate(
      id,
      parsed.data,
      { new: true }
    );

    if (!updatedTransaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Transaction updated successfully",
      transaction: updatedTransaction,
    });
  } catch (error) {
    console.error("Error updating transaction:", error);
    res.status(500).json({
      success: false,
      message: "Error updating transaction",
      error: error.message,
    });
  }
};

//  DELETE TRANSACTION
export const deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Transaction.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Transaction deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting transaction:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting transaction",
      error: error.message,
    });
  }
};
