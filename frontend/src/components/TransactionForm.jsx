import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  createTransaction,
  fetchTransactions,
  editTransaction,
} from "../features/transactions/transactionSlice";
import { toast } from "react-hot-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
export default function TransactionForm({ existingData, onSuccess }) {
  const dispatch = useDispatch();
  const [form, setForm] = useState({
    type: "expense",
    category: "",
    amount: "",
    description: "",
    date: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (existingData && Object.keys(existingData).length > 0) {
      setForm({
        type: existingData.type || "expense",
        category: existingData.category || "",
        amount: existingData.amount || "",
        description: existingData.description || "",
        date: existingData.date ? existingData.date.split("T")[0] : "",
      });
    }
  }, [existingData]);
  // --- Validation for a specific field ---
  const validateField = (name, value) => {
    let error = "";
    switch (name) {
      case "category":
        if (!value.trim()) error = "Category is required";
        break;
      case "amount":
        if (!value || isNaN(value) || Number(value) <= 0)
          error = "Amount must be a positive number";
        break;
      case "date":
        if (!value) error = "Date is required";
        break;
      default:
        break;
    }
    return error;
  };

  // --- Validate all fields ---
  const validateAll = () => {
    const newErrors = {};
    for (const [key, val] of Object.entries(form)) {
      const err = validateField(key, val);
      if (err) newErrors[key] = err;
    }
    return newErrors;
  };

  // --- Handle change with per-field validation ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
  };

  const handleSelectChange = (value) => {
    setForm((prev) => ({ ...prev, type: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateAll();
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);
    const payload = { ...form, amount: Number(form.amount) };

   try {
      let res;
      if (existingData && existingData._id) {
        // ✏️ Update
        res = await dispatch(
          editTransaction({ id: existingData._id, data: payload })
        ).unwrap();
      
      } else {
        // ➕ Create
        res = await dispatch(createTransaction(payload)).unwrap();
      }


      // Refresh transactions
      await dispatch(fetchTransactions());

      // Reset form only in add mode
      if (!existingData?._id) {
        setForm({
          type: "expense",
          category: "",
          amount: "",
          description: "",
          date: "",
        });
      }

      setErrors({});
      onSuccess?.(); // ✅ closes modal
    } catch (err) {
      // Show backend error message if available
      const errorMsg =
        err?.message || err?.error || "Failed to save transaction";
      console.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 mt-2">
      {/* Type */}
      <div className="space-y-1">
        <Label htmlFor="type">
          Type <span className="text-red-500">*</span>
        </Label>
        <Select value={form.type} onValueChange={handleSelectChange}>
          <SelectTrigger
            id="type"
            className="w-full border border-slate-300 focus:ring-2 focus:ring-slate-500"
          >
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="income">Income</SelectItem>
            <SelectItem value="expense">Expense</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Category */}
      <div className="space-y-1">
        <Label htmlFor="category">
          Category <span className="text-red-500">*</span>
        </Label>
        <Input
          id="category"
          name="category"
          value={form.category}
          onChange={handleChange}
          placeholder="e.g., Salary, Groceries"
          className={`border ${
            errors.category ? "border-red-500" : "border-gray-300"
          } focus:ring-2 focus:ring-slate-500`}
        />
        {errors.category && (
          <p className="text-red-500 text-xs mt-1">{errors.category}</p>
        )}
      </div>

      {/* Amount */}
      <div className="space-y-1">
        <Label htmlFor="amount">
          Amount <span className="text-red-500">*</span>
        </Label>
        <Input
          id="amount"
          name="amount"
          type="number"
          value={form.amount}
          onChange={handleChange}
          placeholder="Enter amount"
          className={`border ${
            errors.amount ? "border-red-500" : "border-gray-300"
          } focus:ring-2 focus:ring-slate-500`}
        />
        {errors.amount && (
          <p className="text-red-500 text-xs mt-1">{errors.amount}</p>
        )}
      </div>

      {/* Description */}
      <div className="space-y-1">
        <Label htmlFor="description">Description (optional)</Label>
        <Textarea
          id="description"
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Short note or context for the transaction"
          className="border border-gray-300 focus:ring-2 focus:ring-slate-500"
        />
      </div>

      {/* Date */}
      <div className="space-y-1">
        <Label htmlFor="date">
          Date <span className="text-red-500">*</span>
        </Label>
        <Input
          id="date"
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          className={`border ${
            errors.date ? "border-red-500" : "border-gray-300"
          } focus:ring-2 focus:ring-slate-500`}
        />
        {errors.date && (
          <p className="text-red-500 text-xs mt-1">{errors.date}</p>
        )}
      </div>

      {/* Submit */}
      <div className="pt-4">
        <Button
          type="submit"
          disabled={loading}
          className={`w-full ${
            existingData?._id
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-slate-700 hover:bg-slate-800"
          } text-white font-medium py-2 rounded-md`}
        >
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              {existingData?._id ? "Updating..." : "Saving..."}
            </div>
          ) : existingData?._id ? (
            "Update Transaction"
          ) : (
            "Save Transaction"
          )}
        </Button>
      </div>

    </form>
  );
}
