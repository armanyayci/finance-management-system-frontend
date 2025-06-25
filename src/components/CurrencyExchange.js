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
  Box,
  Chip,
  Tooltip,
  Slide,
} from "@mui/material";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';

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
  const [rate, setRate] = useState(null);

  const handleSwap = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const isConvertEnabled = amount.trim() !== "" && fromCurrency !== "" && toCurrency !== "" && fromCurrency !== toCurrency && parseFloat(amount) > 0;

  // Döviz çevirme işlemini gerçekleştiren fonksiyon
  const convertCurrency = async (amountValue, from, to) => {
    if (!amountValue || !from || !to || from === to || parseFloat(amountValue) <= 0) return;
    setLoading(true);
    setError("");
    setConvertedAmount(null);
    setRate(null);
    try {
      const response = await fetch(`${url}${from}/${to}/${amountValue}`);
      const data = await response.json();
      if (data.result === "success") {
        setConvertedAmount(data.conversion_result);
        setRate(data.conversion_rate);
      } else {
        setError("Currency conversion failed!");
      }
    } catch (err) {
      setError("Connection error!");
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

  // Modern kart ve badge stilleri
  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth TransitionComponent={Slide} TransitionProps={{ direction: 'down' }} PaperProps={{
      sx: {
        borderRadius: 5,
        p: 0,
        background: 'linear-gradient(135deg, #f0fdfa 0%, #e0e7ff 100%)',
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.18)',
        overflow: 'visible',
      }
    }}>
      <Box sx={{ position: 'relative', px: 0, pt: 0, pb: 2 }}>
        {/* Büyük ikon ve başlık */}
        <Box sx={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          pt: 4, pb: 2, borderTopLeftRadius: 20, borderTopRightRadius: 20,
          background: 'linear-gradient(90deg, #3b82f6 0%, #06b6d4 100%)',
          boxShadow: '0 2px 16px 0 rgba(59,130,246,0.10)',
        }}>
          <MonetizationOnIcon sx={{ fontSize: 48, color: 'white', mb: 1, filter: 'drop-shadow(0 2px 8px #38bdf8)' }} />
          <DialogTitle sx={{ color: 'white', fontWeight: 800, fontSize: 26, letterSpacing: 1, p: 0, mb: 0.5 }}>Currency Converter</DialogTitle>
          <Typography sx={{ color: 'white', fontSize: 14, opacity: 0.85, fontWeight: 500 }}>Convert between major currencies instantly</Typography>
        </Box>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 3, pt: 2 }}>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
            <TextField
              label="Amount *"
              variant="outlined"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              size="small"
              sx={{ width: 110, background: '#f1f5f9', borderRadius: 2 }}
              inputProps={{ min: 0, step: 'any', placeholder: '0.00' }}
              helperText={parseFloat(amount) <= 0 && amount !== "" ? "Enter a positive amount" : ""}
              error={parseFloat(amount) <= 0 && amount !== ""}
            />
            <TextField
              select
              label="From *"
              variant="outlined"
              value={fromCurrency}
              onChange={(e) => setFromCurrency(e.target.value)}
              size="small"
              sx={{ width: 90, background: '#f1f5f9', borderRadius: 2 }}
            >
              {currencies.map((currency) => (
                <MenuItem key={currency} value={currency}>{currency}</MenuItem>
              ))}
            </TextField>
            <Tooltip title="Swap currencies" arrow>
              <IconButton onClick={handleSwap} sx={{ mx: 0.5, bgcolor: '#e0e7ff', '&:hover': { bgcolor: '#bae6fd' }, borderRadius: 2 }}>
                <SwapHorizIcon sx={{ color: '#3b82f6', fontSize: 28 }} />
              </IconButton>
            </Tooltip>
            <TextField
              select
              label="To *"
              variant="outlined"
              value={toCurrency}
              onChange={(e) => setToCurrency(e.target.value)}
              size="small"
              sx={{ width: 90, background: '#f1f5f9', borderRadius: 2 }}
            >
              {currencies.map((currency) => (
                <MenuItem key={currency} value={currency}>{currency}</MenuItem>
              ))}
            </TextField>
          </Box>

          {/* Uyarı badge */}
          {fromCurrency === toCurrency && fromCurrency !== "" && (
            <Chip label="Select different currencies" color="warning" sx={{ mb: 1, fontWeight: 700 }} />
          )}

          {/* Yükleme durumu */}
          {loading && <CircularProgress size={28} sx={{ mt: 2, color: '#3b82f6' }} />}

          {/* Sonuç Gösterme Alanı */}
          {convertedAmount !== null && !loading && !error && (
            <Box sx={{
              mt: 3, mb: 1, px: 3, py: 2, borderRadius: 3,
              background: 'linear-gradient(90deg, #22c55e 0%, #16a34a 100%)',
              color: 'white', fontWeight: 800, fontSize: 22, boxShadow: '0 2px 12px 0 rgba(34,197,94,0.10)',
              display: 'flex', flexDirection: 'column', alignItems: 'center',
            }}>
              <span>{amount} {fromCurrency} = {convertedAmount.toFixed(2)} {toCurrency}</span>
              {rate && <span style={{ fontSize: 13, fontWeight: 500, opacity: 0.85, marginTop: 2 }}>1 {fromCurrency} = {rate.toFixed(4)} {toCurrency}</span>}
            </Box>
          )}

          {/* Hata Mesajı */}
          {error && (
            <Chip label={error} color="error" sx={{ mt: 2, fontWeight: 700, fontSize: 15, px: 2, py: 1 }} />
          )}
        </DialogContent>
      </Box>
    </Dialog>
  );
};

export default CurrencyExchange;

