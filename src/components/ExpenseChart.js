import React, { useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";
import {
  ChartPieIcon,
  CalendarDaysIcon,
  CurrencyDollarIcon,
} from "@heroicons/react/24/outline";
import ApiService from "./service/ApiService";

Chart.register(ArcElement, Tooltip, Legend);

const incomeColor = "#22c55e"; // yeşil
const expenseColor = "#ef4444"; // kırmızı

const ExpenseChart = () => {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const username = localStorage.getItem("username");

  const handleAnalyze = async () => {
    if (!fromDate || !toDate || !username) return;
    setLoading(true);
    setError("");
    const startDate = fromDate + "T00:00:00";
    const endDate = toDate + "T23:59:59";
    try {
      const res = await ApiService.getExpenseRate(username, startDate, endDate);
      setTransactions(res.data || []);
    } catch (e) {
      setError("Veriler alınamadı");
    } finally {
      setLoading(false);
    }
  };

  // Gelir ve gider toplamlarını hesapla
  const totalIncome = transactions
    .filter((t) => t.isIncome)
    .reduce((sum, t) => sum + (t.amount || 0), 0);
  const totalExpense = transactions
    .filter((t) => !t.isIncome)
    .reduce((sum, t) => sum + (t.amount || 0), 0);

  const data = {
    labels: ["Gelir", "Gider"],
    datasets: [
      {
        label: "Gelir/Gider",
        data: [totalIncome, totalExpense],
        backgroundColor: [incomeColor, expenseColor],
        borderWidth: 0,
      },
    ],
  };

  return (
    <div className="bg-white w-full max-w-[550px] border border-gray-200 rounded-2xl shadow-2xl p-8">
      <h1 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
        <ChartPieIcon className="w-8 h-8 text-blue-500" /> Expense Analyzer
      </h1>
      <div className="flex gap-4 mb-6">
        <div className="flex-1">
          <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
            <CalendarDaysIcon className="w-4 h-4 text-gray-500" />
            From:
          </label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm"
          />
        </div>
        <div className="flex-1">
          <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
            <CalendarDaysIcon className="w-4 h-4 text-gray-500" />
            To:
          </label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm"
          />
        </div>
      </div>
      <button
        onClick={handleAnalyze}
        className="w-full mb-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-4 rounded-xl text-lg font-bold shadow hover:from-blue-600 hover:to-blue-700 transition-colors"
        disabled={loading || !fromDate || !toDate}
      >
        {loading ? "Loading..." : "Analyze"}
      </button>
      <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
        <p className="text-sm text-gray-600 mb-1">
          Total Income:{" "}
          <span className="text-green-600 font-bold">{totalIncome} ₺</span>
        </p>
        <p className="text-sm text-gray-600 mb-1">
          Total Expense:{" "}
          <span className="text-red-600 font-bold">{totalExpense} ₺</span>
        </p>
      </div>
      <div className="flex flex-col items-center mb-6">
        <div className="w-[200px] h-[200px] mb-4">
          {error ? (
            <div className="text-red-500">{error}</div>
          ) : totalIncome > 0 || totalExpense > 0 ? (
            <Doughnut
              data={data}
              options={{
                cutout: "60%",
                plugins: { legend: { display: false } },
                maintainAspectRatio: false,
              }}
            />
          ) : (
            <div className="flex items-center justify-center h-full border-2 border-dashed border-gray-300 rounded-full">
              <p className="text-gray-500 text-center text-sm">
                No transaction in this date
                <br />
                range
              </p>
            </div>
          )}
        </div>
        {/* Legend */}
        {(totalIncome > 0 || totalExpense > 0) && (
          <div className="flex gap-6 mt-2 text-xs">
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: incomeColor }}
              ></div>
              <span className="text-green-700 font-semibold">Gelir</span>
            </div>
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: expenseColor }}
              ></div>
              <span className="text-red-700 font-semibold">Gider</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpenseChart;
