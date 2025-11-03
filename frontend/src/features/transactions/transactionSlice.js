// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import {
//   fetchTransactionsAPI,
//   addTransaction,
//   updateTransaction,
//   deleteTransaction,
// } from "./transactionAPI";

// // --- Async Thunks ---
// export const fetchTransactions = createAsyncThunk(
//   "transactions/fetchAll",
//   async (filters, { rejectWithValue }) => {
//     try {
//       return await fetchTransactionsAPI(filters);
//     } catch (err) {
//       return rejectWithValue(err.response?.data || err.message);
//     }
//   }
// );

// export const createTransaction = createAsyncThunk(
//   "transactions/create",
//   async (data, { rejectWithValue }) => {
//     try {
//       return await addTransaction(data);
//     } catch (err) {
//       return rejectWithValue(err.response?.data || err.message);
//     }
//   }
// );

// export const editTransaction = createAsyncThunk(
//   "transactions/update",
//   async ({ id, data }, { rejectWithValue }) => {
//     try {
//       return await updateTransaction(id, data);
//     } catch (err) {
//       return rejectWithValue(err.response?.data || err.message);
//     }
//   }
// );

// export const removeTransaction = createAsyncThunk(
//   "transactions/delete",
//   async (id, { rejectWithValue }) => {
//     try {
//       return await deleteTransaction(id);
//     } catch (err) {
//       return rejectWithValue(err.response?.data || err.message);
//     }
//   }
// );

// // --- Slice ---
// const transactionSlice = createSlice({
//   name: "transactions",
//   initialState: {
//     items: [],
//     loading: false,
//     error: null,
//     filters: { page: 1 },
//     total: 0,
//     limit: 10,
//     page: 1,
//     message: null, // ✅ added
//     success: false, // ✅ added
//   },
//   reducers: {
//     setFilters: (state, action) => {
//       state.filters = action.payload;
//     },
//     clearMessage: (state) => {
//       state.message = null;
//       state.success = false;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       // Fetch
//       .addCase(fetchTransactions.pending, (state) => {
//         state.loading = true;
//         state.message = null;
//         state.success = false;
//       })
//       .addCase(fetchTransactions.fulfilled, (state, action) => {
//         state.loading = false;
//         state.items = action.payload.transactions || [];
//         state.total = action.payload.total || 0;
//         state.page = action.payload.page || 1;
//         state.limit = action.payload.limit || 10;
//         state.message = action.payload.message || "Transactions fetched successfully";
//         state.success = action.payload.success || true;
//       })
//       .addCase(fetchTransactions.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//         state.items = [];
//         state.success = false;
//         state.message = "Failed to fetch transactions";
//       })
//       // Create
//       .addCase(createTransaction.fulfilled, (state, action) => {
//         state.items.push(action.payload);
//         state.success = true;
//         state.message = "Transaction created successfully";
//       })
//       // Update
//       .addCase(editTransaction.fulfilled, (state, action) => {
//         const i = state.items.findIndex((t) => t._id === action.payload._id);
//         if (i !== -1) state.items[i] = action.payload;
//         state.success = true;
//         state.message = "Transaction updated successfully";
//       })
//       // Delete
//       .addCase(removeTransaction.fulfilled, (state, action) => {
//         state.items = state.items.filter((t) => t._id !== action.meta.arg);
//         state.success = true;
//         state.message = "Transaction deleted successfully";
//       });
//   },
// });

// export const { setFilters, clearMessage } = transactionSlice.actions;
// export default transactionSlice.reducer;
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchTransactionsAPI,
  addTransaction,
  updateTransaction,
  deleteTransaction,
} from "./transactionAPI";

// --- Async Thunks ---
export const fetchTransactions = createAsyncThunk(
  "transactions/fetchAll",
  async (filters, { rejectWithValue }) => {
    try {
      return await fetchTransactionsAPI(filters);
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const createTransaction = createAsyncThunk(
  "transactions/create",
  async (data, { rejectWithValue }) => {
    try {
      return await addTransaction(data);
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const editTransaction = createAsyncThunk(
  "transactions/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      return await updateTransaction(id, data);
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const removeTransaction = createAsyncThunk(
  "transactions/delete",
  async (id, { rejectWithValue }) => {
    try {
      return await deleteTransaction(id);
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// --- Slice ---
const transactionSlice = createSlice({
  name: "transactions",
  initialState: {
    items: [],
    loading: false,
    error: null,
    filters: {
      page: 1,
      limit: 5,
      type: "",
      category: "",
      startDate: "",
      endDate: "",
    },
    total: 0,
    message: null,
    success: false,
  },
  reducers: {
    setFilters: (state, action) => {
      state.filters = action.payload;
    },
    clearMessage: (state) => {
      state.message = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransactions.pending, (state) => {
        state.loading = true;
        state.message = null;
        state.success = false;
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.transactions || [];
        state.total = action.payload.total || 0;

        // ✅ Sync pagination in both main and filters
        state.filters.page = action.payload.page || 1;
        state.filters.limit = action.payload.limit || 10;

        state.message = action.payload.message || "Transactions fetched successfully";
        state.success = true;
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.items = [];
        state.success = false;
        state.message = "Failed to fetch transactions";
      })
      .addCase(createTransaction.fulfilled, (state, action) => {
        state.items.push(action.payload);
        state.success = true;
        state.message = "Transaction created successfully";
      })
      .addCase(editTransaction.fulfilled, (state, action) => {
        const i = state.items.findIndex((t) => t._id === action.payload._id);
        if (i !== -1) state.items[i] = action.payload;
        state.success = true;
        state.message = "Transaction updated successfully";
      })
      .addCase(removeTransaction.fulfilled, (state, action) => {
        state.items = state.items.filter((t) => t._id !== action.meta.arg);
        state.success = true;
        state.message = "Transaction deleted successfully";
      });
  },
});

export const { setFilters, clearMessage } = transactionSlice.actions;
export default transactionSlice.reducer;
