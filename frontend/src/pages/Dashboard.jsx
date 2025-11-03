import { useState, useMemo, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Legend,
  LineChart,
  Line,
  CartesianGrid,
} from "recharts";
import TransactionForm from "../components/TransactionForm";
import TransactionList from "../components/TransactionList";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "react-hot-toast";

const COLORS = ["#4ade80", "#fca5a5", "#60a5fa", "#f59e0b", "#a78bfa"];

export default function Dashboard() {
  const {
    items = [],
    message,
    success,
  } = useSelector((state) => state.transactions);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (success && message) toast.success(message);
  }, [success, message]);

  const summary = useMemo(() => {
    const income = items
      .filter((t) => t.type === "income")
      .reduce((a, b) => a + b.amount, 0);
    const expense = items
      .filter((t) => t.type === "expense")
      .reduce((a, b) => a + b.amount, 0);
    const balance = income - expense;

    const byCategory = items.reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {});

    const byDate = {};
    items.forEach((t) => {
      const date = new Date(t.date).toLocaleDateString();
      if (!byDate[date]) byDate[date] = { date, income: 0, expense: 0 };
      if (t.type === "income") byDate[date].income += t.amount;
      else byDate[date].expense += t.amount;
    });

    return {
      income,
      expense,
      balance,
      byCategory,
      trend: Object.values(byDate),
    };
  }, [items]);

  const pieData = Object.entries(summary.byCategory).map(([name, value]) => ({
    name,
    value,
  }));

  return (
    <div className=" sm:p-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between border-b pb-3">
        <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800">
          Dashboard
        </h1>
        <p className="hidden sm:block text-sm text-gray-500">
          Overview of your income, expenses, and trends
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Income</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-green-600 text-xl sm:text-2xl font-bold">
              ₹{summary.income.toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Expense</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-600 text-xl sm:text-2xl font-bold">
              ₹{summary.expense.toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-blue-600 text-xl sm:text-2xl font-bold">
              ₹{summary.balance.toLocaleString()}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow">
        <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <CardTitle>All Transactions</CardTitle>
          <Button
            onClick={() => setOpen(true)}
            className="bg-blue-600 text-white hover:bg-blue-700 w-full sm:w-auto"
          >
            + Add Transaction
          </Button>
        </CardHeader>
        <CardContent>
          <TransactionList />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Spending by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={90}
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(1)}%`
                  }
                >
                  {pieData.map((entry, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => `₹${v.toLocaleString()}`} />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
            <p className="text-center text-sm text-gray-500 mt-2">
              Breakdown of your spending by category
            </p>
          </CardContent>
        </Card>

        {/* 📉 Daily Expenses Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Daily Expenses</CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <div className="min-w-[350px] sm:min-w-full">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={summary.trend.slice(-30)}
                  margin={{ top: 20, right: 20, left: 10, bottom: 60 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    angle={-45}
                    textAnchor="end"
                    interval={0}
                    tick={{ fontSize: 10 }}
                    height={70}
                  />
                  <YAxis />
                  <Tooltip formatter={(v) => `₹${v.toLocaleString()}`} />
                  <Bar dataKey="expense" fill="#f87171" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-center text-sm text-gray-500 mt-2">
              Daily expense trend — last 30 days
            </p>
          </CardContent>
        </Card>

        {/* 📈 Income vs Expense Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Income vs Expense Over Time</CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <div className="min-w-[350px] sm:min-w-full">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart
                  data={summary.trend}
                  margin={{ top: 20, right: 20, left: 10, bottom: 60 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    angle={-45}
                    textAnchor="end"
                    interval={0}
                    tick={{ fontSize: 10 }}
                    height={70}
                  />
                  <YAxis />
                  <Tooltip formatter={(v) => `₹${v.toLocaleString()}`} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="income"
                    stroke="#22c55e"
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="expense"
                    stroke="#ef4444"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <p className="text-center text-sm text-gray-500 mt-2">
              Track your income vs expenses over time
            </p>
          </CardContent>
        </Card>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Transaction</DialogTitle>
          </DialogHeader>
          <TransactionForm
            existingData={null}
            onSuccess={() => setOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
