import React, { useContext, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";
import { useNavigate } from "react-router-dom";
import { ExpenseContext } from "./Context/ExpenseContext";
import { ChartPieIcon, CalendarDaysIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';

const expenseColors = [
  '#ef4444', '#f97316', '#eab308', '#22c55e', '#06b6d4', 
  '#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'
];

const ExpenseChart = () => {
  const navigate = useNavigate();
  const { expenses } = useContext(ExpenseContext);

  // Tarih filtreleri için state'ler
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // Tarih aralığında olan harcamaları filtreleme
  const filteredExpenses = expenses.filter((expense) => {
    if (!fromDate || !toDate) return true; // Eğer tarih girilmediyse tüm harcamaları göster
    const expenseDate = new Date(expense.date);
    return expenseDate >= new Date(fromDate) && expenseDate <= new Date(toDate);
  });

  // Filtrelenmiş harcamaların toplam tutarını hesaplama
  const filteredTotalAmount = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);

  // Filtrelenmiş harcamaları Pie Chart formatına uygun hale getiriyoruz
  const expenseLabels = filteredExpenses.map(expense => expense.name);
  const expenseData = filteredExpenses.map(expense => expense.amount);
  const chartColors = filteredExpenses.map((_, index) => expenseColors[index % expenseColors.length]);

  const data = {
    labels: expenseLabels,
    datasets: [
      {
        label: "Expenses",
        data: expenseData,
        backgroundColor: chartColors,
        borderColor: chartColors,
        borderWidth: 0,
      },
    ],
  };

  const options = {
    cutout: "60%",
    plugins: {
      legend: {
        display: false,
      },
    },
    maintainAspectRatio: false,
  };

  return (
    <div>
      <div className="bg-white w-full max-w-[550px] border border-gray-200 rounded-2xl shadow-2xl p-8">
        <h1 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
          <ChartPieIcon className="w-8 h-8 text-blue-500" /> Expense Analyzer
        </h1>

        {/* Modern Date Inputs */}
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
              className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
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
              className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>
        </div>

        {/* Total Expense Display */}
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
          <p className="text-sm text-gray-600 mb-1">Your total expense in this date range:</p>
          <div className="flex items-center gap-2">
            <CurrencyDollarIcon className="w-6 h-6 text-red-500" />
            <span className="text-3xl font-bold text-red-600">{filteredTotalAmount} ₺</span>
          </div>
        </div>

        {/* Chart */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-[200px] h-[200px] mb-4">
            {filteredExpenses.length > 0 ? (
              <Doughnut data={data} options={options} />
            ) : (
              <div className="flex items-center justify-center h-full border-2 border-dashed border-gray-300 rounded-full">
                <p className="text-gray-500 text-center text-sm">No expenses in this date<br/>range</p>
              </div>
            )}
          </div>

          {/* Legend */}
          {filteredExpenses.length > 0 && (
            <div className="grid grid-cols-2 gap-2 text-xs">
              {filteredExpenses.slice(0, 6).map((expense, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: chartColors[index] }}
                  ></div>
                  <span className="text-gray-600 truncate">{expense.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={() => navigate("/expenses")}
          className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-4 rounded-xl text-lg font-bold shadow hover:from-blue-600 hover:to-blue-700 transition-colors"
        >
          Show Full List
        </button>
      </div>
    </div>
  );
};

export default ExpenseChart;

