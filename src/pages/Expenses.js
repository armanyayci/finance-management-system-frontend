import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  Paper,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Tooltip,
} from "@mui/material";
import { Add, Edit, Delete, Alarm, Repeat } from "@mui/icons-material";
import ApiService from "../components/service/ApiService";
import { useNavigate } from "react-router-dom";

const CATEGORIES = [
  "Rent",
  "Bill",
  "Food",
  "Transport",
  "Entertainment",
  "Health",
  "Shopping",
  "Other",
];

const ExpensePlanner = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [form, setForm] = useState({
    name: "",
    amount: "",
    category: CATEGORIES[0],
    date: new Date().toISOString().slice(0, 10),
    description: "",
    isRecurring: false,
    paid: false,
  });
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "" });
  const navigate = useNavigate();

  // Fetch expenses on mount
  useEffect(() => {
    const fetchExpenses = async () => {
      setLoading(true);
      try {
        const userId = localStorage.getItem("userId");
        if (userId) {
          const res = await ApiService.getExpenses(userId);
          // API response: assume res.data is an array of ExpenseDTO
          setExpenses(Array.isArray(res.data) ? res.data : []);
        } else {
          setExpenses([]);
        }
      } catch (e) {
        setExpenses([]);
      } finally {
        setLoading(false);
      }
    };
    fetchExpenses();
  }, []);

  // Alert for due/overdue expenses
  const today = new Date().toISOString().slice(0, 10);
  const dueExpenses = expenses.filter(
    (e) =>
      e.lastPaymentDate === today &&
      (e.isPaid === false || e.isPaid === undefined)
  );

  // Handlers
  const handleOpenDialog = (expense, idx) => {
    if (expense) {
      setForm({
        name: expense.name || "",
        amount: expense.amount || "",
        category: expense.category || CATEGORIES[0],
        date: expense.lastPaymentDate || new Date().toISOString().slice(0, 10),
        description: expense.description || "",
        isRecurring: !!expense.isRecurring,
      });
      setEditIndex(idx);
    } else {
      setForm({
        name: "",
        amount: "",
        category: CATEGORIES[0],
        date: new Date().toISOString().slice(0, 10),
        description: "",
        isRecurring: false,
      });
      setEditIndex(null);
    }
    setOpenDialog(true);
  };
  const handleCloseDialog = () => setOpenDialog(false);
  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };
  const handleSave = async () => {
    if (!form.name || !form.amount || !form.date) {
      setSnackbar({
        open: true,
        message: "Name, amount and date are required.",
      });
      return;
    }
    const userId = localStorage.getItem("userId");
    if (!userId) {
      setSnackbar({ open: true, message: "User not found." });
      return;
    }
    try {
      const expenseDTO = {
        id:
          editIndex !== null && expenses[editIndex]?.id
            ? expenses[editIndex].id
            : null,
        name: form.name,
        description: form.description,
        amount: parseFloat(form.amount),
        category: form.category,
        lastPaymentDate: form.date,
        isRecurring: form.isRecurring,
        isPaid:
          editIndex !== null && expenses[editIndex]?.isPaid !== undefined
            ? expenses[editIndex].isPaid
            : false,
      };
      if (editIndex !== null && expenses[editIndex]?.id) {
        // Update existing expense
        await ApiService.updateExpense(expenses[editIndex].id, expenseDTO);
        setSnackbar({ open: true, message: "Expense updated." });
      } else {
        // Add new expense
        await ApiService.addExpense(userId, expenseDTO);
        setSnackbar({ open: true, message: "Expense added." });
      }
      // Refresh list
      const res = await ApiService.getExpenses(userId);
      setExpenses(Array.isArray(res.data) ? res.data : []);
    } catch (e) {
      setSnackbar({ open: true, message: "API error." });
    }
    setOpenDialog(false);
  };
  const handleDelete = async (idx) => {
    if (idx === null || idx === undefined || !expenses[idx]?.id) {
      setDeleteIndex(null);
      setSnackbar({ open: true, message: "Expense not found." });
      return;
    }
    try {
      await ApiService.deleteExpense(expenses[idx].id);
      const userId = localStorage.getItem("userId");
      // Refresh list
      const res = await ApiService.getExpenses(userId);
      setExpenses(Array.isArray(res.data) ? res.data : []);
      setSnackbar({ open: true, message: "Expense deleted." });
    } catch (e) {
      setSnackbar({ open: true, message: "API error." });
    }
    setDeleteIndex(null);
  };
  const handleMarkPaid = async (idx) => {
    if (idx === null || idx === undefined || !expenses[idx]?.id) {
      setSnackbar({ open: true, message: "Expense not found." });
      return;
    }
    try {
      const expense = expenses[idx];
      const updatedExpense = { ...expense, isPaid: true };
      await ApiService.updateExpense(expense.id, updatedExpense);
      const userId = localStorage.getItem("userId");
      // Refresh list
      const res = await ApiService.getExpenses(userId);
      setExpenses(Array.isArray(res.data) ? res.data : []);
      setSnackbar({ open: true, message: "Marked as paid." });
    } catch (e) {
      setSnackbar({ open: true, message: "API error." });
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "linear-gradient(135deg, #e0e7ff 0%, #f0fdfa 100%)",
        py: 4,
        px: 1,
        background: "linear-gradient(135deg, #e0e7ff 0%, #f0fdfa 100%)",
      }}
    >
      <Box
        maxWidth={900}
        mx="auto"
        boxShadow={6}
        borderRadius={5}
        p={4}
        bgcolor="#f8fafc"
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
        >
          <Typography
            variant="h4"
            fontWeight={800}
            color="primary"
            textAlign="center"
            sx={{ letterSpacing: 1, textShadow: "0 2px 8px #c7d2fe" }}
          >
            Expense Planner & Reminder
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            sx={{
              fontWeight: 700,
              borderRadius: 2,
              ml: 2,
              background: "linear-gradient(90deg, #6366f1 0%, #0ea5e9 100%)",
            }}
            onClick={() => navigate("/home")}
          >
            Back to Main Menu
          </Button>
        </Box>
        {/* DUE ALERT */}
        {dueExpenses.length > 0 && (
          <Paper
            elevation={6}
            sx={{
              mb: 3,
              p: 2,
              bgcolor: "#fffbe6",
              border: "2px solid #f59e42",
              color: "#b45309",
              display: "flex",
              alignItems: "center",
              gap: 2,
              fontWeight: 700,
              fontSize: 18,
              animation: "blinker 1s linear infinite",
              borderRadius: 3,
              boxShadow: 4,
            }}
          >
            <Alarm sx={{ color: "#f59e42", fontSize: 32 }} />
            <span>
              Payment due for: {dueExpenses.map((e) => e.name).join(", ")}
            </span>
            <style>{`@keyframes blinker { 50% { opacity: 0.3; } }`}</style>
          </Paper>
        )}
        {/* ADD BUTTON */}
        <Box display="flex" justifyContent="flex-end" mb={2}>
          <Button
            variant="contained"
            color="success"
            startIcon={<Add />}
            onClick={() => handleOpenDialog()}
            sx={{
              fontWeight: 700,
              borderRadius: 2,
              background: "linear-gradient(90deg, #22d3ee 0%, #2563eb 100%)",
              boxShadow: 3,
              px: 3,
              py: 1.2,
              fontSize: 18,
            }}
          >
            Add Expense
          </Button>
        </Box>
        {/* EXPENSE TABLE */}
        <TableContainer
          component={Paper}
          sx={{
            borderRadius: 4,
            boxShadow: 6,
            background: "linear-gradient(120deg, #f1f5f9 60%, #e0f2fe 100%)",
            mb: 4,
            overflowX: 'auto',
          }}
        >
          <Table sx={{ minWidth: 800 }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ p: 1.5, fontSize: 16, whiteSpace: 'nowrap' }}><b>Name</b></TableCell>
                <TableCell sx={{ p: 1.5, fontSize: 16, whiteSpace: 'nowrap' }}><b>Amount</b></TableCell>
                <TableCell sx={{ p: 1.5, fontSize: 16, whiteSpace: 'nowrap' }}><b>Category</b></TableCell>
                <TableCell sx={{ p: 1.5, fontSize: 16, whiteSpace: 'nowrap' }}><b>Date</b></TableCell>
                <TableCell sx={{ p: 1.5, fontSize: 16, whiteSpace: 'nowrap', maxWidth: 180 }}><b>Description</b></TableCell>
                <TableCell sx={{ p: 1.5, fontSize: 16, whiteSpace: 'nowrap' }}><b>Recurring</b></TableCell>
                <TableCell sx={{ p: 1.5, fontSize: 16, whiteSpace: 'nowrap' }}><b>Status</b></TableCell>
                <TableCell align="right" sx={{ p: 1.5, fontSize: 16, whiteSpace: 'nowrap' }}><b>Actions</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {expenses.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    align="center"
                    sx={{ color: "gray", fontWeight: 700, p: 2, fontSize: 16 }}
                  >
                    No expenses found.
                  </TableCell>
                </TableRow>
              ) : (
                expenses.map((exp, idx) => {
                  const isDue =
                    exp.lastPaymentDate && exp.lastPaymentDate <= today;
                  const isPaid = exp.isPaid === true;
                  return (
                    <TableRow
                      key={idx}
                      sx={
                        isPaid
                          ? { bgcolor: "#e6fbe6", fontWeight: 700 }
                          : isDue
                          ? {
                              bgcolor: "#fffbe6",
                              fontWeight: 700,
                              animation: "blinker 1s linear infinite",
                            }
                          : {}
                      }
                    >
                      <TableCell sx={{ p: 1.5, fontSize: 16, wordBreak: 'break-word', maxWidth: 180 }}>{exp.name}</TableCell>
                      <TableCell sx={{ p: 1.5, fontSize: 16, whiteSpace: 'nowrap' }}>{Number(exp.amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ₺</TableCell>
                      <TableCell sx={{ p: 1.5, fontSize: 16, wordBreak: 'break-word' }}><Chip label={exp.category} color="primary" size="small" /></TableCell>
                      <TableCell sx={{ p: 1.5, fontSize: 16, whiteSpace: 'nowrap' }}>{exp.lastPaymentDate}</TableCell>
                      <TableCell sx={{ p: 1.5, fontSize: 16, wordBreak: 'break-word', maxWidth: 180 }}>{exp.description}</TableCell>
                      <TableCell sx={{ p: 1.5, fontSize: 16, wordBreak: 'break-word' }}>{exp.isRecurring ? <Tooltip title="Recurring"><Repeat color="info" fontSize="small" /></Tooltip> : "-"}</TableCell>
                      <TableCell sx={{ p: 1.5, fontSize: 16, wordBreak: 'break-word' }}>
                        {isPaid ? (
                          <Chip label="Paid" color="success" size="small" sx={{ fontWeight: 700 }} />
                        ) : isDue ? (
                          <Chip label="Due" color="error" size="small" />
                        ) : (
                          <Chip label="Planned" color="info" size="small" />
                        )}
                      </TableCell>
                      <TableCell align="right" sx={{ p: 1.5, fontSize: 16, wordBreak: 'break-word' }}>
                        <IconButton color="primary" onClick={() => handleOpenDialog(exp, idx)} size="medium"><Edit fontSize="medium" /></IconButton>
                        <IconButton color="error" onClick={() => setDeleteIndex(idx)} size="medium"><Delete fontSize="medium" /></IconButton>
                        <Button
                          variant="outlined"
                          color="success"
                          size="medium"
                          sx={{ ml: 1, fontWeight: 700, borderRadius: 2, minWidth: 0, px: 1.5, py: 0.5, fontSize: 14 }}
                          onClick={() => handleMarkPaid(idx)}
                          disabled={isPaid}
                        >
                          {isPaid ? "Paid" : "Mark as Paid"}
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
        {/* ADD/EDIT DIALOG */}
        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          maxWidth="sm"
          fullWidth
        >
          <Box
            sx={{
              bgcolor: "#2563eb",
              color: "white",
              px: 3,
              py: 2,
              borderTopLeftRadius: 8,
              borderTopRightRadius: 8,
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              background: "linear-gradient(90deg, #6366f1 0%, #0ea5e9 100%)",
            }}
          >
            <Add sx={{ fontSize: 28, mr: 1 }} />
            <Typography variant="h6" fontWeight={700} sx={{ flex: 1 }}>
              {editIndex !== null ? "Edit Expense" : "Add Expense"}
            </Typography>
          </Box>
          <DialogContent
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 3,
              py: 3,
              bgcolor: "#f3f6fd",
              borderBottomLeftRadius: 8,
              borderBottomRightRadius: 8,
              background: "linear-gradient(120deg, #f1f5f9 60%, #e0f2fe 100%)",
            }}
          >
            <TextField
              label="Name"
              name="name"
              value={form.name}
              onChange={handleFormChange}
              required
              fullWidth
              InputProps={{
                startAdornment: <Add sx={{ color: "#2563eb", mr: 1 }} />,
              }}
              sx={{ bgcolor: "white", borderRadius: 2 }}
            />
            <TextField
              label="Amount (₺)"
              name="amount"
              type="number"
              value={form.amount}
              onChange={handleFormChange}
              required
              fullWidth
              InputProps={{
                startAdornment: (
                  <span
                    style={{
                      color: "#22c55e",
                      fontWeight: 700,
                      marginRight: 8,
                    }}
                  >
                    ₺
                  </span>
                ),
              }}
              sx={{ bgcolor: "white", borderRadius: 2 }}
            />
            <TextField
              select
              label="Category"
              name="category"
              value={form.category}
              onChange={handleFormChange}
              fullWidth
              InputProps={{
                startAdornment: <Repeat sx={{ color: "#6366f1", mr: 1 }} />,
              }}
              sx={{ bgcolor: "white", borderRadius: 2 }}
            >
              {CATEGORIES.map((cat) => (
                <MenuItem key={cat} value={cat}>
                  {cat}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Payment Date"
              name="date"
              type="date"
              value={form.date}
              onChange={handleFormChange}
              required
              fullWidth
              InputLabelProps={{ shrink: true }}
              InputProps={{
                startAdornment: <Alarm sx={{ color: "#f59e42", mr: 1 }} />,
              }}
              sx={{ bgcolor: "white", borderRadius: 2 }}
            />
            <TextField
              label="Description"
              name="description"
              value={form.description}
              onChange={handleFormChange}
              fullWidth
              multiline
              minRows={2}
              InputProps={{
                startAdornment: <Edit sx={{ color: "#64748b", mr: 1 }} />,
              }}
              sx={{ bgcolor: "white", borderRadius: 2 }}
            />
            <Box display="flex" alignItems="center" gap={1.5}>
              <input
                type="checkbox"
                id="isRecurring"
                name="isRecurring"
                checked={form.isRecurring}
                onChange={handleFormChange}
                style={{ accentColor: "#6366f1", width: 20, height: 20 }}
              />
              <label
                htmlFor="isRecurring"
                style={{ fontWeight: 600, color: "#6366f1", fontSize: 16 }}
              >
                Recurring
              </label>
            </Box>
          </DialogContent>
          <DialogActions
            sx={{
              bgcolor: "#f3f6fd",
              pb: 3,
              pt: 2,
              px: 3,
              borderBottomLeftRadius: 8,
              borderBottomRightRadius: 8,
              background: "linear-gradient(120deg, #f1f5f9 60%, #e0f2fe 100%)",
            }}
          >
            <Button
              onClick={handleCloseDialog}
              sx={{
                fontWeight: 700,
                borderRadius: 2,
                bgcolor: "#e0e7ef",
                color: "#334155",
                "&:hover": { bgcolor: "#cbd5e1" },
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              variant="contained"
              sx={{
                fontWeight: 700,
                borderRadius: 2,
                bgcolor: "#2563eb",
                "&:hover": { bgcolor: "#1d4ed8" },
              }}
            >
              Save
            </Button>
          </DialogActions>
        </Dialog>
        {/* DELETE CONFIRMATION */}
        <Dialog
          open={deleteIndex !== null}
          onClose={() => setDeleteIndex(null)}
        >
          <DialogTitle sx={{ fontWeight: 700, color: "#dc2626", fontSize: 22 }}>
            Delete Expense
          </DialogTitle>
          <DialogContent
            sx={{ fontWeight: 500, color: "#334155", fontSize: 18 }}
          >
            Are you sure you want to delete this expense?
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setDeleteIndex(null)}
              sx={{
                fontWeight: 700,
                borderRadius: 2,
                bgcolor: "#e0e7ef",
                color: "#334155",
                "&:hover": { bgcolor: "#cbd5e1" },
              }}
            >
              Cancel
            </Button>
            <Button
              color="error"
              onClick={() => handleDelete(deleteIndex)}
              variant="contained"
              sx={{ fontWeight: 700, borderRadius: 2 }}
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
        {/* SNACKBAR */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={2500}
          onClose={() => setSnackbar({ open: false, message: "" })}
          message={snackbar.message}
        />
      </Box>
    </Box>
  );
};

export default ExpensePlanner;
