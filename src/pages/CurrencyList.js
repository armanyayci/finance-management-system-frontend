import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Typography, TablePagination, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import { ArrowUpward, ArrowDownward } from "@mui/icons-material";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { useNavigate } from "react-router-dom";

const CurrencyList = () => {
  const [currencies, setCurrencies] = useState({});
  const [prevCurrencies, setPrevCurrencies] = useState({});
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [open, setOpen] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState(null);
  const [amount, setAmount] = useState("");
  const [transactionType, setTransactionType] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = () => {
      axios.get("https://finans.truncgil.com/today.json")
        .then(response => {
          const data = response.data;
          delete data["Update_Date"];
          setPrevCurrencies(currencies);
          setCurrencies(data);
        })
        .catch(error => console.error("Veri çekme hatası:", error));
    };

    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleOpen = (currency, type) => {
    setSelectedCurrency(currency);
    setTransactionType(type);
    setAmount("");
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleConfirm = () => {
    const price = transactionType === "Buy" ? parseFloat(currencies[selectedCurrency]?.Alış) : parseFloat(currencies[selectedCurrency]?.Satış);
    const totalCost = (amount * price).toFixed(4);
    console.log(`${selectedCurrency} için ${transactionType} işlemi gerçekleştirildi. Miktar: ${amount}, Toplam TRY: ${totalCost}`);
    handleClose();
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Paper style={{ padding: "20px", textAlign: "center", backgroundColor: "darkgray" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", padding: "0 16px" }}>
        <button onClick={() => navigate("/home")} style={{ background: "none", border: "none", cursor: "pointer" }}>
          <ArrowBackIosNewIcon style={{ color: "darkblue", fontWeight: "bold", fontSize: "30px" }} />
        </button>
        <Typography variant="h4" gutterBottom style={{ flexGrow: 1, textAlign: "center" }}>
          Currency Exchange
        </Typography>
        <div style={{ width: "40px" }}></div>
      </div>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Currency</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Purchase</TableCell>
              <TableCell>Sales</TableCell>
              <TableCell>Changes</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.keys(currencies).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((key) => {
              const isAlisUp = parseFloat(currencies[key].Alış) > (parseFloat(prevCurrencies[key]?.Alış) || 0);
              const isSatisUp = parseFloat(currencies[key].Satış) > (parseFloat(prevCurrencies[key]?.Satış) || 0);
              
              return (
                <TableRow key={key}>
                  <TableCell>{key}</TableCell>
                  <TableCell>{currencies[key].Tür}</TableCell>
                  <TableCell>
                    {currencies[key].Alış} {isAlisUp ? <ArrowUpward color="success" /> : <ArrowDownward color="error" />}
                  </TableCell>
                  <TableCell>
                    {currencies[key].Satış} {isSatisUp ? <ArrowUpward color="success" /> : <ArrowDownward color="error" />}
                  </TableCell>
                  <TableCell style={{ color: currencies[key].Değişim.includes("%-") ? "red" : "green" }}>
                    {currencies[key].Değişim} 
                    {currencies[key].Değişim.includes("%-") ? <ArrowDownward color="error" /> : <ArrowUpward color="success" />}
                  </TableCell>
                  <TableCell>
                    <Button variant="contained" color="success" onClick={() => handleOpen(key, "Buy")}>
                      Buy
                    </Button>
                    <Button variant="contained" color="error" onClick={() => handleOpen(key, "Sell")} style={{ marginLeft: 10 }}>
                      Sell
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={Object.keys(currencies).length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[10, 25, 50, 100]}
      />

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{transactionType} {selectedCurrency}</DialogTitle>
        <DialogContent>
          <Typography>Current {transactionType} Price: {transactionType === "Buy" ? currencies[selectedCurrency]?.Alış : currencies[selectedCurrency]?.Satış}</Typography>
          <TextField 
            label="Amount"
            type="number"
            fullWidth
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            margin="dense"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">Cancel</Button>
          <Button onClick={handleConfirm} color="primary">Confirm</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default CurrencyList;
