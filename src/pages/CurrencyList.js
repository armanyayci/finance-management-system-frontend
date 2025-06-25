import React, { useEffect, useState } from "react";
import axios from "axios";
import ApiService from "../components/service/ApiService";
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
  Tooltip,
  Tabs,
  Tab,
  TableSortLabel,
} from "@mui/material";
import { ArrowUpward, ArrowDownward, MonetizationOn, AttachMoney, TrendingUp, TrendingDown } from "@mui/icons-material";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { useNavigate } from "react-router-dom";
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import TrendingFlatIcon from '@mui/icons-material/TrendingFlat';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import Popover from '@mui/material/Popover';

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
  const [search, setSearch] = useState("");
  const [highlighted, setHighlighted] = useState({});
  const [tab, setTab] = useState(0); // 0: Buy, 1: Sell
  const [orderBy, setOrderBy] = useState('Currency');
  const [order, setOrder] = useState('asc');
  const [userAccount, setUserAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userCurrencies, setUserCurrencies] = useState([]);
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();
  const isMobile = useMediaQuery('(max-width:600px)');
  const [anchorEl, setAnchorEl] = useState(null);

  // Üstte gösterilecek ana kurlar
  const mainCurrencies = [
    { code: 'USD', label: 'USD' },
    { code: 'EUR', label: 'EUR' },
    { code: 'GBP', label: 'GBP' },
  ];

  // Bilgi kartları için hesaplamalar
  const currencyKeys = Object.keys(currencies).filter(key => key !== "" && currencies[key]?.Alış);
  const totalCount = currencyKeys.length;
  let maxChange = null, minChange = null;
  currencyKeys.forEach(key => {
    const change = parseFloat((currencies[key].Değişim || "0").replace("%", ""));
    if (maxChange === null || change > maxChange.value) maxChange = { key, value: change };
    if (minChange === null || change < minChange.value) minChange = { key, value: change };
  });

  // Fiyat değişimi animasyonu
  useEffect(() => {
    const newHighlighted = {};
    currencyKeys.forEach(key => {
      if (prevCurrencies[key] && currencies[key]) {
        if (currencies[key].Alış !== prevCurrencies[key].Alış) {
          newHighlighted[key] = currencies[key].Alış > prevCurrencies[key].Alış ? 'up' : 'down';
        }
      }
    });
    setHighlighted(newHighlighted);
    if (Object.keys(newHighlighted).length > 0) {
      const timeout = setTimeout(() => setHighlighted({}), 900);
      return () => clearTimeout(timeout);
    }
  }, [currencies]);

  // Fetch user account data
  useEffect(() => {
    const fetchUserAccount = async () => {
      try {
        const username = localStorage.getItem("username"); // Assuming username is stored in localStorage
        if (username) {
          const accountData = await ApiService.GetAccountInfoByUsername(username);
          setUserAccount(accountData);
        }
      } catch (error) {
        console.error("Error fetching account data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserAccount();
  }, []);

  // Kullanıcı ID'sini ve sahip olduğu dövizleri çek
  useEffect(() => {
    const fetchUserIdAndCurrencies = async () => {
      const username = localStorage.getItem("username");
      if (!username) return;
      try {
        const users = await ApiService.GetAllUsers();
        const user = Array.isArray(users) ? users.find(u => u.username === username) : null;
        if (user) {
          setUserId(user.id);
          const userCurrenciesRes = await ApiService.getUserCurrencies(user.id);
          if (userCurrenciesRes.success && Array.isArray(userCurrenciesRes.data)) {
            setUserCurrencies(userCurrenciesRes.data);
          }
        }
      } catch (err) {
        setUserCurrencies([]);
      }
    };
    fetchUserIdAndCurrencies();
  }, []);

  useEffect(() => {
    if (tab === 1) {
      const fetchUserIdAndCurrencies = async () => {
        const username = localStorage.getItem("username");
        if (!username) return;
        try {
          const users = await ApiService.GetAllUsers();
          const user = Array.isArray(users) ? users.find(u => u.username === username) : null;
          if (user) {
            setUserId(user.id);
            const userCurrenciesRes = await ApiService.getUserCurrencies(user.id);
            if (userCurrenciesRes.success && Array.isArray(userCurrenciesRes.data)) {
              setUserCurrencies(userCurrenciesRes.data);
            }
          }
        } catch (err) {
          setUserCurrencies([]);
        }
      };
      fetchUserIdAndCurrencies();
    }
  }, [tab]);

  // Arama filtreleme (sekme bazlı)
  const filteredKeys = tab === 1
    ? userCurrencies
        .filter(c => c.amount > 0 && currencies[c.currencyName])
        .filter(c => c.currencyName.toLowerCase().includes(search.toLowerCase()) || (currencies[c.currencyName]?.Tür || "").toLowerCase().includes(search.toLowerCase()))
        .map(c => c.currencyName)
    : currencyKeys.filter(key => key.toLowerCase().includes(search.toLowerCase()) || (currencies[key].Tür || "").toLowerCase().includes(search.toLowerCase()));

  // Sıralama fonksiyonu için değişim değerini doğru parse et
  const parseChange = (str) => parseFloat((str || '0').replace('%', '').replace(',', '.'));

  // Sıralama fonksiyonu
  const handleSort = (column) => {
    if (orderBy === column) {
      setOrder(order === 'asc' ? 'desc' : 'asc');
    } else {
      setOrderBy(column);
      setOrder('asc');
    }
  };

  // Sıralanmış anahtarlar
  const sortedKeys = [...filteredKeys].sort((a, b) => {
    let aVal, bVal;
    switch (orderBy) {
      case 'Currency':
        aVal = a;
        bVal = b;
        break;
      case 'Type':
        aVal = currencies[a].Tür || '';
        bVal = currencies[b].Tür || '';
        break;
      case 'Purchase':
        aVal = parseFloat(currencies[a].Alış) || 0;
        bVal = parseFloat(currencies[b].Alış) || 0;
        break;
      case 'Sales':
        aVal = parseFloat(currencies[a].Satış) || 0;
        bVal = parseFloat(currencies[b].Satış) || 0;
        break;
      case 'Change':
        aVal = parseChange(currencies[a].Değişim);
        bVal = parseChange(currencies[b].Değişim);
        break;
      default:
        aVal = a;
        bVal = b;
    }
    if (typeof aVal === 'string') {
      return order === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    } else {
      return order === 'asc' ? aVal - bVal : bVal - aVal;
    }
  });

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
  const handleConfirm = async () => {
    try {
      if (transactionType === "Buy") {
        const username = localStorage.getItem("username");
        if (!username) {
          alert("User not logged in");
          return;
        }

        // Fetch all users and find the userId by username
        const users = await ApiService.GetAllUsers();
        const user = Array.isArray(users) ? users.find(u => u.username === username) : null;
        if (!user) {
          alert("User not found");
          return;
        }
        const userId = user.id;

        const rawRate = currencies[selectedCurrency]?.Alış;
        const conversionRate = parseFloat(fixPrice(rawRate));
        
        const currencyConversionRequest = {
          fromCurrency: "TRY",
          toCurrency: selectedCurrency,
          amount: parseFloat(amount),
          conversionRate: conversionRate,
          userId: userId
        };

        const response = await ApiService.buyCurrency(currencyConversionRequest);
        
        alert(`Successfully purchased ${amount} ${selectedCurrency}`);
        
        // Refresh account data after successful transaction
        if (username) {
          const updatedAccountData = await ApiService.GetAccountInfoByUsername(username);
          setUserAccount(updatedAccountData);
        }
        window.location.reload();
      } else if (transactionType === "Sell") {
        const username = localStorage.getItem("username");
        if (!username) {
          alert("User not logged in");
          return;
        }
        // Fetch all users and find the userId by username
        const users = await ApiService.GetAllUsers();
        const user = Array.isArray(users) ? users.find(u => u.username === username) : null;
        if (!user) {
          alert("User not found");
          return;
        }
        const userId = user.id;
        const rawRate = currencies[selectedCurrency]?.Satış;
        const conversionRate = parseFloat(fixPrice(rawRate));
        const currencyConversionRequest = {
          fromCurrency: selectedCurrency,
          toCurrency: "TRY",
          amount: parseFloat(amount),
          conversionRate: conversionRate,
          userId: userId
        };
        const response = await ApiService.sellCurrency(currencyConversionRequest);
        if (response.success) {
          alert(`Successfully sold ${amount} ${selectedCurrency}`);
          // Refresh account data after successful transaction
          if (username) {
            const updatedAccountData = await ApiService.GetAccountInfoByUsername(username);
            setUserAccount(updatedAccountData);
          }
          window.location.reload();
        } else {
          alert(response.message || "Sell operation failed!");
        }
      }
      
      handleClose();
    } catch (error) {
      console.error("Transaction failed:", error);
      alert(`Transaction failed: ${error.response?.data?.message || error.message}`);
    }
  };
  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Helper to fix price string (remove thousands separator, convert decimal comma to dot)
  const fixPrice = (priceStr) => priceStr ? priceStr.replace(/\./g, '').replace(',', '.') : '0';

  const handlePopoverOpen = (event) => setAnchorEl(event.currentTarget);
  const handlePopoverClose = () => setAnchorEl(null);
  const openPopover = Boolean(anchorEl);

  // Show loading state
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <Typography variant="h6" color="white">Loading account data...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #232946 0%, #3b82f6 60%, #f0fdfa 100%)',
      py: isMobile ? 1 : 2,
      px: isMobile ? 0 : 1,
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Soft SVG/Finance Illustration Background */}
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
          <defs>
            <linearGradient id="waveGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6366f1" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.10" />
            </linearGradient>
          </defs>
          <path fill="url(#waveGrad)" d="M0,160L60,170.7C120,181,240,203,360,197.3C480,192,600,160,720,133.3C840,107,960,85,1080,101.3C1200,117,1320,171,1380,197.3L1440,224L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z" />
        </svg>
        <svg width="100%" height="100%" viewBox="0 0 1440 320" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ position: 'absolute', bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id="waveGrad2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.10" />
              <stop offset="100%" stopColor="#6366f1" stopOpacity="0.13" />
            </linearGradient>
          </defs>
          <path fill="url(#waveGrad2)" d="M0,288L60,272C120,256,240,224,360,197.3C480,171,600,149,720,154.7C840,160,960,192,1080,197.3C1200,203,1320,181,1380,170.7L1440,160L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z" />
        </svg>
        {/* Finans temalı soft ikon */}
        <TrendingFlatIcon sx={{ position: 'absolute', right: 60, top: 60, fontSize: 180, color: '#64748b', opacity: 0.07, zIndex: 0 }} />
        <AccountBalanceWalletIcon sx={{ position: 'absolute', left: 40, bottom: 40, fontSize: 160, color: '#3b82f6', opacity: 0.06, zIndex: 0 }} />
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
        background: 'radial-gradient(circle at 60% 40%, #6366f1 0%, #0ea5e9 60%, transparent 100%)',
      }} />
      <Paper elevation={12} sx={{
        maxWidth: 1100,
        mx: 'auto',
        borderRadius: 5,
        p: isMobile ? 0.5 : 2,
        boxShadow: '0 12px 48px 0 rgba(31, 38, 135, 0.22)',
        zIndex: 2,
        position: 'relative',
        backdropFilter: 'blur(6px)',
        background: 'rgba(30,41,59,0.93)',
      }}>
        {/* Sağ üst köşe döviz butonu */}
        <Box sx={{ position: 'absolute', top: 18, right: 24, zIndex: 10, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Tooltip title="View your owned currencies and balances" arrow>
            <Button
              variant="contained"
              color="info"
              sx={{
                borderRadius: 50,
                minWidth: 0,
                p: 1.2,
                boxShadow: 4,
                background: 'linear-gradient(90deg, #0ea5e9 0%, #6366f1 100%)',
                border: '2px solid #38bdf8',
                display: 'flex',
                alignItems: 'center',
                transition: 'box-shadow 0.2s, border 0.2s',
                '&:hover': {
                  boxShadow: 8,
                  border: '2.5px solid #2563eb',
                  background: 'linear-gradient(90deg, #6366f1 0%, #0ea5e9 100%)',
                },
              }}
              onClick={handlePopoverOpen}
            >
              <AccountBalanceIcon sx={{ fontSize: 28, color: 'white', mr: 1 }} />
              <span style={{ fontWeight: 800, fontSize: 16, color: 'white', letterSpacing: 0.5 }}>My Currencies</span>
            </Button>
          </Tooltip>
          <Popover
            open={openPopover}
            anchorEl={anchorEl}
            onClose={handlePopoverClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            PaperProps={{
              sx: { p: 2, borderRadius: 3, minWidth: 220, bgcolor: '#f1f5f9', boxShadow: 6 }
            }}
            disableRestoreFocus
          >
            <Typography sx={{ fontWeight: 800, fontSize: 18, mb: 1, color: '#0e7490' }}>My Currencies</Typography>
            {userCurrencies.length === 0 ? (
              <Typography sx={{ color: '#64748b', fontWeight: 600 }}>No currencies owned.</Typography>
            ) : (
              userCurrencies.map((c) => (
                <Box key={c.currencyName} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                  <span style={{ fontWeight: 700, color: '#232946' }}>{c.currencyName}</span>
                  <span style={{ fontWeight: 700, color: '#0e7490' }}>{c.amount}</span>
                </Box>
              ))
            )}
          </Popover>
        </Box>
        {/* Bakiye ve Ana Dövizler */}
        <Box sx={{
          display: 'flex',
          flexWrap: isMobile ? 'wrap' : 'nowrap',
          alignItems: 'center',
          gap: isMobile ? 1.5 : 2.5,
          mb: 3,
          justifyContent: isMobile ? 'center' : 'space-between',
        }}>
          {/* Bakiye kutusu - Updated to use real balance */}
          <Box
            sx={{
              minWidth: isMobile ? 140 : 180,
              px: isMobile ? 1.5 : 2.5,
              py: isMobile ? 1.2 : 1.7,
              borderRadius: 3,
              background: 'linear-gradient(90deg, #0ea5e9 0%, #6366f1 100%)',
              color: 'white',
              fontWeight: 900,
              fontSize: isMobile ? 17 : 22,
              boxShadow: '0 2px 12px 0 rgba(59,130,246,0.18)',
              display: 'flex',
              alignItems: 'center',
              gap: 1.2,
              position: 'relative',
              border: '2px solid #3b82f6',
              transition: 'box-shadow 0.3s',
              '&:hover': {
                boxShadow: '0 0 0 4px #6366f144',
              },
            }}
          >
            <AccountBalanceWalletIcon sx={{ fontSize: isMobile ? 20 : 28, color: 'white', mr: 1 }} />
            <span style={{fontWeight:900}}>
              {userAccount?.data?.balance ? 
                userAccount.data.balance.toLocaleString('en-US', {minimumFractionDigits:2}) : 
                '0.00'
              }
            </span>
            <span style={{fontSize:isMobile?12:15, fontWeight:700, marginLeft:6}}>₺</span>
          </Box>
        </Box>
        {/* Sekmeler */}
        <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2, borderRadius: 3, bgcolor: 'rgba(99,102,241,0.13)', minHeight: 48 }} TabIndicatorProps={{ style: { background: 'linear-gradient(90deg, #3b82f6 0%, #06b6d4 100%)', height: 5, borderRadius: 2 } }}>
          <Tab label="Buy" sx={{ fontWeight: 800, fontSize: 19, minWidth: 140, color: tab === 0 ? '#e0e7ff' : '#64748b', letterSpacing: 1 }} />
          <Tab label="Sell" sx={{ fontWeight: 800, fontSize: 19, minWidth: 140, color: tab === 1 ? '#e0e7ff' : '#64748b', letterSpacing: 1 }} />
        </Tabs>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
          <Button onClick={() => navigate("/home")} sx={{ minWidth: 0, p: 1, borderRadius: 2, bgcolor: '#232946', '&:hover': { bgcolor: '#3b82f6' } }}>
            <ArrowBackIosNewIcon sx={{ color: '#e0e7ff', fontWeight: 'bold', fontSize: 32 }} />
          </Button>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <MonetizationOn sx={{ fontSize: 44, color: '#e0e7ff', mr: 1 }} />
            <Typography variant={isMobile ? 'h5' : 'h4'} fontWeight={900} color="#e0e7ff" sx={{ letterSpacing: 2, fontSize: isMobile ? 26 : 32 }}>
              Currency Exchange
            </Typography>
          </Box>
          <Box sx={{ width: 40 }}></Box>
        </Box>
        {/* Bilgi Kartları ve Arama */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2, alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Chip label={`Total: ${totalCount}`} color="primary" sx={{ fontWeight: 800, fontSize: 17, px: 2, bgcolor: '#232946', color: '#e0e7ff', border: '2px solid #3b82f6' }} />
            {maxChange && <Chip label={`Top Gainer: ${maxChange.key} (${currencies[maxChange.key]?.Değişim || ''})`} color="success" sx={{ fontWeight: 800, fontSize: 17, px: 2, bgcolor: '#dcfce7', color: '#166534', border: '2px solid #22c55e' }} />}
            {minChange && <Chip label={`Top Loser: ${minChange.key} (${currencies[minChange.key]?.Değişim || ''})`} color="error" sx={{ fontWeight: 800, fontSize: 17, px: 2, bgcolor: '#fee2e2', color: '#b91c1c', border: '2px solid #ef4444' }} />}
          </Box>
          <TextField
            size="small"
            variant="outlined"
            placeholder="Search currency..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            sx={{ width: 240, bgcolor: '#232946', borderRadius: 2, color: '#e0e7ff', input: { color: '#e0e7ff', fontWeight: 700, fontSize: 17 } }}
            InputProps={{ style: { color: '#e0e7ff', fontWeight: 700, fontSize: 17 } }}
          />
        </Box>
        {/* Table */}
        <TableContainer sx={{ borderRadius: 4, boxShadow: 3, background: 'rgba(30,41,59,0.98)' }}>
          <Table>
            <TableHead>
              <TableRow sx={{ background: 'linear-gradient(90deg, #6366f1 0%, #0ea5e9 100%)' }}>
                <TableCell sx={{ color: 'white', fontWeight: 900, fontSize: 18, letterSpacing: 1, cursor: 'pointer' }}>
                  <TableSortLabel
                    active={orderBy === 'Currency'}
                    direction={orderBy === 'Currency' ? order : 'asc'}
                    onClick={() => handleSort('Currency')}
                    sx={{ color: 'white', '& .MuiTableSortLabel-icon': { color: 'white !important' } }}
                  >
                    Currency
                  </TableSortLabel>
                </TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 900, fontSize: 18, letterSpacing: 1, cursor: 'pointer' }}>
                  <TableSortLabel
                    active={orderBy === 'Type'}
                    direction={orderBy === 'Type' ? order : 'asc'}
                    onClick={() => handleSort('Type')}
                    sx={{ color: 'white', '& .MuiTableSortLabel-icon': { color: 'white !important' } }}
                  >
                    Type
                  </TableSortLabel>
                </TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 900, fontSize: 18, letterSpacing: 1, cursor: 'pointer' }}>
                  <TableSortLabel
                    active={orderBy === 'Purchase'}
                    direction={orderBy === 'Purchase' ? order : 'desc'}
                    onClick={() => handleSort('Purchase')}
                    sx={{ color: 'white', '& .MuiTableSortLabel-icon': { color: 'white !important' } }}
                  >
                    Purchase
                  </TableSortLabel>
                </TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 900, fontSize: 18, letterSpacing: 1, cursor: 'pointer' }}>
                  <TableSortLabel
                    active={orderBy === 'Sales'}
                    direction={orderBy === 'Sales' ? order : 'desc'}
                    onClick={() => handleSort('Sales')}
                    sx={{ color: 'white', '& .MuiTableSortLabel-icon': { color: 'white !important' } }}
                  >
                    Sales
                  </TableSortLabel>
                </TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 900, fontSize: 18, letterSpacing: 1, cursor: 'pointer' }}>
                  <TableSortLabel
                    active={orderBy === 'Change'}
                    direction={orderBy === 'Change' ? order : 'desc'}
                    onClick={() => handleSort('Change')}
                    sx={{ color: 'white', '& .MuiTableSortLabel-icon': { color: 'white !important' } }}
                  >
                    Change
                  </TableSortLabel>
                </TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 900, fontSize: 18, letterSpacing: 1 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedKeys.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((key) => {
                const isAlisUp = parseFloat(currencies[key].Alış) > (parseFloat(prevCurrencies[key]?.Alış) || 0);
                const isSatisUp = parseFloat(currencies[key].Satış) > (parseFloat(prevCurrencies[key]?.Satış) || 0);
                const isChangeDown = currencies[key].Değişim.includes("%-");
                const highlight = highlighted[key];
                return (
                  <TableRow
                    key={key}
                    hover
                    sx={{
                      transition: 'background 0.5s',
                      background: highlight === 'up' ? 'rgba(34,197,94,0.18)' : highlight === 'down' ? 'rgba(239,68,68,0.18)' : undefined,
                      '&:hover': { background: 'rgba(59,130,246,0.13)' },
                    }}
                  >
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <span style={{ fontSize: 28 }}>{currencyEmojis[key] || '💱'}</span>
                        <Tooltip title={`Currency: ${key}\nType: ${currencies[key].Tür || ''}`} arrow>
                          <Typography fontWeight={900} sx={{ cursor: 'pointer', textDecoration: 'underline dotted #3b82f6 1.5px', color: '#e0e7ff', fontSize: 18 }}>{key}</Typography>
                        </Tooltip>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip label={currencies[key].Tür} color="info" size="medium" sx={{ fontWeight: 800, fontSize: 15, px: 2, bgcolor: '#e0e7ff', color: '#232946', border: '2px solid #3b82f6' }} />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Typography fontWeight={900} sx={{ color: '#e0e7ff', fontSize: 17 }}>{currencies[key].Alış}</Typography>
                        {isAlisUp ? <TrendingUp sx={{ color: 'success.main', fontSize: 22 }} /> : <TrendingDown sx={{ color: 'error.main', fontSize: 22 }} />}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Typography fontWeight={900} sx={{ color: '#e0e7ff', fontSize: 17 }}>{currencies[key].Satış}</Typography>
                        {isSatisUp ? <TrendingUp sx={{ color: 'success.main', fontSize: 22 }} /> : <TrendingDown sx={{ color: 'error.main', fontSize: 22 }} />}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={currencies[key].Değişim}
                        size="medium"
                        sx={{
                          bgcolor: isChangeDown ? '#fee2e2' : '#dcfce7',
                          color: isChangeDown ? '#b91c1c' : '#166534',
                          fontWeight: 900,
                          fontSize: 15,
                          px: 2,
                          border: isChangeDown ? '2px solid #ef4444' : '2px solid #22c55e',
                          boxShadow: highlight ? (highlight === 'up' ? '0 0 12px 2px #22c55e55' : '0 0 12px 2px #ef444455') : undefined,
                        }}
                        icon={isChangeDown ? <TrendingDown sx={{ color: '#b91c1c', fontSize: 22 }} /> : <TrendingUp sx={{ color: '#166534', fontSize: 22 }} />}
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        sx={{
                          background: 'linear-gradient(90deg, #22c55e 0%, #16a34a 100%)',
                          color: 'white',
                          fontWeight: 900,
                          borderRadius: 2,
                          px: 2.5,
                          fontSize: 17,
                          boxShadow: 3,
                          mr: 1,
                          '&:hover': { background: 'linear-gradient(90deg, #16a34a 0%, #22c55e 100%)', filter: 'brightness(1.08)' },
                          display: tab === 0 ? 'inline-flex' : 'none',
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
                          fontWeight: 900,
                          borderRadius: 2,
                          px: 2.5,
                          fontSize: 17,
                          boxShadow: 3,
                          display: tab === 1 ? 'inline-flex' : 'none',
                          '&:hover': { background: 'linear-gradient(90deg, #b91c1c 0%, #ef4444 100%)', filter: 'brightness(1.08)' },
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
        {/* Dialog - Update to show real balance */}
        <Dialog open={open} onClose={handleClose} PaperProps={{ sx: { borderRadius: 4, p: 2, minWidth: isMobile ? 280 : 400, background: 'linear-gradient(135deg, #f0fdfa 0%, #e0e7ff 100%)' } }}>
          <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1, fontWeight: 800, fontSize: 22, color: 'primary.main', pb: 0 }}>
            <AttachMoney sx={{ fontSize: 32, color: 'success.main', mr: 1 }} />
            {transactionType} {selectedCurrency}
          </DialogTitle>
          <DialogContent sx={{ pt: 1 }}>
            <Typography sx={{ mb: 1, fontWeight: 600, color: 'text.secondary' }}>
              Current {transactionType} Price: <span style={{ color: '#0ea5e9', fontWeight: 700 }}>{transactionType === "Buy" ? currencies[selectedCurrency]?.Alış : currencies[selectedCurrency]?.Satış}</span>
            </Typography>
            {/* Updated to use real account data */}
            {transactionType === 'Buy' && (
              <Chip 
                label={`Available Balance: ${userAccount?.data?.balance ? userAccount.data.balance.toLocaleString('en-US', {minimumFractionDigits:2}) : '0.00'} ₺`} 
                color="primary" 
                sx={{ mb: 1, fontWeight: 700, bgcolor: '#e0e7ff', color: '#1e3a8a' }} 
              />
            )}
            {transactionType === 'Sell' && (
              <Chip 
                label={`Available: ${userCurrencies.find(c => c.currencyName === selectedCurrency)?.amount || 0}`} 
                color="info" 
                sx={{ mb: 1, fontWeight: 700, bgcolor: '#f1f5f9', color: '#0e7490' }} 
              />
            )}
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
                Total: <span style={{ color: '#16a34a', fontWeight: 700 }}>
                  {(
                    (amount || 0) *
                    (transactionType === "Buy"
                      ? parseFloat(fixPrice(currencies[selectedCurrency]?.Alış))
                      : parseFloat(fixPrice(currencies[selectedCurrency]?.Satış))
                    )
                  ).toFixed(4)} ₺
                </span>
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
