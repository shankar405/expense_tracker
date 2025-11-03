// import { useDispatch, useSelector } from "react-redux";
// import { fetchTransactions, removeTransaction, setFilters } from "../features/transactions/transactionSlice";
// import { useEffect } from "react";

// export default function TransactionList() {
//   const dispatch = useDispatch();
//   const { items, loading, filters } = useSelector((state) => state.transactions);

//   useEffect(() => {
//     dispatch(fetchTransactions(filters));
//   }, [dispatch, filters]);

//   const handleDelete = (id) => {
//     if (confirm("Delete this transaction?")) {
//       dispatch(removeTransaction(id));
//     }
//   };

//   return (
//     <div>
//       <div className="flex gap-2 mb-4">
//         <select
//           onChange={(e) => dispatch(setFilters({ ...filters, type: e.target.value || undefined }))}
//           className="border p-1 rounded"
//         >
//           <option value="">All</option>
//           <option value="income">Income</option>
//           <option value="expense">Expense</option>
//         </select>
//         <input type="date" onChange={(e) => dispatch(setFilters({ ...filters, startDate: e.target.value }))} />
//         <input type="date" onChange={(e) => dispatch(setFilters({ ...filters, endDate: e.target.value }))} />
//         <input placeholder="Category" onChange={(e) => dispatch(setFilters({ ...filters, category: e.target.value }))} />
//         <button onClick={() => dispatch(fetchTransactions(filters))} className="bg-blue-500 text-white px-3 rounded">Apply</button>
//       </div>

