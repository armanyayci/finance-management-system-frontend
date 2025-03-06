import React, { useState, useEffect, useContext } from "react";
import { ExpenseContext } from "../components/Context/ExpenseContext";
import "../Style/ExpensePage.css";
import { Button, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, TablePagination, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

const ExpenseTracker = () => {
  const navigate = useNavigate();

  const { expenses, setExpenses, setTotalAmount } = useContext(ExpenseContext);
  const firstname = localStorage.getItem("firstname");
  const lastname = localStorage.getItem("lastname");

  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [amount, setAmount] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(6);
  const [editingIndex, setEditingIndex] = useState(null);
  
  // Silinecek öğe için state
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(null);

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
    if (name && date && amount) {
      const updatedExpense = { name, date, amount: parseFloat(amount) };
  
      if (editingIndex !== null) {
        // Güncellenen masrafı eski yerine koy
        const newExpenses = [...expenses];
        newExpenses[editingIndex] = updatedExpense;
        setExpenses(newExpenses);
        setEditingIndex(null); // Düzenleme işlemi bitti
        toast.success("Expense updated successfully!", { position: "top-right" });
      } else {
        // Yeni masraf ekle
        setExpenses([...expenses, updatedExpense]);
        toast.success("Expense added successfully!", { position: "top-right" });
      }
  
      setName("");
      setDate("");
      setAmount("");
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
    setEditingIndex(index); // Düzenlenecek masrafın indeksini sakla
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
 

  return (
    <div className="expense" style={{ textAlign: "center", padding: "20px" }}>
          <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", padding: "0 16px" }}>
        <button onClick={() => navigate("/home")} style={{ background: "none", border: "none", cursor: "pointer" }}>
          <ArrowBackIosNewIcon style={{ color: "darkblue", fontWeight: "bold", fontSize: "30px" }} />
        </button>
        <Typography variant="h4" gutterBottom style={{ flexGrow: 1, textAlign: "center" }}>
          Expense Tracker
        </Typography>
        <div style={{ width: "40px" }}></div>
      </div>

      <Typography variant="h6" color="green" sx={{ fontWeight: "bold" }}>
        Add A New Item
      </Typography>

      <div style={{ marginBottom: "20px" }}>
        <TextField label="Name" variant="outlined" value={name} onChange={(e) => setName(e.target.value)} style={{ marginRight: "10px" }} />
        <TextField type="date" variant="outlined" value={date} onChange={(e) => setDate(e.target.value)} sx={{ minWidth: 200, marginRight: "10px" }} />
        <TextField label="Amount (₺)" variant="outlined" value={amount} onChange={(e) => setAmount(e.target.value)} style={{ marginRight: "10px" }} />
        <Button variant="contained" color="success" onClick={addExpense}>
          Add Expense
        </Button>
      </div>

      <TableContainer component={Paper} style={{ maxWidth: "1500px", margin: "auto", backgroundColor: "darkgray" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><b>User</b></TableCell>
              <TableCell><b>Expense Name</b></TableCell>
              <TableCell><b>Expense Date</b></TableCell>
              <TableCell><b>Expense Amount</b></TableCell>
              <TableCell><b>Actions</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {expenses.length > 0 ? (
              expenses.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((expense, index) => (
                <TableRow key={index}>
                  <TableCell>{firstname} {lastname}</TableCell>
                  <TableCell>{expense.name}</TableCell>
                  <TableCell>{expense.date}</TableCell>
                  <TableCell>{expense.amount} ₺</TableCell>
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
                <TableCell colSpan={5} align="center" sx={{ backgroundColor: "gray", color: "white", fontWeight: "bold" }}>
                  No expenses added yet!
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[6, 12, 18]}
          component="div"
          count={expenses.length}
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
    </div>
  );
};

export default ExpenseTracker;
