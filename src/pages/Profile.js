import React, { useEffect, useState } from "react";
import ApiService from "../components/service/ApiService";
import Sidebar from "../components/Sidebar";
import {
  Avatar,
  Button,
  TextField,
  Paper,
  Divider,
  CircularProgress,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Typography,
  Box,
  Tooltip,
  Select,
  MenuItem,
} from "@mui/material";
import {
  UserCircleIcon,
  LockClosedIcon,
  EnvelopeIcon,
  IdentificationIcon,
} from "@heroicons/react/24/outline";
import { UAParser } from "ua-parser-js";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";

const Profile = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [accountInfo, setAccountInfo] = useState(null);
  const [accountList, setAccountList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ firstname: "", lastname: "", email: "" });
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    inApp: true,
  });
  const [goal, setGoal] = useState({ amount: "", desc: "" });
  const [goals, setGoals] = useState([]);
  const [sessions] = useState([
    {
      id: 1,
      device: "Chrome (Windows)",
      ip: "192.168.1.2",
      lastActive: "Now",
      current: true,
    },
    {
      id: 2,
      device: "iPhone",
      ip: "192.168.1.3",
      lastActive: "2 hours ago",
      current: false,
    },
  ]);
  const [newAccountType, setNewAccountType] = useState("");
  const [accountOpenMsg, setAccountOpenMsg] = useState("");
  const [goalModalOpen, setGoalModalOpen] = useState(false);
  const [goalList, setGoalList] = useState([]);
  const [goalLoading, setGoalLoading] = useState(false);
  const [goalForm, setGoalForm] = useState({
    description: "",
    accountType: "TRY",
    amount: "",
  });
  const [accountsModalOpen, setAccountsModalOpen] = useState(false);
  const [openAccountLoading, setOpenAccountLoading] = useState(false);
  const [openAccountConfirmOpen, setOpenAccountConfirmOpen] = useState(false);
  const [legalChecked, setLegalChecked] = useState(false);
  const [pendingAccountType, setPendingAccountType] = useState("");
  const [totalBalanceTRY, setTotalBalanceTRY] = useState(null);
  const [exchangeRates, setExchangeRates] = useState(null);
  // Kullanıcının sahip olduğu hesap tipleri (dinamik)
  const accountTypeOptions = Array.isArray(accountList)
    ? accountList.map((acc) => ({
        value: acc.accountType,
        label: acc.accountType,
      }))
    : [];
  const username = localStorage.getItem("username");
  const parser = new UAParser();
  const uaResult = parser.getResult();
  const allAccountTypes = [
    { value: "TRY", label: "TL Account" },
    { value: "USD", label: "USD Account" },
    { value: "EUR", label: "EUR Account" },
    { value: "ALTIN", label: "Gold Account" },
  ];
  // Eğer kullanıcıda ALTIN veya AU hesabı varsa, ALTIN seçeneğini gizle
  const hasGold = accountList.some(
    (acc) => acc.accountType === "ALTIN" || acc.accountType === "AU"
  );
  const availableAccountTypes = allAccountTypes.filter((t) => {
    if (t.value === "ALTIN") {
      return !hasGold;
    }
    return !accountList.some((acc) => acc.accountType === t.value);
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const usersRes = await ApiService.GetAllUsers();
        const user = usersRes.find((u) => u.username === username);
        setUserInfo(user);
        setForm({
          firstname: user?.firstName || "",
          lastname: user?.lastName || "",
          email: user?.email || "",
        });
        // Kullanıcının twoFactorEnabled durumuna göre notifications state'ini ayarla
        setNotifications(prev => ({
          ...prev,
          email: user?.twoFactorEnabled || false
        }));
        const accountRes = await ApiService.GetAccountInfoByUsername(username);
        let accArr = Array.isArray(accountRes)
          ? accountRes
          : accountRes?.data || [];
        setAccountList(accArr);
        let mainAcc =
          accArr.find((acc) => acc.accountType === "TRY") || accArr[0] || null;
        setAccountInfo(mainAcc);
        console.log("accountInfo:", mainAcc);
      } catch (e) {
        setUserInfo(null);
        setAccountInfo(null);
      } finally {
        setLoading(false);
      }
    };
    if (username) fetchData();
  }, [username]);

  // Kur verilerini çek
  useEffect(() => {
    const fetchRates = async () => {
      try {
        const res = await fetch("https://finans.truncgil.com/today.json");
        const data = await res.json();
        setExchangeRates(data);
      } catch (e) {
        setExchangeRates(null);
      }
    };
    fetchRates();
  }, []);

  // Hesapların toplamını TRY olarak hesapla
  useEffect(() => {
    if (!accountList || !exchangeRates) {
      setTotalBalanceTRY(null);
      return;
    }
    let total = 0;
    accountList.forEach((acc) => {
      let bal = Number(acc.balance) || 0;
      if (acc.accountType === "TRY") total += bal;
      else if (acc.accountType === "USD" && exchangeRates.USD)
        total += bal * parseFloat(exchangeRates.USD.Satış.replace(",", "."));
      else if (acc.accountType === "EUR" && exchangeRates.EUR)
        total += bal * parseFloat(exchangeRates.EUR.Satış.replace(",", "."));
      else if (
        (acc.accountType === "ALTIN" || acc.accountType === "AU") &&
        exchangeRates["gram-altin"]
      )
        total +=
          bal * parseFloat(exchangeRates["gram-altin"].Satış.replace(",", "."));
    });
    setTotalBalanceTRY(total);
  }, [accountList, exchangeRates]);

  const handleEdit = () => setEditMode(true);
  const handleCancel = () => {
    setEditMode(false);
    setForm({
      firstname: userInfo?.firstName || "",
      lastname: userInfo?.lastName || "",
      email: userInfo?.email || "",
    });
  };
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });
  const handlePasswordChange = (e) =>
    setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });

  const handleSave = async () => {
    // Örnek güncelleme API isteği (mock)
    try {
      // const response = await ApiService.updateUserProfile({ ...form, username: userInfo.username });
      // setSnackbar({ open: true, message: response?.message || 'Profile updated successfully!', severity: 'success' });
      setSnackbar({
        open: true,
        message: "Profile updated successfully!",
        severity: "success",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message:
          error?.response?.data?.message ||
          error?.message ||
          "Profile update failed!",
        severity: "error",
      });
    }
    setEditMode(false);
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setSnackbar({
        open: true,
        message: "Passwords do not match!",
        severity: "error",
      });
      return;
    }
    if (!userInfo?.id) {
      setSnackbar({
        open: true,
        message: "User info not loaded!",
        severity: "error",
      });
      return;
    }
    try {
      const dto = {
        userId: userInfo.id,
        oldPassword: passwordForm.oldPassword,
        newPassword: passwordForm.newPassword,
      };
      const result = await ApiService.changePassword(dto);
      setSnackbar({
        open: true,
        message:
          result?.message ||
          (typeof result === "string"
            ? result
            : "Password changed successfully!"),
        severity: "success",
      });
      setPasswordForm({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message:
          error?.response?.data?.message ||
          error?.message ||
          "Password change failed!",
        severity: "error",
      });
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (file && userInfo?.id) {
      setAvatar(file);
      setAvatarPreview(URL.createObjectURL(file));
      try {
        const response = await ApiService.uploadProfileImage(userInfo.id, file);
        setSnackbar({
          open: true,
          message: response?.message || "Profile image updated!",
          severity: "success",
        });
        setTimeout(() => window.location.reload(), 800);
      } catch (error) {
        setSnackbar({
          open: true,
          message:
            error?.response?.data?.message ||
            error?.message ||
            "Profile image upload failed!",
          severity: "error",
        });
      }
    }
  };

  const handleNotifChange = async (e) => {
    const { name, checked } = e.target;
    setNotifications({ ...notifications, [name]: checked });
    
    // E-Mail Notifications (2FA) değiştiğinde API çağrısı yap
    if (name === 'email' && userInfo?.id) {
             try {
         const response = await ApiService.enable2FA(userInfo.id, checked);
         // API başarılı olduğunda userInfo state'ini de güncelle
         setUserInfo(prev => ({
           ...prev,
           twoFactorEnabled: checked
         }));
         setSnackbar({
           open: true,
           message: response?.message || `2FA ${checked ? 'enabled' : 'disabled'} successfully!`,
           severity: 'success',
         });
       } catch (error) {
        // API hatası durumunda checkbox'ı eski haline döndür
        setNotifications({ ...notifications, [name]: !checked });
        setSnackbar({
          open: true,
          message: error?.response?.data?.message || error?.message || `Failed to ${checked ? 'enable' : 'disable'} 2FA!`,
          severity: 'error',
        });
      }
    }
  };

  const handleGoalAdd = async (e) => {
    e.preventDefault();
    if (!goalForm.amount || !goalForm.description) return;
    try {
      const dto = [
        {
          description: goalForm.description,
          accountType: goalForm.accountType,
          amount: goalForm.amount,
          userId: userInfo.id,
        },
      ];
      const res = await ApiService.addGoal(dto);
      setSnackbar({
        open: true,
        message: res?.message || "Goal added!",
        severity: "success",
      });
      setGoalForm({ description: "", accountType: "TRY", amount: "" });
      fetchGoals();
    } catch (e) {
      setSnackbar({
        open: true,
        message: e?.response?.data?.message || "Goal add failed",
        severity: "error",
      });
    }
  };

  // Hesap açma butonuna tıklayınca onay modalı aç
  const handleOpenAccount = (e) => {
    e.preventDefault();
    if (!newAccountType) return;
    setPendingAccountType(newAccountType);
    setLegalChecked(false);
    setOpenAccountConfirmOpen(true);
  };

  // Onay modalında gerçekten hesabı aç
  const handleConfirmOpenAccount = async () => {
    if (!userInfo?.id || !pendingAccountType) return;
    setOpenAccountLoading(true);
    try {
      await ApiService.openAccount({
        userId: userInfo.id,
        accountType: pendingAccountType,
      });
      setSnackbar({
        open: true,
        message: "Account opened successfully!",
        severity: "success",
      });
      // Hesaplar tekrar yüklensin
      const accountRes = await ApiService.GetAccountInfoByUsername(username);
      let accArr = Array.isArray(accountRes)
        ? accountRes
        : accountRes?.data || [];
      setAccountList(accArr);
      setNewAccountType("");
      setPendingAccountType("");
      setOpenAccountConfirmOpen(false);
    } catch (e) {
      setSnackbar({
        open: true,
        message: e?.response?.data?.message || "Account could not be opened",
        severity: "error",
      });
    } finally {
      setOpenAccountLoading(false);
    }
  };

  const fetchGoals = async () => {
    if (!userInfo?.id) return;
    setGoalLoading(true);
    try {
      const res = await ApiService.getGoals(userInfo.id);
      setGoalList(Array.isArray(res?.data) ? res.data : []);
    } catch (e) {
      setSnackbar({
        open: true,
        message: e?.response?.data?.message || "Goals could not be loaded",
        severity: "error",
      });
    } finally {
      setGoalLoading(false);
    }
  };

  const handleGoalModalOpen = () => {
    setGoalModalOpen(true);
    fetchGoals();
  };
  const handleGoalModalClose = () => {
    setGoalModalOpen(false);
    setGoalForm({ description: "", accountType: "TRY", amount: "" });
  };
  const handleGoalFormChange = (e) => {
    setGoalForm({ ...goalForm, [e.target.name]: e.target.value });
  };
  const handleGoalDelete = async (goalId) => {
    try {
      const res = await ApiService.deleteGoal(goalId);
      setSnackbar({
        open: true,
        message: res?.message || "Goal deleted!",
        severity: "success",
      });
      fetchGoals();
    } catch (e) {
      setSnackbar({
        open: true,
        message: e?.response?.data?.message || "Goal delete failed",
        severity: "error",
      });
    }
  };

  const handleAccountsModalOpen = () => setAccountsModalOpen(true);
  const handleAccountsModalClose = () => setAccountsModalOpen(false);

  // Kullanıcı image verisini base64'e çeviren yardımcı fonksiyon
  const getUserImageSrc = () => {
    if (userInfo?.image) {
      // image byte array ise base64 stringe çevir
      return `data:image/jpeg;base64,${userInfo.image}`;
    }
    return avatarPreview || undefined;
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 relative overflow-hidden">
      {/* Dolphin görseli sağ alt köşede, sola bakacak şekilde, responsive ve efektli */}
      <img
        src="/dolphin.png"
        alt="Dolphin"
        className="fixed md:absolute right-[-120px] bottom-[-60px] md:right-[-80px] md:bottom-[-40px] pointer-events-none select-none animate-dolphin-float dolphin-responsive"
        style={{
          width: "700px",
          maxWidth: "60vw",
          minWidth: "260px",
          zIndex: 1,
          opacity: 0.65,
          filter: "drop-shadow(0 8px 32px #38bdf8aa) blur(1.5px)",
          transform: "scaleX(-1) rotate(-8deg)",
          objectFit: "cover",
          objectPosition: "bottom right",
        }}
      />
      {/* Deniz temalı animasyonlu arka plan SVG'leri */}
      <div className="absolute z-0 pointer-events-none w-full h-full">
        {/* Yunus balığı SVG */}
        <svg
          className="absolute left-1/2 top-10 -translate-x-1/2 animate-dolphin-float"
          width="420"
          height="220"
          viewBox="0 0 420 220"
          fill="none"
          style={{ zIndex: 0, opacity: 0.18 }}
        >
          <g>
            <path
              d="M60 180 Q120 80 260 120 Q320 140 400 60 Q380 120 320 180 Q220 240 120 200 Q80 190 60 180 Z"
              fill="#60a5fa"
            />
            <ellipse
              cx="180"
              cy="120"
              rx="90"
              ry="40"
              fill="#38bdf8"
              opacity="0.7"
            />
            <path
              d="M120 200 Q140 180 180 180 Q220 180 240 200 Q200 210 160 210 Q140 210 120 200 Z"
              fill="#2563eb"
            />
            {/* Yunus gövdesi */}
            <path
              d="M120 160 Q170 80 300 120 Q320 130 340 110 Q320 150 260 170 Q180 190 120 160 Z"
              fill="#3b82f6"
            />
            {/* Yunus yüzgeci */}
            <path
              d="M200 120 Q210 110 220 120 Q210 125 200 120 Z"
              fill="#2563eb"
            />
            {/* Yunus kuyruğu */}
            <path
              d="M300 120 Q320 110 330 130 Q320 125 300 120 Z"
              fill="#2563eb"
            />
            {/* Göz */}
            <ellipse cx="260" cy="120" rx="6" ry="6" fill="#fff" />
            <ellipse cx="262" cy="122" rx="2" ry="2" fill="#1e293b" />
          </g>
        </svg>
        {/* Küçük balıklar: sadece sağ üstteki kalsın, sol alttaki kaldırıldı */}
        <svg
          className="absolute right-24 top-40 animate-fish-swim2"
          width="60"
          height="30"
          viewBox="0 0 60 30"
          fill="none"
          style={{ opacity: 0.18 }}
        >
          <ellipse cx="30" cy="15" rx="20" ry="8" fill="#38bdf8" />
          <polygon points="50,15 60,10 60,20" fill="#38bdf8" />
          <ellipse cx="43" cy="15" rx="1.5" ry="1.5" fill="#fff" />
        </svg>
        {/* Deniz dalgası SVG: z-index yükseltildi */}
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 1440 160"
          fill="none"
          className="absolute bottom-0 left-0 animate-wave z-20"
          style={{ marginLeft: "320px", width: "calc(100% - 320px)" }}
        >
          <path
            d="M0,80 C360,160 1080,0 1440,80 L1440,160 L0,160 Z"
            fill="#38bdf8"
            fillOpacity="0.13"
          />
        </svg>
      </div>
      <Sidebar />
      <div className="flex-1 flex flex-col items-center justify-center py-10 px-4 md:px-16 relative z-10">
        {/* Profil kartı animasyonlu ve gölgeli */}
        <Paper
          elevation={12}
          className="w-full max-w-3xl p-4 md:p-8 rounded-3xl shadow-2xl bg-white/95 animate-modal-pop relative overflow-visible flex flex-col"
          style={{
            maxHeight: "calc(100vh - 48px)",
            minHeight: "480px",
            overflowY: "auto",
            justifyContent: "flex-start",
            alignItems: "center",
            margin: "auto",
          }}
        >
          {/* 2 kolonlu grid düzeni */}
          <div className="w-full flex flex-col md:flex-row gap-8">
            {/* SOL KISIM: Avatar, rozetler, özet bilgiler */}
            <div className="flex-1 flex flex-col items-center gap-6 min-w-[220px] max-w-xs">
              {/* Rozetler */}
              <div className="flex flex-wrap gap-2 justify-center mb-2 mt-2">
                <span className="inline-flex items-center gap-1 bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-3 py-1 rounded-full font-semibold shadow animate-bounce-badge border-2 border-white text-sm">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <circle cx="9" cy="9" r="9" fill="#fbbf24" />
                    <text
                      x="50%"
                      y="62%"
                      textAnchor="middle"
                      fontSize="11"
                      fill="#fff"
                    >
                      🔒
                    </text>
                  </svg>
                  Secure Profile
                </span>
                <span className="inline-flex items-center gap-1 bg-gradient-to-r from-green-400 to-blue-400 text-white px-3 py-1 rounded-full font-semibold shadow animate-bounce-badge animate-glow border-2 border-white text-sm">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <circle cx="9" cy="9" r="9" fill="#34d399" />
                    <text
                      x="50%"
                      y="62%"
                      textAnchor="middle"
                      fontSize="11"
                      fill="#fff"
                    >
                      💡
                    </text>
                  </svg>
                  Smart Finance
                </span>
                <span className="inline-flex items-center gap-1 bg-gradient-to-r from-pink-400 to-yellow-400 text-white px-3 py-1 rounded-full font-semibold shadow animate-bounce-badge border-2 border-white text-sm">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <circle cx="9" cy="9" r="9" fill="#f472b6" />
                    <text
                      x="50%"
                      y="62%"
                      textAnchor="middle"
                      fontSize="11"
                      fill="#fff"
                    >
                      ⭐
                    </text>
                  </svg>
                  VIP Member
                </span>
              </div>
              {/* Avatar */}
              <div className="relative group">
                <Avatar
                  sx={{
                    width: 110,
                    height: 110,
                    bgcolor: "#6366f1",
                    fontSize: 48,
                  }}
                  src={getUserImageSrc()}
                  className="shadow-xl border-4 border-white animate-float-slow"
                >
                  <UserCircleIcon className="w-20 h-20 text-white" />
                </Avatar>
                <label
                  className="absolute bottom-2 right-2 bg-blue-600 rounded-full p-2 cursor-pointer shadow-lg group-hover:scale-110 transition-transform"
                  title="Change Avatar"
                >
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarChange}
                  />
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15.232 5.232l3.536 3.536M9 13h6m2 2a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2h10z"
                    />
                  </svg>
                </label>
              </div>
              {/* Kullanıcı adı ve özet */}
              <div className="w-full flex flex-col items-center gap-1 mt-2">
                <h2 className="text-2xl font-bold text-indigo-700 tracking-tight flex items-center gap-2 animate-glow">
                  {userInfo
                    ? `${userInfo.firstName} ${userInfo.lastName}`
                    : "Profile"}
                </h2>
                <p className="text-gray-500 text-base">@{userInfo?.username}</p>
                <div className="flex flex-col gap-1 text-gray-700 text-sm mt-2">
                  <span className="flex items-center gap-2">
                    <EnvelopeIcon className="w-4 h-4 text-indigo-400" />{" "}
                    {userInfo?.email}
                  </span>
                  {/* Hesap tipleri ve bakiyeleri kaldırıldı. Total Balance'a tooltip eklendi. */}
                  {totalBalanceTRY !== null && (
                    <Tooltip
                      title={
                        <div
                          style={{
                            minWidth: 220,
                            background: "#f3f4f6",
                            borderRadius: 12,
                            boxShadow: "0 4px 24px 0 #0001",
                            border: "1.5px solid #e0e7ef",
                            padding: 10,
                          }}
                        >
                          {Array.isArray(accountList) &&
                          accountList.length > 0 ? (
                            accountList.map((acc) => {
                              let tryValue;
                              if (
                                acc.accountType === "USD" &&
                                exchangeRates?.USD
                              ) {
                                tryValue =
                                  (Number(acc.balance) || 0) *
                                  parseFloat(
                                    exchangeRates.USD.Satış.replace(",", ".")
                                  );
                              } else if (
                                acc.accountType === "EUR" &&
                                exchangeRates?.EUR
                              ) {
                                tryValue =
                                  (Number(acc.balance) || 0) *
                                  parseFloat(
                                    exchangeRates.EUR.Satış.replace(",", ".")
                                  );
                              } else if (
                                (acc.accountType === "ALTIN" ||
                                  acc.accountType === "AU") &&
                                exchangeRates?.["gram-altin"]
                              ) {
                                tryValue =
                                  (Number(acc.balance) || 0) *
                                  parseFloat(
                                    exchangeRates["gram-altin"].Satış.replace(
                                      ",",
                                      "."
                                    )
                                  );
                              } else if (acc.accountType === "TRY") {
                                tryValue = Number(acc.balance) || 0;
                              }
                              let icon = null;
                              let unit = acc.accountType;
                              if (
                                acc.accountType === "USD" &&
                                exchangeRates?.USD
                              ) {
                                icon = "💵";
                              } else if (
                                acc.accountType === "EUR" &&
                                exchangeRates?.EUR
                              ) {
                                icon = "💶";
                              } else if (
                                (acc.accountType === "ALTIN" ||
                                  acc.accountType === "AU") &&
                                exchangeRates?.["gram-altin"]
                              ) {
                                icon = "🥇";
                                unit = "AU";
                              } else if (acc.accountType === "TRY") {
                                icon = "₺";
                              }
                              return (
                                <div
                                  key={acc.accountType}
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 12,
                                    marginBottom: 8,
                                    background: "#fff",
                                    borderRadius: 8,
                                    boxShadow: "0 2px 8px 0 #0001",
                                    padding: "8px 14px",
                                    border: "1px solid #e5e7eb",
                                  }}
                                >
                                  <span
                                    style={{ fontSize: 26, marginRight: 4 }}
                                  >
                                    {icon}
                                  </span>
                                  <span
                                    style={{
                                      fontWeight: 700,
                                      color: "#1e293b",
                                      fontSize: 16,
                                      minWidth: 90,
                                    }}
                                  >
                                    {Number(acc.balance).toLocaleString(
                                      "en-US",
                                      { minimumFractionDigits: 2 }
                                    )}{" "}
                                    {unit}
                                  </span>
                                  {(acc.accountType === "USD" ||
                                    acc.accountType === "EUR" ||
                                    acc.accountType === "ALTIN" ||
                                    acc.accountType === "AU") && (
                                    <span
                                      style={{
                                        color: "#059669",
                                        fontWeight: 700,
                                        fontSize: 15,
                                        minWidth: 90,
                                        textAlign: "right",
                                      }}
                                    >
                                      ≈{" "}
                                      {tryValue.toLocaleString("en-US", {
                                        minimumFractionDigits: 2,
                                      })}{" "}
                                      ₺
                                    </span>
                                  )}
                                </div>
                              );
                            })
                          ) : (
                            <span style={{ color: "#64748b", fontWeight: 500 }}>
                              No account data
                            </span>
                          )}
                        </div>
                      }
                      arrow
                      placement="bottom"
                      componentsProps={{
                        tooltip: {
                          sx: {
                            backgroundColor: "#f3f4f6",
                            border: "1.5px solid #e0e7ef",
                            boxShadow: "0 4px 24px 0 #0001",
                            borderRadius: "12px",
                            color: "#1e293b",
                            padding: 0,
                          },
                        },
                        arrow: {
                          sx: {
                            color: "#f3f4f6",
                          },
                        },
                      }}
                    >
                      <span
                        className="flex items-center justify-between w-full max-w-xs md:max-w-sm text-green-700 bg-green-100 rounded-xl px-4 py-2 mb-1 mt-5 cursor-pointer shadow-lg border border-green-200 hover:bg-green-200 transition-colors"
                        style={{ minWidth: 0, letterSpacing: 0.5 }}
                      >
                        <span className="flex items-center gap-2 min-w-0">
                          <LockClosedIcon className="w-6 h-6 text-green-600 flex-shrink-0" />
                          <span
                            className="text-2xl font-bold truncate"
                            style={{ minWidth: 0 }}
                          >
                            {totalBalanceTRY.toLocaleString("en-US", {
                              minimumFractionDigits: 2,
                            })}
                          </span>
                          <span className="text-xl font-bold flex-shrink-0">
                            ₺
                          </span>
                        </span>
                        <span className="flex flex-col items-end ml-2 min-w-[60px]">
                          <span className="text-sm font-semibold text-gray-600 leading-tight">
                            Total
                          </span>
                          <span className="text-sm font-semibold text-gray-600 leading-tight">
                            Balance
                          </span>
                        </span>
                      </span>
                    </Tooltip>
                  )}
                </div>
              </div>
              {/* Güvenlik & Aktivite */}
              <Divider className="my-4" />
              <div className="w-full">
                <h3 className="text-base font-semibold text-indigo-700 mb-2">
                  Security & Recent Activity
                </h3>
                <ul className="text-gray-700 text-sm list-disc pl-5">
                  <li>
                    Last login:{" "}
                    {userInfo?.lastLogin
                      ? new Date(userInfo.lastLogin).toLocaleString()
                      : "Unknown"}
                  </li>
                  <li>
                    Account created:{" "}
                    {userInfo?.createdAt
                      ? new Date(userInfo.createdAt).toLocaleDateString()
                      : "Unknown"}
                  </li>
                  <li>
                    2FA:{" "}
                    <span className={`font-semibold ${userInfo?.twoFactorEnabled ? "text-green-600" : "text-red-600"}`}>
                      {userInfo?.twoFactorEnabled ? "Enabled" : "Disabled"}
                    </span>
                  </li>
                  <li>
                    Device:{" "}
                    <span className="font-semibold">
                      {uaResult.browser.name} {uaResult.browser.version} /{" "}
                      {uaResult.os.name} {uaResult.os.version}
                    </span>
                  </li>
                </ul>
              </div>
            </div>
            {/* SAĞ KISIM: Formlar ve ayarlar */}
            <div className="flex-1 flex flex-col gap-8 min-w-[220px]">
              {/* Hesap Bilgileri */}
              <div>
                <h3 className="text-lg font-semibold text-indigo-700 mb-3">
                  Account Information
                </h3>
                <form
                  className="flex flex-col gap-3"
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSave();
                  }}
                >
                  <div className="flex flex-col md:flex-row gap-3">
                    <TextField
                      label="First Name"
                      name="firstname"
                      value={form.firstname}
                      onChange={handleChange}
                      disabled
                      fullWidth
                      size="small"
                    />
                    <TextField
                      label="Last Name"
                      name="lastname"
                      value={form.lastname}
                      onChange={handleChange}
                      disabled
                      fullWidth
                      size="small"
                    />
                  </div>
                  <TextField
                    label="E-Mail"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    disabled
                    fullWidth
                    size="small"
                  />
                </form>
              </div>
              {/* Şifre Değiştir */}
              <div>
                <h3 className="text-lg font-semibold text-indigo-700 mb-3">
                  Change Password
                </h3>
                <form
                  className="flex flex-col gap-3"
                  onSubmit={handlePasswordSubmit}
                >
                  <TextField
                    label="Current Password"
                    name="oldPassword"
                    type="password"
                    value={passwordForm.oldPassword}
                    onChange={handlePasswordChange}
                    required
                    fullWidth
                    size="small"
                  />
                  <TextField
                    label="New Password"
                    name="newPassword"
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={handlePasswordChange}
                    required
                    fullWidth
                    size="small"
                  />
                  <TextField
                    label="Confirm New Password"
                    name="confirmPassword"
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={handlePasswordChange}
                    required
                    fullWidth
                    size="small"
                  />
                  <div className="flex gap-3 mt-1">
                    <Button variant="contained" color="primary" type="submit">
                      Change Password
                    </Button>
                  </div>
                </form>
              </div>
              {/* Bildirim Ayarları */}
              <div>
                <h3 className="text-lg font-semibold text-indigo-700 mb-3">
                  Notification Settings
                </h3>
                <div className="flex flex-col md:flex-row gap-4">
                  <label className="flex items-center gap-2 text-base">
                    <input
                      type="checkbox"
                      name="email"
                      checked={notifications.email}
                      onChange={handleNotifChange}
                      className="accent-blue-600 w-5 h-5"
                    />{" "}
                    E-Mail Notifications
                  </label>
                </div>
              </div>
              {/* Finansal Hedefler Butonu */}
              <div className="flex flex-col items-start">
                <Button
                  variant="outlined"
                  color="primary"
                  startIcon={<AddCircleOutlineIcon />}
                  onClick={handleGoalModalOpen}
                  sx={{ fontWeight: 700, borderRadius: 2, mb: 1 }}
                >
                  Financial Goals
                </Button>
              </div>
              {/* Financial Goals Modal */}
              <Dialog
                open={goalModalOpen}
                onClose={handleGoalModalClose}
                maxWidth="sm"
                fullWidth
              >
                <DialogTitle
                  sx={{
                    fontWeight: 800,
                    color: "primary.main",
                    fontSize: 24,
                    pb: 1,
                  }}
                >
                  <Box display="flex" alignItems="center" gap={1}>
                    <AddCircleOutlineIcon color="primary" />
                    Financial Goals
                  </Box>
                </DialogTitle>
                <DialogContent dividers sx={{ bgcolor: "#f8fafc" }}>
                  <form
                    onSubmit={handleGoalAdd}
                    style={{
                      display: "flex",
                      gap: 12,
                      marginBottom: 18,
                      alignItems: "center",
                      flexWrap: "wrap",
                    }}
                  >
                    <TextField
                      label="Description"
                      name="description"
                      value={goalForm.description}
                      onChange={handleGoalFormChange}
                      size="small"
                      required
                      sx={{ minWidth: 160 }}
                    />
                    <TextField
                      label="Amount"
                      name="amount"
                      type="number"
                      value={goalForm.amount}
                      onChange={handleGoalFormChange}
                      size="small"
                      required
                      sx={{ minWidth: 120 }}
                    />
                    <Select
                      label="Account Type"
                      name="accountType"
                      value={goalForm.accountType}
                      onChange={handleGoalFormChange}
                      size="small"
                      sx={{ minWidth: 120 }}
                      displayEmpty
                    >
                      {accountTypeOptions.length === 0 && (
                        <MenuItem value="" disabled>
                          No account found
                        </MenuItem>
                      )}
                      {accountTypeOptions.map((opt) => (
                        <MenuItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </MenuItem>
                      ))}
                    </Select>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      sx={{ fontWeight: 700, borderRadius: 2 }}
                    >
                      Add
                    </Button>
                  </form>
                  <Box sx={{ minHeight: 120 }}>
                    {goalLoading ? (
                      <Box
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        minHeight={80}
                      >
                        <CircularProgress />
                      </Box>
                    ) : goalList.length === 0 ? (
                      <Typography
                        color="text.secondary"
                        align="center"
                        sx={{ mt: 2 }}
                      >
                        No goals set yet.
                      </Typography>
                    ) : (
                      <Box>
                        {goalList.map((goal) => {
                          // Hedefin accountType'ına göre ilgili hesabı bul
                          let userBalance = 0;
                          if (Array.isArray(accountList)) {
                            const acc = accountList.find(
                              (a) => a.accountType === goal.accountType
                            );
                            userBalance = acc ? acc.balance : 0;
                          } else if (
                            accountInfo &&
                            accountInfo.accountType === goal.accountType
                          ) {
                            userBalance = accountInfo.balance;
                          }
                          const isGoalReached =
                            Number(userBalance) >= Number(goal.amount);
                          return (
                            <Box
                              key={goal.id}
                              display="flex"
                              alignItems="center"
                              justifyContent="space-between"
                              p={1.2}
                              mb={1}
                              borderRadius={2}
                              bgcolor={isGoalReached ? "#d1fae5" : "#fff"}
                              boxShadow={1}
                            >
                              <Box display="flex" alignItems="center" gap={1}>
                                <Typography
                                  fontWeight={700}
                                  color={
                                    isGoalReached
                                      ? "success.main"
                                      : "primary.main"
                                  }
                                >
                                  {goal.description}
                                </Typography>
                                {isGoalReached && (
                                  <CheckCircleIcon
                                    color="success"
                                    fontSize="small"
                                  />
                                )}
                              </Box>
                              <Box>
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                >
                                  {goal.amount} - {goal.accountType}
                                </Typography>
                                <Typography
                                  variant="caption"
                                  color="text.disabled"
                                >
                                  {goal.createdAt
                                    ? new Date(
                                        goal.createdAt
                                      ).toLocaleDateString()
                                    : ""}
                                </Typography>
                              </Box>
                              <Tooltip title="Delete Goal">
                                <IconButton
                                  color="error"
                                  onClick={() => handleGoalDelete(goal.id)}
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          );
                        })}
                      </Box>
                    )}
                  </Box>
                </DialogContent>
                <DialogActions>
                  <Button
                    onClick={handleGoalModalClose}
                    color="secondary"
                    variant="outlined"
                    sx={{ fontWeight: 700, borderRadius: 2 }}
                  >
                    Close
                  </Button>
                </DialogActions>
              </Dialog>
              {/* Hesap Açma Sekmesi */}
              <div>
                <Button
                  variant="outlined"
                  color="primary"
                  startIcon={<AccountBalanceWalletIcon />}
                  onClick={handleAccountsModalOpen}
                  sx={{ fontWeight: 700, borderRadius: 2 }}
                >
                  Accounts
                </Button>
                {/* Hesaplarım Modal */}
                <Dialog
                  open={accountsModalOpen}
                  onClose={handleAccountsModalClose}
                  maxWidth="xs"
                  fullWidth
                >
                  <DialogTitle
                    sx={{
                      fontWeight: 800,
                      color: "primary.main",
                      fontSize: 22,
                      pb: 1,
                    }}
                  >
                    <Box display="flex" alignItems="center" gap={1}>
                      <AccountBalanceWalletIcon color="primary" />
                      Accounts
                    </Box>
                  </DialogTitle>
                  <DialogContent dividers sx={{ bgcolor: "#f8fafc" }}>
                    {/* Yeni hesap açma alanı */}
                    <form
                      onSubmit={handleOpenAccount}
                      style={{
                        display: "flex",
                        gap: 10,
                        alignItems: "center",
                        marginBottom: 18,
                      }}
                    >
                      <Select
                        value={newAccountType}
                        onChange={(e) => setNewAccountType(e.target.value)}
                        displayEmpty
                        size="small"
                        sx={{ minWidth: 120 }}
                        disabled={
                          openAccountLoading ||
                          availableAccountTypes.length === 0
                        }
                      >
                        <MenuItem value="" disabled>
                          Select account type
                        </MenuItem>
                        {availableAccountTypes.map((opt) => (
                          <MenuItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </MenuItem>
                        ))}
                      </Select>
                      <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        disabled={
                          !newAccountType ||
                          openAccountLoading ||
                          availableAccountTypes.length === 0
                        }
                        sx={{ fontWeight: 700, borderRadius: 2 }}
                      >
                        Open Account
                      </Button>
                    </form>
                    {/* Hesap açma onay modalı */}
                    <Dialog
                      open={openAccountConfirmOpen}
                      onClose={() => setOpenAccountConfirmOpen(false)}
                      maxWidth="xs"
                      fullWidth
                    >
                      <DialogTitle
                        sx={{
                          fontWeight: 700,
                          color: "primary.main",
                          fontSize: 20,
                        }}
                      >
                        Account Opening Terms
                      </DialogTitle>
                      <DialogContent dividers sx={{ bgcolor: "#f8fafc" }}>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mb: 2 }}
                        >
                          By opening a new account, you agree to the following
                          terms and conditions:
                          <br />
                          <br />
                          - You are solely responsible for all transactions made
                          from this account.
                          <br />
                          - The bank may request additional information or
                          documents if necessary.
                          <br />
                          - You agree to comply with all applicable laws and
                          regulations.
                          <br />
                          - The bank reserves the right to suspend or close the
                          account in case of suspicious activity.
                          <br />
                          <br />
                          Please read the full terms and conditions before
                          proceeding.
                        </Typography>
                        <label
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            marginTop: 8,
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={legalChecked}
                            onChange={(e) => setLegalChecked(e.target.checked)}
                          />
                          <span>
                            I have read and accept the terms and conditions.
                          </span>
                        </label>
                      </DialogContent>
                      <DialogActions>
                        <Button
                          onClick={() => setOpenAccountConfirmOpen(false)}
                          color="secondary"
                          variant="outlined"
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={handleConfirmOpenAccount}
                          color="primary"
                          variant="contained"
                          disabled={!legalChecked || openAccountLoading}
                        >
                          {openAccountLoading ? (
                            <CircularProgress size={18} />
                          ) : (
                            "Confirm & Open Account"
                          )}
                        </Button>
                      </DialogActions>
                    </Dialog>
                    {/* Hesaplar listesi */}
                    {Array.isArray(accountList) && accountList.length > 0 ? (
                      <Box>
                        {accountList.map((acc) => (
                          <Box
                            key={acc.accountType}
                            display="flex"
                            alignItems="center"
                            justifyContent="space-between"
                            p={1.2}
                            mb={1}
                            borderRadius={2}
                            bgcolor="#fff"
                            boxShadow={1}
                          >
                            <Box display="flex" alignItems="center" gap={1}>
                              <Typography fontWeight={700} color="primary.main">
                                {acc.accountType}
                              </Typography>
                            </Box>
                            <Box>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                {acc.balance?.toLocaleString("en-US", {
                                  minimumFractionDigits: 2,
                                })}{" "}
                                {acc.accountType}
                              </Typography>
                            </Box>
                          </Box>
                        ))}
                      </Box>
                    ) : (
                      <Typography
                        color="text.secondary"
                        align="center"
                        sx={{ mt: 2 }}
                      >
                        No accounts found.
                      </Typography>
                    )}
                  </DialogContent>
                  <DialogActions>
                    <Button
                      onClick={handleAccountsModalClose}
                      color="secondary"
                      variant="outlined"
                      sx={{ fontWeight: 700, borderRadius: 2 }}
                    >
                      Close
                    </Button>
                  </DialogActions>
                </Dialog>
              </div>
            </div>
          </div>
        </Paper>
        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Alert
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            severity={snackbar.severity}
            sx={{ width: "100%" }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
        {loading && (
          <div className="fixed inset-0 flex items-center justify-center bg-white/70 z-50">
            <CircularProgress size={60} />
          </div>
        )}
      </div>
      <style>{`
        @keyframes modal-pop {
            0% { transform: translateY(80px) scale(0.85); opacity: 0; }
            60% { transform: translateY(-10px) scale(1.05); opacity: 1; }
            100% { transform: translateY(0) scale(1); opacity: 1; }
        }
        .animate-modal-pop {
            animation: modal-pop 0.55s cubic-bezier(.4,2,.6,1) both;
        }
        @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-18px); }
        }
        .animate-float {
            animation: float 4s ease-in-out infinite;
        }
        .animate-float-slow {
            animation: float 7s ease-in-out infinite;
        }
        @keyframes dolphin-float {
            0%, 100% { transform: translateY(0) scaleX(-1) rotate(-8deg); }
            50% { transform: translateY(-18px) scaleX(-1.04) rotate(-8deg); }
        }
        .animate-dolphin-float {
            animation: dolphin-float 8s ease-in-out infinite;
        }
        @keyframes fish-swim {
            0% { transform: translateX(0); }
            50% { transform: translateX(40px) scaleX(-1); }
            100% { transform: translateX(0); }
        }
        .animate-fish-swim {
            animation: fish-swim 8s ease-in-out infinite;
        }
        @keyframes fish-swim2 {
            0% { transform: translateX(0); }
            50% { transform: translateX(-30px) scaleX(-1); }
            100% { transform: translateX(0); }
        }
        .animate-fish-swim2 {
            animation: fish-swim2 10s ease-in-out infinite;
        }
        @keyframes fade-in {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        .animate-fade-in {
            animation: fade-in 1.2s both;
        }
        .animate-fade-in.delay-200 {
            animation-delay: 0.2s;
        }
        .animate-fade-in.delay-400 {
            animation-delay: 0.4s;
        }
        @keyframes glow {
            0%, 100% { filter: drop-shadow(0 0 0px #6366f1); }
            50% { filter: drop-shadow(0 0 16px #6366f1); }
        }
        .animate-glow {
            animation: glow 3s ease-in-out infinite;
        }
        @keyframes bounce-badge {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-8px) scale(1.08); }
        }
        .animate-bounce-badge {
            animation: bounce-badge 2.5s infinite;
        }
        .animate-spin-slow {
            animation: spin 8s linear infinite;
        }
        @keyframes spin {
            100% { transform: rotate(360deg); }
        }
        .animate-wave {
            animation: wave-move 12s linear infinite alternate;
        }
        @keyframes wave-move {
            0% { transform: translateX(0); }
            100% { transform: translateX(-80px); }
        }
        @media (max-width: 900px) {
          .dolphin-responsive {
            width: 320px !important;
            right: -60px !important;
            bottom: -30px !important;
            max-width: 70vw !important;
            min-width: 120px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Profile;
