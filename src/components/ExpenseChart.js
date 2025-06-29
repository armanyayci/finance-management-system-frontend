import React, { useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";
import {
  ChartPieIcon,
  CalendarDaysIcon,
  CurrencyDollarIcon,
  DocumentTextIcon,
  XMarkIcon,
  ArrowDownTrayIcon,
  TableCellsIcon,
} from "@heroicons/react/24/outline";
import ApiService from "./service/ApiService";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

Chart.register(ArcElement, Tooltip, Legend);

const incomeColor = "#22c55e"; // yeşil
const expenseColor = "#ef4444"; // kırmızı

const ExpenseChart = () => {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showDetails, setShowDetails] = useState(false);
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

  // Gelir ve gider oranlarını hesapla
  const total = totalIncome + totalExpense;
  const incomePercent =
    total > 0 ? ((totalIncome / total) * 100).toFixed(1) : 0;
  const expensePercent =
    total > 0 ? ((totalExpense / total) * 100).toFixed(1) : 0;

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

  const hasChartData = totalIncome > 0 || totalExpense > 0;

  // Export functions - Frontend implementation
  const handleExportPDF = () => {
    try {
      console.log("Starting PDF export...");
      console.log("jsPDF available:", typeof jsPDF);

      if (typeof jsPDF === "undefined") {
        throw new Error("jsPDF is not available");
      }

      const doc = new jsPDF();

      // Bank Statement Header Design
      doc.setFillColor(25, 35, 85); // Dark blue background
      doc.rect(0, 0, 210, 35, "F");

      // Company/Bank Name
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(22);
      doc.setFont(undefined, "bold");
      doc.text("FinTrack", 105, 15, { align: "center" });

      doc.setFontSize(14);
      doc.setFont(undefined, "normal");
      doc.text("ACCOUNT STATEMENT", 105, 25, { align: "center" });

      // Reset text color
      doc.setTextColor(0, 0, 0);

      // Account Information Box
      doc.setFillColor(245, 245, 245);
      doc.rect(15, 45, 180, 25, "F");
      doc.setDrawColor(200, 200, 200);
      doc.rect(15, 45, 180, 25, "S");

      doc.setFontSize(10);
      doc.setFont(undefined, "bold");
      doc.text("ACCOUNT HOLDER:", 20, 55);
      doc.text("STATEMENT PERIOD:", 20, 62);
      doc.text("GENERATED DATE:", 120, 55);
      doc.text("TOTAL TRANSACTIONS:", 120, 62);

      doc.setFont(undefined, "normal");
      doc.text(username || "N/A", 65, 55);
      doc.text(`${fromDate} - ${toDate}`, 65, 62);
      doc.text(new Date().toLocaleDateString(), 165, 55);
      doc.text(transactions.length.toString(), 175, 62);

      // Summary Section
      doc.setFont(undefined, "bold");
      doc.setFontSize(12);
      doc.text("ACCOUNT SUMMARY", 20, 85);

      // Summary table
      const summaryData = [
        ["Opening Balance", "0.00 ₺"],
        ["Total Credits (+)", `${totalIncome.toLocaleString()} ₺`],
        ["Total Debits (-)", `${totalExpense.toLocaleString()} ₺`],
        [
          "Closing Balance",
          `${(totalIncome - totalExpense).toLocaleString()} ₺`,
        ],
      ];

      if (typeof doc.autoTable === "function") {
        doc.autoTable({
          startY: 90,
          head: [["Description", "Amount"]],
          body: summaryData,
          theme: "grid",
          headStyles: {
            fillColor: [25, 35, 85],
            textColor: [255, 255, 255],
            fontSize: 10,
            fontStyle: "bold",
          },
          bodyStyles: {
            fontSize: 9,
            cellPadding: 3,
          },
          columnStyles: {
            0: { cellWidth: 120 },
            1: { cellWidth: 60, halign: "right", fontStyle: "bold" },
          },
          margin: { left: 20, right: 20 },
        });

        // Transaction Details
        doc.setFont(undefined, "bold");
        doc.setFontSize(12);
        doc.text("TRANSACTION DETAILS", 20, doc.lastAutoTable.finalY + 15);

        // Sort transactions by date (newest first)
        const sortedTransactions = [...transactions].sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );

        // Calculate running balance for each transaction
        let runningBalance = 0;
        const tableData = sortedTransactions.map((tx, index) => {
          runningBalance += tx.isIncome ? tx.amount || 0 : -(tx.amount || 0);

          return [
            (index + 1).toString().padStart(3, "0"), // Transaction number with leading zeros
            `${new Date(tx.date).toLocaleDateString("tr-TR", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })} ${new Date(tx.date).toLocaleTimeString("tr-TR", {
              hour: "2-digit",
              minute: "2-digit",
            })}`, // Combined Date & Time
            tx.description || "No Description", // Full description without truncation - will wrap automatically
            tx.isIncome
              ? `+${(tx.amount || 0).toLocaleString("tr-TR", {
                  minimumFractionDigits: 2,
                })} ₺`
              : `-${(tx.amount || 0).toLocaleString("tr-TR", {
                  minimumFractionDigits: 2,
                })} ₺`,
            `${runningBalance.toLocaleString("tr-TR", {
              minimumFractionDigits: 2,
            })} ₺`,
          ];
        });

        doc.autoTable({
          startY: doc.lastAutoTable.finalY + 20,
          head: [["#", "Date & Time", "Description", "Amount", "Balance"]],
          body: tableData,
          theme: "grid",
          headStyles: {
            fillColor: [25, 35, 85],
            textColor: [255, 255, 255],
            fontSize: 8,
            fontStyle: "bold",
            halign: "center",
            cellPadding: 3,
          },
          bodyStyles: {
            fontSize: 7,
            cellPadding: 3,
            lineColor: [200, 200, 200],
            lineWidth: 0.1,
            overflow: "linebreak",
            cellWidth: "wrap",
          },
                     columnStyles: {
             0: { cellWidth: 10, halign: "center", fontStyle: "bold", valign: "top" }, // #
             1: { cellWidth: 35, halign: "center", fontSize: 6, valign: "top" }, // Date & Time
             2: { cellWidth: 110, halign: "left", valign: "top" }, // Description
             3: { cellWidth: 40, halign: "right", fontStyle: "bold", valign: "top" }, // Amount
             4: { cellWidth: 35, halign: "right", fontStyle: "bold", valign: "top" }, // Balance
           },
          alternateRowStyles: { fillColor: [248, 250, 252] },
          margin: { left: 10, right: 10 },
          didParseCell: function (data) {
            // Color coding for amounts
            if (data.column.index === 3) {
              // Amount column (now index 3)
              if (data.cell.text[0].includes("+")) {
                data.cell.styles.textColor = [34, 197, 94]; // Green for income
                data.cell.styles.fillColor = [240, 253, 244]; // Light green background
              } else if (data.cell.text[0].includes("-")) {
                data.cell.styles.textColor = [239, 68, 68]; // Red for expense
                data.cell.styles.fillColor = [254, 242, 242]; // Light red background
              }
            }

            // Balance column styling
            if (data.column.index === 4) {
              // Balance column (now index 4)
              const balanceValue = parseFloat(
                data.cell.text[0].replace(/[^\d,-]/g, "").replace(",", ".")
              );
              if (balanceValue >= 0) {
                data.cell.styles.textColor = [34, 197, 94]; // Green for positive balance
              } else {
                data.cell.styles.textColor = [239, 68, 68]; // Red for negative balance
              }
            }

            // Description column - enable text wrapping
            if (data.column.index === 2) {
              data.cell.styles.overflow = "linebreak";
              data.cell.styles.cellWidth = "wrap";
            }

            // Zebra striping with better colors
            if (data.row.index % 2 === 0) {
              if (
                !data.cell.styles.fillColor ||
                JSON.stringify(data.cell.styles.fillColor) ===
                  JSON.stringify([248, 250, 252])
              ) {
                data.cell.styles.fillColor = [255, 255, 255]; // White for even rows
              }
            }
          },
          didDrawPage: function (data) {
            // Add page numbers if multiple pages
            if (data.pageNumber > 1) {
              doc.setFontSize(8);
              doc.setTextColor(100, 100, 100);
              doc.text(
                `Page ${data.pageNumber}`,
                data.settings.margin.left,
                doc.internal.pageSize.height - 10
              );
            }
          },
        });

        // Footer
        const pageHeight = doc.internal.pageSize.height;
        doc.setFillColor(25, 35, 85);
        doc.rect(0, pageHeight - 20, 210, 20, "F");

        doc.setTextColor(255, 255, 255);
        doc.setFontSize(8);
        doc.text(
          "This is a computer generated statement and does not require signature.",
          105,
          pageHeight - 12,
          { align: "center" }
        );
        doc.text(
          `Page 1 of 1 | Generated on ${new Date().toLocaleString("tr-TR")}`,
          105,
          pageHeight - 6,
          { align: "center" }
        );
      } else {
        // Fallback without autoTable - Create a manual table with lines
        let yPosition = doc.lastAutoTable ? doc.lastAutoTable.finalY + 20 : 120;

        // Transaction Details Header
        doc.setFont(undefined, "bold");
        doc.setFontSize(12);
        doc.text("TRANSACTION DETAILS", 20, yPosition);
        yPosition += 10;

        // Table Header
        doc.setFillColor(25, 35, 85);
        doc.rect(15, yPosition, 180, 8, "F");
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(8);
        doc.setFont(undefined, "bold");
        doc.text("#", 18, yPosition + 5);
        doc.text("Date & Time", 30, yPosition + 5);
        doc.text("Description", 70, yPosition + 5);
        doc.text("Amount", 175, yPosition + 5);
        yPosition += 10;

        // Reset text color
        doc.setTextColor(0, 0, 0);
        doc.setFont(undefined, "normal");

        // Sort transactions by date (newest first)
        const sortedTransactions = [...transactions].sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );

        sortedTransactions.forEach((tx, index) => {
          if (yPosition > 270) {
            doc.addPage();
            yPosition = 30;
          }

                     // Description with text wrapping - calculate first to get row height
           doc.setFontSize(7);
           const description = tx.description || "No Description";
           const maxWidth = 80; // Adjusted width to create a buffer
           const lines = doc.splitTextToSize(description, maxWidth);

          // Calculate row height based on number of lines
          const lineHeight = 4;
          const rowHeight = Math.max(8, lines.length * lineHeight + 2);

          // Alternate row background
          if (index % 2 === 0) {
            doc.setFillColor(248, 250, 252);
            doc.rect(15, yPosition - 2, 180, rowHeight, "F");
          }

          // Transaction data
          doc.setFontSize(7);
          doc.text((index + 1).toString().padStart(2, "0"), 18, yPosition + 3);

          // Combined Date & Time (smaller font)
          doc.setFontSize(6);
          const dateTime = `${new Date(tx.date).toLocaleDateString(
            "tr-TR"
          )} ${new Date(tx.date).toLocaleTimeString("tr-TR", {
            hour: "2-digit",
            minute: "2-digit",
          })}`;
          doc.text(dateTime, 30, yPosition + 3);

          // Draw description lines with consistent font
          doc.setFontSize(7);
          doc.setFont(undefined, "normal");
          lines.forEach((line, lineIndex) => {
            doc.text(line, 70, yPosition + 3 + lineIndex * lineHeight);
          });

          // Amount with color and sign - positioned to avoid overlap
          doc.setFontSize(7);
          doc.setFont(undefined, "bold");
          const amountText = tx.isIncome
            ? `+${(tx.amount || 0).toLocaleString("tr-TR")} ₺`
            : `-${(tx.amount || 0).toLocaleString("tr-TR")} ₺`;

          if (tx.isIncome) {
            doc.setTextColor(34, 197, 94);
          } else {
            doc.setTextColor(239, 68, 68);
          }
           // Position amount far to the right to guarantee no overlap
           doc.text(amountText, 185, yPosition + 3, { align: 'right' });

           // Reset color and font style for next loop iteration
           doc.setTextColor(0, 0, 0);
           doc.setFont(undefined, "normal");

           // Draw separator line
           doc.setDrawColor(200, 200, 200);
           doc.setLineWidth(0.1);
           doc.line(15, yPosition + rowHeight, 195, yPosition + rowHeight);

           // Adjust yPosition based on actual row height
           yPosition += rowHeight + 2;
        });

        // Border around table removed for cleaner look
      }

      doc.save(`bank-statement-${fromDate}-${toDate}.pdf`);
      console.log("PDF export successful!");
    } catch (error) {
      console.error("PDF export error:", error);
      alert(`PDF export failed: ${error.message}`);
    }
  };

  const handleExportExcel = async () => {
    try {
      // Summary data
      const summaryData = [
        ["Transaction Report"],
        [`Period: ${fromDate} - ${toDate}`],
        [`Generated: ${new Date().toLocaleString()}`],
        [],
        ["Summary"],
        ["Total Income", `${totalIncome.toLocaleString()} ₺`],
        ["Total Expense", `${totalExpense.toLocaleString()} ₺`],
        ["Net Balance", `${(totalIncome - totalExpense).toLocaleString()} ₺`],
        [],
        ["Transactions"],
        ["Date", "Description", "Category", "Payment Type", "Type", "Amount"],
      ];

      // Transaction data
      const transactionData = transactions.map((tx) => [
        new Date(tx.date).toLocaleDateString(),
        tx.description,
        tx.category || "N/A",
        tx.paymentType || "N/A",
        tx.isIncome ? "Income" : "Expense",
        tx.amount || 0,
      ]);

      const allData = [...summaryData, ...transactionData];

      const worksheet = XLSX.utils.aoa_to_sheet(allData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Transactions");

      const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });
      const blob = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      saveAs(blob, `transaction-report-${fromDate}-${toDate}.xlsx`);
    } catch (error) {
      console.error("Excel export error:", error);
      alert(
        "Excel export failed. Please install required dependencies: npm install xlsx file-saver"
      );
    }
  };

  // Details Modal Component
  const DetailsModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <DocumentTextIcon className="w-8 h-8" />
            Transaction Details ({fromDate} - {toDate})
          </h2>
          <button
            onClick={() => setShowDetails(false)}
            className="p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Summary Cards */}
        <div className="p-6 border-b border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-600 font-medium">
                    Total Income
                  </p>
                  <p className="text-2xl font-bold text-green-700">
                    {totalIncome.toLocaleString()} ₺
                  </p>
                </div>
                <div className="text-green-500">
                  <CurrencyDollarIcon className="w-8 h-8" />
                </div>
              </div>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-red-600 font-medium">
                    Total Expense
                  </p>
                  <p className="text-2xl font-bold text-red-700">
                    {totalExpense.toLocaleString()} ₺
                  </p>
                </div>
                <div className="text-red-500">
                  <CurrencyDollarIcon className="w-8 h-8" />
                </div>
              </div>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-600 font-medium">
                    Net Balance
                  </p>
                  <p
                    className={`text-2xl font-bold ${
                      totalIncome - totalExpense >= 0
                        ? "text-green-700"
                        : "text-red-700"
                    }`}
                  >
                    {(totalIncome - totalExpense).toLocaleString()} ₺
                  </p>
                </div>
                <div className="text-blue-500">
                  <ChartPieIcon className="w-8 h-8" />
                </div>
              </div>
            </div>
          </div>

          {/* Export Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleExportPDF}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              <ArrowDownTrayIcon className="w-5 h-5" />
              Export PDF
            </button>
            <button
              onClick={handleExportExcel}
              className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              <TableCellsIcon className="w-5 h-5" />
              Export Excel
            </button>
          </div>
        </div>

        {/* Transactions List */}
        <div className="p-6 overflow-y-auto max-h-96">
          <h3 className="text-lg font-bold mb-4">
            All Transactions ({transactions.length})
          </h3>
          {transactions.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No transactions found in this date range.
            </p>
          ) : (
            <div className="space-y-3">
              {transactions.map((tx, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-between p-4 rounded-xl border-l-4 ${
                    tx.isIncome
                      ? "bg-green-50 border-green-500"
                      : "bg-red-50 border-red-500"
                  }`}
                >
                  <div className="flex-1">
                    <div className="font-semibold text-gray-800">
                      {tx.description}
                    </div>
                    <div className="flex gap-2 mt-1">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-200 text-gray-700">
                        {tx.category || "N/A"}
                      </span>
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-200 text-gray-700">
                        {tx.paymentType || "N/A"}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div
                      className={`text-xl font-bold ${
                        tx.isIncome ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {tx.isIncome ? "+" : "-"}
                      {tx.amount?.toLocaleString()} ₺
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(tx.date).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

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
          ) : hasChartData ? (
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
        {/* Oranlar */}
        {hasChartData && (
          <div className="flex gap-4 mb-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-700 font-bold text-sm">
              Income: {incomePercent}%
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-red-100 text-red-700 font-bold text-sm">
              Expense: {expensePercent}%
            </span>
          </div>
        )}
      </div>

      {/* Details Button - Only show when chart has data */}
      {hasChartData && (
        <button
          onClick={() => setShowDetails(true)}
          className="w-full bg-gradient-to-r from-gray-500 to-gray-600 text-white py-3 px-4 rounded-xl text-lg font-bold shadow hover:from-gray-600 hover:to-gray-700 transition-colors flex items-center justify-center gap-2"
        >
          <DocumentTextIcon className="w-5 h-5" />
          View Details
        </button>
      )}

      {/* Details Modal */}
      {showDetails && <DetailsModal />}
    </div>
  );
};

export default ExpenseChart;
