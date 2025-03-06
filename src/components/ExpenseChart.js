import React, { useContext, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";
import { useNavigate } from "react-router-dom";
import { ExpenseContext } from "./Context/ExpenseContext";

// Rastgele renk üretmek için bir fonksiyon
const generateRandomColor = () => {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

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
  const expenseColors = filteredExpenses.map(() => generateRandomColor());

  const data = {
    labels: expenseLabels,
    datasets: [
      {
        label: "Expenses",
        data: expenseData,
        backgroundColor: expenseColors,
        borderColor: expenseColors,
        borderWidth: 1,
      },
    ],
  };

  const options = {
    cutout: "50%",
    plugins: {
      legend: {
        display: false, // Etiketleri gizle
        position: "bottom",
      },
    },
    maintainAspectRatio: false,
  };

  return (
    <div>
      <div className="bg-white w-[550px] h-[500px] border border-gray-300 rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-4">Expense Analyzer</h1>

        {/* Tarih Seçme Inputları */}
        <div className="flex justify-between mb-4">
          <div className="w-[48%]">
            <label className="block text-sm font-medium text-gray-700">From:</label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          <div className="w-[48%]">
            <label className="block text-sm font-medium text-gray-700">To:</label>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
        </div>

        {/* Filtrelenmiş Toplam Harcama Miktarı */}
        <p className="text-lg font-medium text-gray-800">
          Your total expense in this date rate: <span className="font-bold text-red-500">{filteredTotalAmount} ₺</span>
        </p>

        {/* Pie Chart */}
        <div className="my-4 flex justify-center items-center ml-40" style={{ height: "200px", width: "200px" }}>
          {filteredExpenses.length > 0 ? (
            <Doughnut data={data} options={options} />
          ) : (
            <p className="text-gray-500 text-center">No expenses in this date range</p>
          )}
        </div>

        <div className="flex justify-center">
          <button
            onClick={() => navigate("/expenses")}
            className="border-2 border-gray-200 bg-white w-40 h-10 rounded-lg text-gray-600"
          >
            Show full list
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExpenseChart;

