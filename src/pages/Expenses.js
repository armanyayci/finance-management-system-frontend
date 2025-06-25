import React, { useState, useEffect, useContext } from "react";
import { ExpenseContext } from "../components/Context/ExpenseContext";
import "../Style/ExpensePage.css";
import { Button, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, TablePagination, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, MenuItem, InputAdornment, IconButton, Chip, Box } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import SearchIcon from '@mui/icons-material/Search';
import DownloadIcon from '@mui/icons-material/Download';
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

const CATEGORIES = [
  "Yemek", "Ulaşım", "Eğlence", "Fatura", "Sağlık", "Alışveriş", "Diğer"
];

const ExpenseTracker = () => {
  const navigate = useNavigate();
  const { expenses, setExpenses, setTotalAmount } = useContext(ExpenseContext);
  const firstname = localStorage.getItem("firstname");
  const lastname = localStorage.getItem("lastname");

  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(6);
  const [editingIndex, setEditingIndex] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("");

  useEffect(() => {
    const savedExpenses = localStorage.getItem("expenses");
    if (savedExpenses) {
      setExpenses(JSON.parse(savedExpenses));
    }
  }, [setExpenses]);

  useEffect(() => {
    localStorage.setItem("expenses", JSON.stringify(expenses));
    const total = expenses.reduce((acc, curr) => acc + parseFloat(curr.amount || 0), 0);
    setTotalAmount(total);
  }, [expenses, setTotalAmount]);

  const addExpense = () => {
    if (name && date && amount && category) {
      const updatedExpense = { name, date, amount: parseFloat(amount), category };
      if (editingIndex !== null) {
        const newExpenses = [...expenses];
        newExpenses[editingIndex] = updatedExpense;
        setExpenses(newExpenses);
        setEditingIndex(null);
        toast.success("Expense updated successfully!", { position: "top-right" });
      } else {
        setExpenses([...expenses, updatedExpense]);
        toast.success("Expense added successfully!", { position: "top-right" });
      }
      setName("");
      setDate("");
      setAmount("");
      setCategory(CATEGORIES[0]);
    }
  };

  const confirmDeleteExpense = (index) => {
    setSelectedIndex(index);
    setOpenDialog(true);
  };
  const handleCancel =()=>{
    setOpenDialog(false);
    toast.error("Expense couldn't delete !!!", {position: 'top-right'});
  }
  const handleDelete = () => {
    if (selectedIndex !== null) {
      const newExpenses = expenses.filter((_, i) => i !== selectedIndex);
      setExpenses(newExpenses);
    }
    setOpenDialog(false);
    toast.success('Expense deleted succesfully!!!',{position:'top-right'})
  };
  const updateExpense = (index) => {
    const expenseToUpdate = expenses[index];
    setName(expenseToUpdate.name);
    setDate(expenseToUpdate.date);
    setAmount(expenseToUpdate.amount);
    setCategory(expenseToUpdate.category || CATEGORIES[0]);
    setEditingIndex(index);
  };
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  // Filtreleme ve arama
  const filteredExpenses = expenses.filter(exp =>
    (exp.name.toLowerCase().includes(search.toLowerCase()) ||
     exp.category?.toLowerCase().includes(search.toLowerCase())) &&
    (filterCategory ? exp.category === filterCategory : true)
  );
  // Kategoriye göre toplamlar
  const categoryTotals = CATEGORIES.map(cat => ({
    category: cat,
    total: expenses.filter(e => e.category === cat).reduce((acc, curr) => acc + parseFloat(curr.amount || 0), 0)
  })).filter(c => c.total > 0);
  // Export CSV
  const exportCSV = () => {
    const header = "User,Name,Date,Amount,Category\n";
    const rows = expenses.map(e => `${firstname} ${lastname},${e.name},${e.date},${e.amount},${e.category}`).join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "expenses.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex flex-col items-center py-8 px-2 relative overflow-x-auto">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
      {/* Header */}
      <div className="flex items-center justify-between w-full max-w-4xl mb-6">
        <button onClick={() => navigate("/home")} style={{ background: "none", border: "none", cursor: "pointer" }}>
          <ArrowBackIosNewIcon style={{ color: "darkblue", fontWeight: "bold", fontSize: "30px" }} />
        </button>
        <Typography variant="h4" gutterBottom className="flex-grow text-center font-bold text-indigo-700 drop-shadow-lg">
          Expense Tracker
        </Typography>
        <div style={{ width: "40px" }}></div>
      </div>
      {/* Toplam ve kategori özetleri */}
      <div className="w-full max-w-4xl flex flex-col md:flex-row gap-4 mb-6">
        <Paper elevation={4} className="flex-1 p-4 flex flex-col items-center bg-white/90 rounded-2xl shadow-lg">
          <Typography variant="h6" className="font-bold text-blue-700 mb-1">Total Expense</Typography>
          <Typography variant="h4" className="font-extrabold text-green-600">{expenses.reduce((acc, curr) => acc + parseFloat(curr.amount || 0), 0).toLocaleString()} ₺</Typography>
        </Paper>
        <Paper elevation={4} className="flex-[2] p-4 flex flex-wrap gap-2 items-center justify-center bg-white/90 rounded-2xl shadow-lg">
          {categoryTotals.length > 0 ? categoryTotals.map(c => (
            <Chip key={c.category} label={`${c.category}: ${c.total.toLocaleString()} ₺`} color="primary" variant="outlined" className="font-semibold" />
          )) : <span className="text-gray-400">No category summary</span>}
        </Paper>
        <Paper elevation={4} className="flex-1 p-4 flex flex-col items-center bg-white/90 rounded-2xl shadow-lg">
          <Typography variant="h6" className="font-bold text-blue-700 mb-1">User</Typography>
          <Typography variant="h5" className="font-bold text-indigo-700">{firstname} {lastname}</Typography>
        </Paper>
      </div>
      {/* Giriş Formu ve Ara/Filtre/Export */}
      <Paper elevation={6} className="w-full max-w-4xl p-6 mb-6 rounded-2xl shadow-xl bg-white/95 flex flex-col md:flex-row gap-4 items-center">
        <Box className="flex flex-col md:flex-row gap-3 flex-1 w-full">
          <TextField label="Name" variant="outlined" value={name} onChange={(e) => setName(e.target.value)} size="small" />
          <TextField type="date" variant="outlined" value={date} onChange={(e) => setDate(e.target.value)} size="small" />
          <TextField label="Amount (₺)" variant="outlined" value={amount} onChange={(e) => setAmount(e.target.value)} size="small" />
          <TextField select label="Category" value={category} onChange={e => setCategory(e.target.value)} size="small" style={{ minWidth: 120 }}>
            {CATEGORIES.map(cat => <MenuItem key={cat} value={cat}>{cat}</MenuItem>)}
          </TextField>
          <Button variant="contained" color="success" onClick={addExpense} sx={{ minWidth: 120, fontWeight: 'bold', boxShadow: 2 }}>
            {editingIndex !== null ? "Update" : "Add Expense"}
          </Button>
        </Box>
        <Box className="flex flex-col md:flex-row gap-3 items-center">
          <TextField
            label="Search"
            variant="outlined"
            value={search}
            onChange={e => setSearch(e.target.value)}
            size="small"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton>
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
          <TextField select label="Filter" value={filterCategory} onChange={e => setFilterCategory(e.target.value)} size="small" style={{ minWidth: 120 }}>
            <MenuItem value="">All</MenuItem>
            {CATEGORIES.map(cat => <MenuItem key={cat} value={cat}>{cat}</MenuItem>)}
          </TextField>
          <Button variant="outlined" color="primary" startIcon={<DownloadIcon />} onClick={exportCSV} sx={{ fontWeight: 'bold' }}>
            Export CSV
          </Button>
        </Box>
      </Paper>
      {/* Tablo */}
      <TableContainer component={Paper} className="w-full max-w-4xl bg-white/90 rounded-2xl shadow-lg">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><b>User</b></TableCell>
              <TableCell><b>Expense Name</b></TableCell>
              <TableCell><b>Expense Date</b></TableCell>
              <TableCell><b>Expense Amount</b></TableCell>
              <TableCell><b>Category</b></TableCell>
              <TableCell><b>Actions</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredExpenses.length > 0 ? (
              filteredExpenses.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((expense, index) => (
                <TableRow key={index} hover className="transition-all duration-200 hover:bg-blue-50">
                  <TableCell>{firstname} {lastname}</TableCell>
                  <TableCell>{expense.name}</TableCell>
                  <TableCell>{expense.date}</TableCell>
                  <TableCell>{expense.amount} ₺</TableCell>
                  <TableCell>
                    <Chip label={expense.category} color="info" size="small" />
                  </TableCell>
                  <TableCell>
                    <Button variant="contained" color="primary" onClick={() => updateExpense(index)} style={{ marginRight: "5px" }}>
                      Update
                    </Button>
                    <Button variant="contained" color="error" onClick={() => confirmDeleteExpense(index)}>
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ backgroundColor: "gray", color: "white", fontWeight: "bold" }}>
                  No expenses found!
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[6, 12, 18]}
          component="div"
          count={filteredExpenses.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
      {/* Onaylama Dialogu */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Delete Expense</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this expense? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <style>{`
        .MuiTableCell-root, .MuiTablePagination-root { font-size: 1rem; }
        .MuiTableRow-root { transition: background 0.2s; }
      `}</style>
    </div>
  );
};

export default ExpenseTracker;