//       {loading ? (
//         <p>Loading...</p>
//       ) : (
//         <ul className="space-y-2">
//           {items.map((t) => (
//             <li key={t._id} className="flex justify-between bg-white p-3 rounded shadow">
//               <div>
//                 <div className="font-semibold">{t.category} • {t.type}</div>
//                 <div className="text-sm">{t.description}</div>
//               </div>
//               <div className="text-right">
//                 <div className={t.type === "income" ? "text-green-600" : "text-red-600"}>{t.amount}</div>
//                 <div className="text-xs">{new Date(t.date).toLocaleDateString()}</div>
//                 <button onClick={() => handleDelete(t._id)} className="text-xs text-gray-500 mt-1">Delete</button>
//               </div>
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// }
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchTransactions,
  removeTransaction,
  setFilters,
} from "../features/transactions/transactionSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "react-hot-toast";
import { Pencil, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import TransactionForm from "./TransactionForm";

export default function TransactionList() {
  const [editing, setEditing] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const dispatch = useDispatch();
  const { items, loading, filters, total } = useSelector(
    (state) => state.transactions
  );
  const { page, limit, type, category, startDate, endDate } = filters;

  // ✅ Single fetching logic
  useEffect(() => {
    dispatch(fetchTransactions(filters));
  }, [dispatch, filters]);

  const handleDelete = async (id) => {
    if (confirm("Delete this transaction?")) {
      await dispatch(removeTransaction(id));
      toast.success("Transaction deleted successfully!");
      dispatch(fetchTransactions(filters));
    }
  };

  const handleFilterChange = (name, value) => {
    dispatch(setFilters({ ...filters, [name]: value, page: 1 })); // reset to page 1
  };

  const handleNext = () => {
    const totalPages = Math.ceil(total / limit);
    if (page < totalPages) dispatch(setFilters({ ...filters, page: page + 1 }));
  };

  const handlePrev = () => {
    if (page > 1) dispatch(setFilters({ ...filters, page: page - 1 }));
  };

  const totalPages = Math.ceil(total / limit);
return (
  <div className="space-y-4">
    {/* ✅ Responsive Filters Section */}
    <div className="bg-gray-50 border border-gray-200 rounded-md p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
      <Select
        onValueChange={(v) => handleFilterChange("type", v)}
        value={type}
      >
        <SelectTrigger className="border-gray-300 focus:ring-blue-500 w-full">
          <SelectValue placeholder="Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          <SelectItem value="income">Income</SelectItem>
          <SelectItem value="expense">Expense</SelectItem>
        </SelectContent>
      </Select>

      <Input
        placeholder="Category"
        value={category}
        onChange={(e) => handleFilterChange("category", e.target.value)}
        className="w-full"
      />

      <Input
        type="date"
        value={startDate}
        onChange={(e) => handleFilterChange("startDate", e.target.value)}
        className="w-full"
      />

      <Input
        type="date"
        value={endDate}
        onChange={(e) => handleFilterChange("endDate", e.target.value)}
        className="w-full"
      />

      {/* Optional manual refresh button for filters */}
      {/* <Button onClick={() => dispatch(fetchTransactions(filters))} className="bg-blue-600 text-white hover:bg-blue-700 w-full">
        Apply
      </Button> */}
    </div>

    {/* ✅ Loading Skeleton */}
    {loading ? (
      <div className="space-y-2 animate-pulse">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="flex flex-col sm:flex-row sm:justify-between bg-white p-4 rounded shadow-sm border border-gray-100"
          >
            <div className="space-y-2 w-full sm:w-1/2">
              <div className="h-4 bg-gray-200 rounded w-1/3" />
              <div className="h-3 bg-gray-200 rounded w-2/3" />
            </div>

            <div className="text-right space-y-2 w-full sm:w-1/4 mt-3 sm:mt-0">
              <div className="h-4 bg-gray-200 rounded w-1/2 ml-auto" />
              <div className="h-3 bg-gray-200 rounded w-1/3 ml-auto" />
              <div className="flex gap-2 justify-end mt-1">
                <div className="h-5 w-5 bg-gray-200 rounded-full" />
                <div className="h-5 w-5 bg-gray-200 rounded-full" />
              </div>
            </div>
          </div>
        ))}
      </div>
    ) : items.length === 0 ? (
      <p className="text-center text-gray-500 mt-4">No transactions found.</p>
    ) : (
      <>
        {/* ✅ Transaction List */}
        <ul className="space-y-2">
          {items.map((t) => (
            <li
              key={t._id}
              className="flex flex-col sm:flex-row sm:justify-between bg-white p-4 rounded shadow-sm border border-gray-100 hover:shadow-md transition-all"
            >
              <div>
                <div className="font-semibold text-gray-800 text-sm sm:text-base">
                  {t.category}{" "}
                  <span className="text-xs sm:text-sm text-gray-500">• {t.type}</span>
                </div>
                {t.description && (
                  <div className="text-xs sm:text-sm text-gray-600">
                    {t.description}
                  </div>
                )}
              </div>

              <div className="text-right mt-3 sm:mt-0">
                <div
                  className={`text-base sm:text-lg font-bold ${
                    t.type === "income" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  ₹{t.amount.toLocaleString()}
                </div>
                <div className="text-xs text-gray-500">
                  {new Date(t.date).toLocaleDateString()}
                </div>
                <div className="flex gap-1 justify-end mt-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setEditing(t);
                      setIsEditOpen(true);
                    }}
                    className="text-gray-500 hover:text-blue-600 p-2 rounded-full hover:bg-blue-50"
                    title="Edit Transaction"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(t._id)}
                    className="text-gray-500 hover:text-red-600 p-2 rounded-full hover:bg-red-50"
                    title="Delete Transaction"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </li>
          ))}
        </ul>

        {/* ✅ Pagination (Responsive) */}
        <div className="flex flex-col sm:flex-row justify-between items-center mt-5 gap-3">
          <Button
            variant="outline"
            disabled={page <= 1}
            onClick={handlePrev}
            className="border-blue-500 text-blue-600 hover:bg-blue-50 w-full sm:w-auto"
          >
            Previous
          </Button>

          <span className="text-sm text-gray-600 font-medium text-center">
            Page {page} of {totalPages} | Total {total}
          </span>

          <Button
            variant="outline"
            disabled={page >= totalPages}
            onClick={handleNext}
            className="border-blue-500 text-blue-600 hover:bg-blue-50 w-full sm:w-auto"
          >
            Next
          </Button>
        </div>
      </>
    )}

    {/* ✅ Edit Modal */}
    <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Transaction</DialogTitle>
        </DialogHeader>
        {editing && (
          <TransactionForm
            existingData={editing}
            onSuccess={() => {
              setIsEditOpen(false);
              setEditing(null);
            }}
          />
        )}
      </DialogContent>
    </Dialog>
  </div>
);
}