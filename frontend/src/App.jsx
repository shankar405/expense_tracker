import Header from "./components/Header";
import Dashboard from "./pages/Dashboard";
import { Toaster } from "react-hot-toast";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      <Header />

      <main className="max-w-7xl mx-auto px-6 py-8">
        <Dashboard />
      </main>

      <Toaster position="top-right" />
    </div>
  );
}
