import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
  TablePagination,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Box,
  Chip,
  Avatar,
  useMediaQuery,
} from "@mui/material";
import { ArrowUpward, ArrowDownward, MonetizationOn, AttachMoney, TrendingUp, TrendingDown } from "@mui/icons-material";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { useNavigate } from "react-router-dom";

const currencyEmojis = {
  USD: "🇺🇸",
  EUR: "🇪🇺",
  GBP: "🇬🇧",
  CHF: "🇨🇭",
  JPY: "🇯🇵",
  RUB: "🇷🇺",
  CNY: "🇨🇳",
  AUD: "🇦🇺",
  CAD: "🇨🇦",
  SAR: "🇸🇦",
  KWD: "🇰🇼",
  DKK: "🇩🇰",
  NOK: "🇳🇴",
  SEK: "🇸🇪",
  BGN: "🇧🇬",
  IRR: "🇮🇷",
  AZN: "🇦🇿",
  AED: "🇦🇪",
  // ... diğerleri
};

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
  const isMobile = useMediaQuery('(max-width:600px)');

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
  const handleClose = () => setOpen(false);
  const handleConfirm = () => {
    const price = transactionType === "Buy" ? parseFloat(currencies[selectedCurrency]?.Alış) : parseFloat(currencies[selectedCurrency]?.Satış);
    const totalCost = (amount * price).toFixed(4);
    // Burada gerçek işlem yapılabilir
    handleClose();
  };
  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #e0e7ff 0%, #f0fdfa 100%)',
      py: isMobile ? 1 : 2,
      px: isMobile ? 0 : 1,
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Soft SVG Wave/Pattern Background */}
      <Box sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
      }}>
        <svg width="100%" height="100%" viewBox="0 0 1440 320" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ position: 'absolute', top: 0, left: 0 }}>
          <path fill="#a5b4fc" fillOpacity="0.13" d="M0,160L60,170.7C120,181,240,203,360,197.3C480,192,600,160,720,133.3C840,107,960,85,1080,101.3C1200,117,1320,171,1380,197.3L1440,224L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z" />
        </svg>
        <svg width="100%" height="100%" viewBox="0 0 1440 320" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ position: 'absolute', bottom: 0, left: 0 }}>
          <path fill="#38bdf8" fillOpacity="0.10" d="M0,288L60,272C120,256,240,224,360,197.3C480,171,600,149,720,154.7C840,160,960,192,1080,197.3C1200,203,1320,181,1380,170.7L1440,160L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z" />
        </svg>
      </Box>
      {/* Paper Glow Effect */}
      <Box sx={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        width: isMobile ? '98vw' : '90vw',
        height: isMobile ? '90vh' : '80vh',
        zIndex: 1,
        filter: 'blur(60px)',
        opacity: 0.25,
        background: 'radial-gradient(circle at 60% 40%, #3b82f6 0%, #a5b4fc 60%, transparent 100%)',
      }} />
      <Paper elevation={8} sx={{
        maxWidth: 1100,
        mx: 'auto',
        borderRadius: 5,
        p: isMobile ? 0.5 : 2,
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.18)',
        zIndex: 2,
        position: 'relative',
      }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
          <Button onClick={() => navigate("/home")} sx={{ minWidth: 0, p: 1, borderRadius: 2, bgcolor: '#e0e7ff', '&:hover': { bgcolor: '#c7d2fe' } }}>
            <ArrowBackIosNewIcon sx={{ color: '#1e3a8a', fontWeight: 'bold', fontSize: 30 }} />
          </Button>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <MonetizationOn sx={{ fontSize: 38, color: 'primary.main', mr: 1 }} />
            <Typography variant={isMobile ? 'h5' : 'h4'} fontWeight={800} color="primary.main" sx={{ letterSpacing: 1 }}>
              Currency Exchange
            </Typography>
          </Box>
          <Box sx={{ width: 40 }}></Box>
        </Box>
        {/* Table */}
        <TableContainer sx={{ borderRadius: 4, boxShadow: 3, background: 'rgba(255,255,255,0.95)' }}>
          <Table>
            <TableHead>
              <TableRow sx={{ background: 'linear-gradient(90deg, #3b82f6 0%, #06b6d4 100%)' }}>
                <TableCell sx={{ color: 'white', fontWeight: 700, fontSize: 16 }}>Currency</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 700, fontSize: 16 }}>Type</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 700, fontSize: 16 }}>Purchase</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 700, fontSize: 16 }}>Sales</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 700, fontSize: 16 }}>Change</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 700, fontSize: 16 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Object.keys(currencies).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((key) => {
                const isAlisUp = parseFloat(currencies[key].Alış) > (parseFloat(prevCurrencies[key]?.Alış) || 0);
                const isSatisUp = parseFloat(currencies[key].Satış) > (parseFloat(prevCurrencies[key]?.Satış) || 0);
                const isChangeDown = currencies[key].Değişim.includes("%-");
                return (
                  <TableRow
                    key={key}
                    hover
                    sx={{
                      transition: 'background 0.2s',
                      '&:hover': { background: 'rgba(59,130,246,0.08)' },
                    }}
                  >
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <span style={{ fontSize: 24 }}>{currencyEmojis[key] || '💱'}</span>
                        <Typography fontWeight={700}>{key}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip label={currencies[key].Tür} color="info" size="small" sx={{ fontWeight: 600, fontSize: 13, px: 1.5, bgcolor: '#e0e7ff' }} />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Typography fontWeight={600}>{currencies[key].Alış}</Typography>
                        {isAlisUp ? <TrendingUp sx={{ color: 'success.main', fontSize: 18 }} /> : <TrendingDown sx={{ color: 'error.main', fontSize: 18 }} />}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Typography fontWeight={600}>{currencies[key].Satış}</Typography>
                        {isSatisUp ? <TrendingUp sx={{ color: 'success.main', fontSize: 18 }} /> : <TrendingDown sx={{ color: 'error.main', fontSize: 18 }} />}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={currencies[key].Değişim}
                        size="small"
                        sx={{
                          bgcolor: isChangeDown ? '#fee2e2' : '#dcfce7',
                          color: isChangeDown ? '#b91c1c' : '#166534',
                          fontWeight: 700,
                          fontSize: 13,
                          px: 1.5,
                        }}
                        icon={isChangeDown ? <TrendingDown sx={{ color: '#b91c1c', fontSize: 18 }} /> : <TrendingUp sx={{ color: '#166534', fontSize: 18 }} />}
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        sx={{
                          background: 'linear-gradient(90deg, #22c55e 0%, #16a34a 100%)',
                          color: 'white',
                          fontWeight: 700,
                          borderRadius: 2,
                          px: 2.5,
                          boxShadow: 2,
                          mr: 1,
                          '&:hover': { background: 'linear-gradient(90deg, #16a34a 0%, #22c55e 100%)' },
                        }}
                        onClick={() => handleOpen(key, "Buy")}
                      >
                        Buy
                      </Button>
                      <Button
                        variant="contained"
                        sx={{
                          background: 'linear-gradient(90deg, #ef4444 0%, #b91c1c 100%)',
                          color: 'white',
                          fontWeight: 700,
                          borderRadius: 2,
                          px: 2.5,
                          boxShadow: 2,
                          '&:hover': { background: 'linear-gradient(90deg, #b91c1c 0%, #ef4444 100%)' },
                        }}
                        onClick={() => handleOpen(key, "Sell")}
                      >
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
          sx={{ mt: 2, borderRadius: 2, bgcolor: 'rgba(255,255,255,0.7)' }}
        />
        {/* Dialog */}
        <Dialog open={open} onClose={handleClose} PaperProps={{ sx: { borderRadius: 4, p: 2, minWidth: isMobile ? 280 : 400, background: 'linear-gradient(135deg, #f0fdfa 0%, #e0e7ff 100%)' } }}>
          <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1, fontWeight: 800, fontSize: 22, color: 'primary.main', pb: 0 }}>
            <AttachMoney sx={{ fontSize: 32, color: 'success.main', mr: 1 }} />
            {transactionType} {selectedCurrency}
          </DialogTitle>
          <DialogContent sx={{ pt: 1 }}>
            <Typography sx={{ mb: 1, fontWeight: 600, color: 'text.secondary' }}>
              Current {transactionType} Price: <span style={{ color: '#0ea5e9', fontWeight: 700 }}>{transactionType === "Buy" ? currencies[selectedCurrency]?.Alış : currencies[selectedCurrency]?.Satış}</span>
            </Typography>
            <TextField
              label="Amount"
              type="number"
              fullWidth
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              margin="dense"
              sx={{
                bgcolor: '#f1f5f9',
                borderRadius: 2,
                '& .MuiInputBase-root': { fontWeight: 700, fontSize: 18 },
              }}
            />
            {amount && (
              <Typography sx={{ mt: 1, fontWeight: 600, color: 'text.secondary' }}>
                Total: <span style={{ color: '#16a34a', fontWeight: 700 }}>{((amount || 0) * (transactionType === "Buy" ? parseFloat(currencies[selectedCurrency]?.Alış) : parseFloat(currencies[selectedCurrency]?.Satış) || 0)).toFixed(4)} ₺</span>
              </Typography>
            )}
          </DialogContent>
          <DialogActions sx={{ pb: 2, pt: 1 }}>
            <Button onClick={handleClose} color="secondary" variant="outlined" sx={{ fontWeight: 700, borderRadius: 2, px: 3 }}>Cancel</Button>
            <Button onClick={handleConfirm} color="primary" variant="contained" sx={{ fontWeight: 700, borderRadius: 2, px: 3, background: 'linear-gradient(90deg, #3b82f6 0%, #06b6d4 100%)', '&:hover': { background: 'linear-gradient(90deg, #06b6d4 0%, #3b82f6 100%)' } }}>Confirm</Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </Box>
  );
};

export default CurrencyList;
