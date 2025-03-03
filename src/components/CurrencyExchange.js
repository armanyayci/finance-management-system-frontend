import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  IconButton,
  MenuItem,
  Typography,
  CircularProgress,
} from "@mui/material";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";

const currencies = ["USD", "EUR", "GBP", "TRY"];
const api_key = "a5d02b58b6de647874dc3f0a";
const url = `https://v6.exchangerate-api.com/v6/${api_key}/pair/`;

const CurrencyExchange = ({ open, handleClose }) => {
  const [amount, setAmount] = useState("");
  const [fromCurrency, setFromCurrency] = useState("");
  const [toCurrency, setToCurrency] = useState("");
  const [convertedAmount, setConvertedAmount] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSwap = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const isConvertEnabled = amount.trim() !== "" && fromCurrency !== "" && toCurrency !== "";

  // Döviz çevirme işlemini gerçekleştiren fonksiyon
  const convertCurrency = async (amountValue, from, to) => {
    if (!amountValue || !from || !to) return;

    setLoading(true);
    setError("");
    setConvertedAmount(null);

    try {
      const response = await fetch(`${url}${from}/${to}/${amountValue}`);
      const data = await response.json();

      if (data.result === "success") {
        setConvertedAmount(data.conversion_result);
      } else {
        setError("Döviz çevirme işlemi başarısız!");
      }
    } catch (err) {
      setError("Bağlantı hatası!");
    }

    setLoading(false);
  };

  // amount, fromCurrency veya toCurrency değiştiğinde otomatik API çağrısı yap
  useEffect(() => {
    if (isConvertEnabled) {
      const timer = setTimeout(() => {
        convertCurrency(amount, fromCurrency, toCurrency);
      }, 500); // 500ms debounce ile gereksiz çağrıları engelle

      return () => clearTimeout(timer);
    }
  }, [amount, fromCurrency, toCurrency]);

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Currency Converter</DialogTitle>
      <DialogContent style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: 30 }}>
        <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 20 }}>
          <TextField 
            label="Amount *" 
            variant="standard" 
            type="number"
            value={amount} 
            onChange={(e) => setAmount(e.target.value)} 
          />
          <TextField
            select
            label="From *"
            variant="standard"
            value={fromCurrency}
            onChange={(e) => setFromCurrency(e.target.value)}
            style={{ width: 100 }}
          >
            {currencies.map((currency) => (
              <MenuItem key={currency} value={currency}>
                {currency}
              </MenuItem>
            ))}
          </TextField>
          <IconButton onClick={handleSwap}>
            <SwapHorizIcon />
          </IconButton>
          <TextField
            select
            label="To *"
            variant="standard"
            value={toCurrency}
            onChange={(e) => setToCurrency(e.target.value)}
            style={{ width: 100 }}
          >
            {currencies.map((currency) => (
              <MenuItem key={currency} value={currency}>
                {currency}
              </MenuItem>
            ))}
          </TextField>
        </div>

        {/* Yükleme durumu */}
        {loading ? <CircularProgress size={24} style={{ marginTop: 10 }} /> : null}

        {/* Sonuç Gösterme Alanı */}
        {convertedAmount !== null && !loading && (
          <Typography variant="h6" style={{ marginTop: 20 }}>
            {amount} {fromCurrency} = {convertedAmount.toFixed(2)} {toCurrency}
          </Typography>
        )}

        {/* Hata Mesajı */}
        {error && (
          <Typography color="error" style={{ marginTop: 10 }}>
            {error}
          </Typography>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CurrencyExchange;

