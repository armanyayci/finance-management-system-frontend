import React, { useEffect, useState } from 'react';
import ApiService from '../components/service/ApiService';
import Sidebar from '../components/Sidebar';
import { Avatar, Button, TextField, Paper, Divider, CircularProgress, Snackbar, Alert } from '@mui/material';
import { UserCircleIcon, LockClosedIcon, EnvelopeIcon, IdentificationIcon } from '@heroicons/react/24/outline';

const Profile = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [accountInfo, setAccountInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ firstname: '', lastname: '', email: '' });
  const [passwordForm, setPasswordForm] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [notifications, setNotifications] = useState({ email: true, sms: false, inApp: true });
  const [goal, setGoal] = useState({ amount: '', desc: '' });
  const [goals, setGoals] = useState([]);
  const [sessions] = useState([
    { id: 1, device: 'Chrome (Windows)', ip: '192.168.1.2', lastActive: 'Now', current: true },
    { id: 2, device: 'iPhone', ip: '192.168.1.3', lastActive: '2 hours ago', current: false },
  ]);
  const [newAccountType, setNewAccountType] = useState('TL');
  const [accountOpenMsg, setAccountOpenMsg] = useState('');

  const username = localStorage.getItem('username');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const usersRes = await ApiService.GetAllUsers();
        const user = usersRes.find(u => u.username === username);
        setUserInfo(user);
        setForm({
          firstname: user?.firstname || '',
          lastname: user?.lastname || '',
          email: user?.email || '',
        });
        const accountRes = await ApiService.GetAccountInfoByUsername(username);
        setAccountInfo(accountRes.data);
      } catch (e) {
        setUserInfo(null);
        setAccountInfo(null);
      } finally {
        setLoading(false);
      }
    };
    if (username) fetchData();
  }, [username]);

  const handleEdit = () => setEditMode(true);
  const handleCancel = () => {
    setEditMode(false);
    setForm({
      firstname: userInfo?.firstname || '',
      lastname: userInfo?.lastname || '',
      email: userInfo?.email || '',
    });
  };
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handlePasswordChange = (e) => setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });

  const handleSave = async () => {
    // Burada güncelleme API isteği yapılabilir
    setSnackbar({ open: true, message: 'Profile updated successfully!', severity: 'success' });
    setEditMode(false);
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setSnackbar({ open: true, message: 'Passwords do not match!', severity: 'error' });
      return;
    }
    // Burada şifre güncelleme API isteği yapılabilir
    setSnackbar({ open: true, message: 'Password changed successfully!', severity: 'success' });
    setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
      setAvatarPreview(URL.createObjectURL(file));
      setSnackbar({ open: true, message: 'Avatar updated (mock)', severity: 'success' });
      // API ile yükleme fonksiyonu burada olacak
    }
  };

  const handleNotifChange = (e) => setNotifications({ ...notifications, [e.target.name]: e.target.checked });

  const handleGoalAdd = (e) => {
    e.preventDefault();
    if (goal.amount && goal.desc) {
      setGoals([...goals, { ...goal, id: Date.now() }]);
      setGoal({ amount: '', desc: '' });
      setSnackbar({ open: true, message: 'Goal added (mock)', severity: 'success' });
      // API ile ekleme fonksiyonu burada olacak
    }
  };

  const handleOpenAccount = (e) => {
    e.preventDefault();
    setAccountOpenMsg(`${newAccountType} hesabı başarıyla açıldı! (mock)`);
    setTimeout(() => setAccountOpenMsg(''), 2500);
    // API ile hesap açma fonksiyonu burada olacak
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
          objectPosition: "bottom right"
        }}
      />
      {/* Deniz temalı animasyonlu arka plan SVG'leri */}
      <div className="absolute z-0 pointer-events-none w-full h-full">
        {/* Yunus balığı SVG */}
        <svg className="absolute left-1/2 top-10 -translate-x-1/2 animate-dolphin-float" width="420" height="220" viewBox="0 0 420 220" fill="none" style={{zIndex:0, opacity:0.18}}>
          <g>
            <path d="M60 180 Q120 80 260 120 Q320 140 400 60 Q380 120 320 180 Q220 240 120 200 Q80 190 60 180 Z" fill="#60a5fa" />
            <ellipse cx="180" cy="120" rx="90" ry="40" fill="#38bdf8" opacity="0.7" />
            <path d="M120 200 Q140 180 180 180 Q220 180 240 200 Q200 210 160 210 Q140 210 120 200 Z" fill="#2563eb" />
            {/* Yunus gövdesi */}
            <path d="M120 160 Q170 80 300 120 Q320 130 340 110 Q320 150 260 170 Q180 190 120 160 Z" fill="#3b82f6" />
            {/* Yunus yüzgeci */}
            <path d="M200 120 Q210 110 220 120 Q210 125 200 120 Z" fill="#2563eb" />
            {/* Yunus kuyruğu */}
            <path d="M300 120 Q320 110 330 130 Q320 125 300 120 Z" fill="#2563eb" />
            {/* Göz */}
            <ellipse cx="260" cy="120" rx="6" ry="6" fill="#fff" />
            <ellipse cx="262" cy="122" rx="2" ry="2" fill="#1e293b" />
          </g>
        </svg>
        {/* Küçük balıklar: sadece sağ üstteki kalsın, sol alttaki kaldırıldı */}
        <svg className="absolute right-24 top-40 animate-fish-swim2" width="60" height="30" viewBox="0 0 60 30" fill="none" style={{opacity:0.18}}>
          <ellipse cx="30" cy="15" rx="20" ry="8" fill="#38bdf8" />
          <polygon points="50,15 60,10 60,20" fill="#38bdf8" />
          <ellipse cx="43" cy="15" rx="1.5" ry="1.5" fill="#fff" />
        </svg>
        {/* Deniz dalgası SVG: z-index yükseltildi */}
        <svg width="100%" height="100%" viewBox="0 0 1440 160" fill="none" className="absolute bottom-0 left-0 animate-wave z-20" style={{marginLeft:'320px', width:'calc(100% - 320px)'}}>
          <path d="M0,80 C360,160 1080,0 1440,80 L1440,160 L0,160 Z" fill="#38bdf8" fillOpacity="0.13" />
        </svg>
      </div>
      <Sidebar />
      <div className="flex-1 flex flex-col items-center justify-center py-10 px-4 md:px-16 relative z-10">
        {/* Profil kartı animasyonlu ve gölgeli */}
        <Paper elevation={12} className="w-full max-w-3xl p-4 md:p-8 rounded-3xl shadow-2xl bg-white/95 animate-modal-pop relative overflow-visible flex flex-col"
          style={{
            maxHeight: 'calc(100vh - 48px)',
            minHeight: '480px',
            overflowY: 'auto',
            justifyContent: 'flex-start',
            alignItems: 'center',
            margin: 'auto',
          }}
        >
          {/* 2 kolonlu grid düzeni */}
          <div className="w-full flex flex-col md:flex-row gap-8">
            {/* SOL KISIM: Avatar, rozetler, özet bilgiler */}
            <div className="flex-1 flex flex-col items-center gap-6 min-w-[220px] max-w-xs">
              {/* Rozetler */}
              <div className="flex flex-wrap gap-2 justify-center mb-2 mt-2">
                <span className="inline-flex items-center gap-1 bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-3 py-1 rounded-full font-semibold shadow animate-bounce-badge border-2 border-white text-sm">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="9" fill="#fbbf24" /><text x="50%" y="62%" textAnchor="middle" fontSize="11" fill="#fff">🔒</text></svg>
                  Secure Profile
                </span>
                <span className="inline-flex items-center gap-1 bg-gradient-to-r from-green-400 to-blue-400 text-white px-3 py-1 rounded-full font-semibold shadow animate-bounce-badge animate-glow border-2 border-white text-sm">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="9" fill="#34d399" /><text x="50%" y="62%" textAnchor="middle" fontSize="11" fill="#fff">💡</text></svg>
                  Smart Finance
                </span>
                <span className="inline-flex items-center gap-1 bg-gradient-to-r from-pink-400 to-yellow-400 text-white px-3 py-1 rounded-full font-semibold shadow animate-bounce-badge border-2 border-white text-sm">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="9" fill="#f472b6" /><text x="50%" y="62%" textAnchor="middle" fontSize="11" fill="#fff">⭐</text></svg>
                  VIP Member
                </span>
              </div>
              {/* Avatar */}
              <div className="relative group">
                <Avatar sx={{ width: 110, height: 110, bgcolor: '#6366f1', fontSize: 48 }} src={avatarPreview} className="shadow-xl border-4 border-white animate-float-slow">
                  <UserCircleIcon className="w-20 h-20 text-white" />
                </Avatar>
                <label className="absolute bottom-2 right-2 bg-blue-600 rounded-full p-2 cursor-pointer shadow-lg group-hover:scale-110 transition-transform" title="Change Avatar">
                  <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 13h6m2 2a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2h10z" /></svg>
                </label>
              </div>
              {/* Kullanıcı adı ve özet */}
              <div className="w-full flex flex-col items-center gap-1 mt-2">
                <h2 className="text-2xl font-bold text-indigo-700 tracking-tight flex items-center gap-2 animate-glow">
                  {userInfo ? `${userInfo.firstname} ${userInfo.lastname}` : 'Profile'}
                  <span className="inline-block bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-2 py-1 rounded-lg text-xs font-semibold ml-2 animate-bounce-badge">Active</span>
                </h2>
                <p className="text-gray-500 text-base">@{userInfo?.username}</p>
                <div className="flex flex-col gap-1 text-gray-700 text-sm mt-2">
                  <span className="flex items-center gap-2"><EnvelopeIcon className="w-4 h-4 text-indigo-400" /> {userInfo?.email}</span>
                  <span className="flex items-center gap-2"><IdentificationIcon className="w-4 h-4 text-indigo-400" /> {accountInfo?.accountType || 'Standard'}</span>
                  <span className="flex items-center gap-2"><LockClosedIcon className="w-4 h-4 text-indigo-400" /> {accountInfo?.balance?.toLocaleString('en-US', {minimumFractionDigits:2})} ₺</span>
                </div>
              </div>
              {/* Güvenlik & Aktivite */}
              <Divider className="my-4" />
              <div className="w-full">
                <h3 className="text-base font-semibold text-indigo-700 mb-2">Security & Recent Activity</h3>
                <ul className="text-gray-700 text-sm list-disc pl-5">
                  <li>Last login: {userInfo?.lastLogin ? new Date(userInfo.lastLogin).toLocaleString() : 'Unknown'}</li>
                  <li>Account created: {userInfo?.createdAt ? new Date(userInfo.createdAt).toLocaleDateString() : 'Unknown'}</li>
                  <li>2FA: <span className="font-semibold text-green-600">Enabled</span></li>
                  <li>Device: <span className="font-semibold">{navigator.userAgent}</span></li>
                </ul>
              </div>
            </div>
            {/* SAĞ KISIM: Formlar ve ayarlar */}
            <div className="flex-1 flex flex-col gap-8 min-w-[220px]">
              {/* Hesap Bilgileri */}
              <div>
                <h3 className="text-lg font-semibold text-indigo-700 mb-3">Account Information</h3>
                <form className="flex flex-col gap-3" onSubmit={e => { e.preventDefault(); handleSave(); }}>
                  <div className="flex flex-col md:flex-row gap-3">
                    <TextField label="First Name" name="firstname" value={form.firstname} onChange={handleChange} disabled={!editMode} fullWidth size="small" />
                    <TextField label="Last Name" name="lastname" value={form.lastname} onChange={handleChange} disabled={!editMode} fullWidth size="small" />
                  </div>
                  <TextField label="E-Mail" name="email" value={form.email} onChange={handleChange} disabled={!editMode} fullWidth size="small" />
                  <div className="flex gap-3 mt-1">
                    {!editMode ? (
                      <Button variant="contained" color="primary" onClick={handleEdit}>Edit</Button>
                    ) : (
                      <>
                        <Button variant="contained" color="success" type="submit">Save</Button>
                        <Button variant="outlined" color="secondary" onClick={handleCancel}>Cancel</Button>
                      </>
                    )}
                  </div>
                </form>
              </div>
              {/* Şifre Değiştir */}
              <div>
                <h3 className="text-lg font-semibold text-indigo-700 mb-3">Change Password</h3>
                <form className="flex flex-col gap-3" onSubmit={handlePasswordSubmit}>
                  <TextField label="Current Password" name="oldPassword" type="password" value={passwordForm.oldPassword} onChange={handlePasswordChange} required fullWidth size="small" />
                  <TextField label="New Password" name="newPassword" type="password" value={passwordForm.newPassword} onChange={handlePasswordChange} required fullWidth size="small" />
                  <TextField label="Confirm New Password" name="confirmPassword" type="password" value={passwordForm.confirmPassword} onChange={handlePasswordChange} required fullWidth size="small" />
                  <div className="flex gap-3 mt-1">
                    <Button variant="contained" color="primary" type="submit">Change Password</Button>
                  </div>
                </form>
              </div>
              {/* Bildirim Ayarları */}
              <div>
                <h3 className="text-lg font-semibold text-indigo-700 mb-3">Notification Settings</h3>
                <div className="flex flex-col md:flex-row gap-4">
                  <label className="flex items-center gap-2 text-base"><input type="checkbox" name="email" checked={notifications.email} onChange={handleNotifChange} className="accent-blue-600 w-5 h-5" /> E-Mail Notifications</label>
                  <label className="flex items-center gap-2 text-base"><input type="checkbox" name="sms" checked={notifications.sms} onChange={handleNotifChange} className="accent-blue-600 w-5 h-5" /> SMS Notifications</label>
                  <label className="flex items-center gap-2 text-base"><input type="checkbox" name="inApp" checked={notifications.inApp} onChange={handleNotifChange} className="accent-blue-600 w-5 h-5" /> In-App Notifications</label>
                </div>
              </div>
              {/* Finansal Hedefler */}
              <div>
                <h3 className="text-lg font-semibold text-indigo-700 mb-3">Financial Goals</h3>
                <form className="flex flex-col md:flex-row gap-3 mb-2" onSubmit={handleGoalAdd}>
                  <TextField label="Goal Amount (₺)" type="number" value={goal.amount} onChange={e => setGoal({ ...goal, amount: e.target.value })} size="small" />
                  <TextField label="Description" value={goal.desc} onChange={e => setGoal({ ...goal, desc: e.target.value })} size="small" />
                  <Button variant="contained" color="primary" type="submit">Add Goal</Button>
                </form>
                <ul className="list-disc pl-6 text-gray-700">
                  {goals.map(g => <li key={g.id}>{g.amount} ₺ - {g.desc}</li>)}
                  {goals.length === 0 && <li className="text-gray-400">No goals set yet.</li>}
                </ul>
              </div>
              {/* Oturum Yönetimi */}
              <div>
                <h3 className="text-lg font-semibold text-indigo-700 mb-3">Active Sessions</h3>
                <div className="flex flex-col gap-2">
                  {sessions.map(s => (
                    <div key={s.id} className={`flex items-center gap-4 p-3 rounded-xl border ${s.current ? 'border-blue-500 bg-blue-50' : 'border-slate-200 bg-slate-50'} shadow-sm`}> 
                      <span className="font-bold text-blue-700">{s.device}</span>
                      <span className="text-xs text-gray-500">{s.ip}</span>
                      <span className="text-xs text-gray-500">{s.lastActive}</span>
                      {s.current && <span className="ml-auto px-2 py-1 bg-blue-600 text-white rounded text-xs">Current</span>}
                    </div>
                  ))}
                </div>
              </div>
              {/* Hesap Açma Sekmesi */}
              <div>
                <h3 className="text-lg font-semibold text-indigo-700 mb-3">Yeni Hesap Aç</h3>
                <form className="flex flex-col md:flex-row gap-3 mb-2 items-center" onSubmit={handleOpenAccount}>
                  <select value={newAccountType} onChange={e => setNewAccountType(e.target.value)} className="p-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400">
                    <option value="TL">TL Hesabı</option>
                    <option value="USD">Dolar Hesabı (USD)</option>
                    <option value="EUR">Euro Hesabı (EUR)</option>
                    <option value="ALTIN">Altın Hesabı (XAU)</option>
                  </select>
                  <Button variant="contained" color="primary" type="submit">Hesap Aç</Button>
                </form>
                {accountOpenMsg && <div className="text-green-700 bg-green-100 rounded p-2 text-sm mt-1 animate-bounce-badge">{accountOpenMsg}</div>}
              </div>
            </div>
          </div>
        </Paper>
        <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
        {loading && <div className="fixed inset-0 flex items-center justify-center bg-white/70 z-50"><CircularProgress size={60} /></div>}
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