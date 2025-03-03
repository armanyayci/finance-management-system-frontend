import React, { useState, useEffect,useContext} from "react";
import { ExpenseContext } from "../components/Context/ExpenseContext"; 
import "../Style/ExpensePage.css";
import { MenuItem, Button, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from "@mui/material";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { useNavigate } from "react-router-dom";

const paymentType = ["Cash", "Card"];

const ExpenseTracker = () => {
  const navigate = useNavigate();
  const { expenses, setExpenses,setTotalAmount } = useContext(ExpenseContext);
  // Sayfa yüklendiğinde localStorage'dan veriyi çek
  

  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [amount, setAmount] = useState("");
  const [payType, setPayType] = useState("");
  
  useEffect(() => {
    const savedExpenses = localStorage.getItem("expenses");
    if (savedExpenses) {
      setExpenses(JSON.parse(savedExpenses));  // Context'in içindeki expenses'i güncelle
    }
  }, [setExpenses]);

  // expenses değiştiğinde localStorage'a kaydet
  useEffect(() => {
    localStorage.setItem("expenses", JSON.stringify(expenses));
    const total = expenses.reduce((acc, curr) => acc + parseFloat(curr.amount || 0), 0);
    setTotalAmount(total);  // Toplam harcamayı güncelliyoruz
  }, [expenses,setTotalAmount]);

  const addExpense = () => {
    if (name && date && amount) {
      const newExpenses = [...expenses, { name,date, amount: parseFloat(amount), payType }];
      setExpenses(newExpenses);
      setName("");
      setDate("");
      setAmount("");
      setPayType("");
    }
  };

  const deleteExpense = (index) => {
    const newExpenses = expenses.filter((_, i) => i !== index);
    setExpenses(newExpenses);
  };

  const updateExpense = (index) => {
    const expenseToUpdate = expenses[index];
    setName(expenseToUpdate.name);
    setDate(expenseToUpdate.date);
    setAmount(expenseToUpdate.amount);
    setPayType(expenseToUpdate.payType);
    deleteExpense(index);
  };

  return (
    <div className="expense" style={{ textAlign: "center", padding: "20px" }}>
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
        <TextField label="Amount ($)" variant="outlined" value={amount} onChange={(e) => setAmount(e.target.value)} style={{ marginRight: "10px" }} />
        <TextField select label="Payment type" variant="outlined" value={payType} onChange={(e) => setPayType(e.target.value)} style={{ marginRight: "10px", minWidth: 200 }}>
          {paymentType.map((type) => (
            <MenuItem key={type} value={type}>
              {type}
            </MenuItem>
          ))}
        </TextField>
        <Button variant="contained" color="success" onClick={addExpense}>
          Add Expense
        </Button>
      </div>

      <TableContainer component={Paper} style={{ maxWidth: "1500px", margin: "auto", backgroundColor: "darkgray" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><b>Name</b></TableCell>
              <TableCell><b>Date</b></TableCell>
              <TableCell><b>Amount</b></TableCell>
              <TableCell><b>Payment Type</b></TableCell>
              <TableCell><b>Actions</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {expenses.length > 0 ? (
              expenses.map((expense, index) => (
                <TableRow key={index}>
                  <TableCell>{expense.name}</TableCell>
                  <TableCell>{expense.date}</TableCell>
                  <TableCell>${expense.amount}</TableCell>
                  <TableCell>{expense.payType}</TableCell>
                  <TableCell>
                    <Button variant="contained" color="primary" onClick={() => updateExpense(index)} style={{ marginRight: "5px" }}>
                      Update
                    </Button>
                    <Button variant="contained" color="error" onClick={() => deleteExpense(index)}>
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
      </TableContainer>
    </div>
  );
};

export default ExpenseTracker;

