

#  Expense Tracker Pro

A full-stack MERN application to help you manage your personal finances. Track income, expenses, and visualize your spending habits with a clean, modern dashboard.

## ✨ Features

* **Full CRUD:** Create, Read, Update, and Delete transactions.
* **Dynamic Dashboard:** Get an at-a-glance summary of your total income, expenses, and current balance.
* **Data Visualization:**
    * **Pie Chart:** See your spending distribution by category.
    * **Bar Chart:** Compare spending totals across categories.
    * **Line Chart:** Track your income vs. expense trends over time.
* **Advanced Filtering:** Filter transactions by type (income/expense), category, or a specific date range.
* **Pagination:** Efficiently browse through your transaction history.
* **Real-time Notifications:** Receive success or error feedback for all actions using `react-hot-toast`.
* **Responsive UI:** Built with Tailwind CSS and Shadcn UI for a clean, modern interface on all devices.

---

## 💻 Tech Stack

This project is a full-stack application built with the following technologies:

### **Frontend (Client)**

* **Framework:** React (using Vite)
* **State Management:** Redux Toolkit
* **Styling:** Tailwind CSS
* **UI Components:** Shadcn UI
* **Charting:** Recharts
* **API Client:** Axios
* **Notifications:** `react-hot-toast`

### **Backend (Server)**

* **Runtime:** Node.js
* **Framework:** Express
* **Database:** MongoDB (with Mongoose)
* **Validation:** Zod

---

## 🚀 Getting Started

Follow these instructions to get a local copy of the project up and running.

### Prerequisites

* Node.js (v18.0 or later)
* `npm` (or `yarn` / `pnpm`)
* MongoDB (a local instance or a free cloud-based [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster)

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/expense-tracker-pro.git
cd expense-tracker-pro
```

This guide assumes your project is structured with a client and server directory.

2. Backend Setup
Navigate to the server directory:

Bash

```bash
cd backend
```

Install backend dependencies:

Bash

```bash
npm install
```

Create a .env file from the example.

Bash

```bash
touch .env
```

Add your environment variables to the .env file. You must add your MongoDB connection string.

backend/.env

Code snippet

```env
# Port for the backend server
PORT=5000

# Your MongoDB connection string
MONGODB_URI="mongodb+srv://user:pass@cluster.mongodb.net/expense_db?retryWrites=true&w=majority"
```

3. Frontend Setup
From the root, navigate to the client directory:

Bash

```bash
cd ../frontend
```

Install frontend dependencies:

Bash

```bash
npm install
```

The frontend is set up to use the backend API at http://localhost:5000/api .

4. Run the Application
Start the Backend Server: In your backend directory terminal :

Bash

```bash
node src/index.js `

```

Your server should now be running on http://localhost:5000.

Start the Frontend Client: In your client directory terminal:

Bash

```bash
npm run dev
```

Your React application should now be running and accessible at http://localhost:5173.




📄 License
This project is licensed under the MIT License.
