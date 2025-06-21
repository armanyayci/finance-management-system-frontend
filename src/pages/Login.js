import React, { useContext, useState } from 'react';
import AuthLayout from '../components/Auth/Auth-Layout';
import LoginForm from '../components/Auth/Login-Form';
import RegisterForm from '../components/Register-Form';
import { CircularProgress } from '@mui/material';
import { LoginContext } from "../components/Context/LoginContext";
import logo from '../components/Auth/logo.svg';
import { useNavigate } from 'react-router-dom';
import ApiService from '../components/service/ApiService';

export const Login = () => {
    const { loading, openSnackbar } = useContext(LoginContext);
    const [showRegister, setShowRegister] = useState(false);
    const navigate = useNavigate();
   
    return ( 
        <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-indigo-100 via-white to-indigo-200 relative overflow-hidden">
            {/* Animated Background SVGs & Slogans */}
            {/* Colorful animated circles */}
            <div className="absolute z-0 pointer-events-none">
                <div className="absolute left-10 top-10 w-40 h-40 rounded-full bg-indigo-300 opacity-30 blur-2xl animate-float-slow"></div>
                <div className="absolute right-20 top-32 w-32 h-32 rounded-full bg-pink-300 opacity-30 blur-2xl animate-float"></div>
                <div className="absolute left-1/4 bottom-10 w-28 h-28 rounded-full bg-yellow-200 opacity-40 blur-2xl animate-float"></div>
                <div className="absolute right-1/4 bottom-24 w-24 h-24 rounded-full bg-green-200 opacity-40 blur-2xl animate-float-slow"></div>
            </div>
            {/* Confetti effect */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                {[...Array(18)].map((_, i) => (
                    <div key={i} className={`absolute animate-confetti${i % 3} w-2 h-2 rounded-full`} style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        background: ["#6366f1", "#fbbf24", "#38bdf8", "#f472b6", "#34d399"][i % 5],
                        opacity: 0.7
                    }} />
                ))}
            </div>
            {/* Center Top: Welcome Message, Slogan, and Badges */}
            <div className="absolute left-1/2 top-12 -translate-x-1/2 flex flex-col items-center z-20 w-full max-w-2xl">
                <div className="flex items-center gap-4 animate-fade-in">
                    <svg width="48" height="48" viewBox="0 0 48 48" fill="none"><circle cx="24" cy="24" r="24" fill="#facc15" fillOpacity="0.25" /><circle cx="24" cy="24" r="16" fill="#fde68a" /><text x="50%" y="58%" textAnchor="middle" fontSize="16" fill="#b45309" fontWeight="bold">₺</text></svg>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-indigo-700 drop-shadow-lg tracking-tight">Welcome to <span className="text-blue-500">FinanceApp</span></h1>
                    <svg width="48" height="48" viewBox="0 0 48 48" fill="none"><rect x="0" y="0" width="48" height="48" rx="12" fill="#a5b4fc" fillOpacity="0.18" /><rect x="10" y="28" width="6" height="12" rx="2" fill="#6366f1" /><rect x="18" y="20" width="6" height="20" rx="2" fill="#38bdf8" /><rect x="26" y="12" width="6" height="28" rx="2" fill="#22d3ee" /></svg>
                </div>
                <div className="mt-2 text-indigo-400 text-lg md:text-2xl max-w-2xl text-center animate-fade-in delay-200">Track, save, and grow your money with confidence.</div>
                <div className="flex gap-4 mt-4 animate-fade-in delay-400">
                    <span className="inline-block bg-green-100 text-green-700 px-4 py-1 rounded-full font-semibold shadow animate-bounce-badge">100% Secure</span>
                    <span className="inline-block bg-blue-100 text-blue-700 px-4 py-1 rounded-full font-semibold shadow animate-glow">24/7 Support</span>
                    <span className="inline-block bg-yellow-100 text-yellow-700 px-4 py-1 rounded-full font-semibold shadow animate-bounce-badge">Easy Registration</span>
                </div>
            </div>
            {/* Extra floating icons around the form */}
            <div className="absolute left-1/3 top-1/2 -translate-y-1/2 z-10 hidden md:block animate-float">
                <svg width="36" height="36" viewBox="0 0 36 36" fill="none"><rect x="0" y="0" width="36" height="36" rx="10" fill="#f472b6" fillOpacity="0.18" /><text x="50%" y="60%" textAnchor="middle" fontSize="16" fill="#be185d">💳</text></svg>
            </div>
            <div className="absolute right-1/3 top-1/2 -translate-y-1/2 z-10 hidden md:block animate-float-slow">
                <svg width="36" height="36" viewBox="0 0 36 36" fill="none"><rect x="0" y="0" width="36" height="36" rx="10" fill="#34d399" fillOpacity="0.18" /><text x="50%" y="60%" textAnchor="middle" fontSize="16" fill="#047857">📱</text></svg>
            </div>
            <div className="absolute left-1/4 bottom-1/4 z-10 hidden md:block animate-spin-slow">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none"><polygon points="16,2 20,12 30,12 22,19 25,30 16,23 7,30 10,19 2,12 12,12" fill="#fbbf24" fillOpacity="0.25" /></svg>
            </div>
            <div className="absolute right-1/4 top-1/4 z-10 hidden md:block animate-float">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none"><rect x="0" y="0" width="32" height="32" rx="8" fill="#818cf8" fillOpacity="0.18" /><text x="50%" y="60%" textAnchor="middle" fontSize="14" fill="#3730a3">🏦</text></svg>
            </div>
            {/* Center: Large Finance Illustration */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-0 pointer-events-none opacity-20 animate-fade-in delay-200">
                {/* Example: Phone with chart illustration SVG */}
                <svg width="340" height="220" viewBox="0 0 340 220" fill="none">
                  <rect x="60" y="40" width="220" height="140" rx="32" fill="#e0e7ff" />
                  <rect x="100" y="80" width="40" height="60" rx="8" fill="#6366f1" />
                  <rect x="150" y="100" width="40" height="40" rx="8" fill="#38bdf8" />
                  <rect x="200" y="60" width="40" height="80" rx="8" fill="#22d3ee" />
                  <rect x="250" y="120" width="20" height="20" rx="6" fill="#a5b4fc" />
                  <circle cx="170" cy="110" r="12" fill="#fbbf24" />
                  <rect x="140" y="60" width="60" height="10" rx="5" fill="#818cf8" />
                </svg>
            </div>
            {/* Animated gradient wave at the bottom */}
            <div className="absolute bottom-0 left-0 w-full h-32 z-0 overflow-hidden pointer-events-none">
                <svg width="100%" height="100%" viewBox="0 0 1440 160" fill="none" className="animate-wave">
                  <path d="M0,80 C360,160 1080,0 1440,80 L1440,160 L0,160 Z" fill="#6366f1" fillOpacity="0.08" />
                </svg>
            </div>
            {/* Spotlight effect behind card */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-indigo-200 opacity-30 blur-3xl z-0"></div>

            {/* Loading ekranı */}
            {loading && (
                <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 z-40">
                    <CircularProgress size={60} />
                </div>
            )}
            {openSnackbar && (
                <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 z-40">
                    <CircularProgress size={60} />
                </div>
            )}
            
            {/* Login/Register Card (in-place switch) */}
            <div className={`bg-white/95 rounded-3xl shadow-2xl flex flex-col items-center px-16 py-16 max-w-2xl w-full transition-all duration-500 z-10`}>
                <img src={logo} alt="Logo" className="w-24 h-24 mb-4" />
                {!showRegister ? (
                    <LoginForm onShowRegister={() => setShowRegister(true)} />
                ) : (
                    <RegisterFormInline onBackToLogin={() => setShowRegister(false)} />
                )}
            </div>

            {/* Even more background SVGs: finance illustrations in corners */}
            <div className="absolute z-0 pointer-events-none w-full h-full">
                {/* Top left: Wallet illustration */}
                <div className="absolute left-0 top-0 opacity-20 animate-float-slow">
                    <svg width="180" height="120" viewBox="0 0 180 120" fill="none">
                        <rect x="20" y="40" width="120" height="60" rx="18" fill="#fbbf24" fillOpacity="0.18" />
                        <rect x="40" y="60" width="80" height="30" rx="10" fill="#fde68a" />
                        <rect x="60" y="50" width="40" height="20" rx="6" fill="#f59e42" />
                        <circle cx="120" cy="80" r="8" fill="#fbbf24" />
                    </svg>
                </div>
                {/* Bottom right: Bank illustration */}
                <div className="absolute right-0 bottom-0 opacity-20 animate-float">
                    <svg width="180" height="120" viewBox="0 0 180 120" fill="none">
                        <rect x="40" y="60" width="100" height="40" rx="14" fill="#818cf8" fillOpacity="0.18" />
                        <rect x="60" y="80" width="60" height="20" rx="6" fill="#a5b4fc" />
                        <rect x="80" y="70" width="20" height="10" rx="3" fill="#6366f1" />
                        <circle cx="90" cy="100" r="7" fill="#6366f1" />
                    </svg>
                </div>
                {/* Top right: Graph illustration */}
                <div className="absolute right-0 top-0 opacity-20 animate-float">
                    <svg width="120" height="100" viewBox="0 0 120 100" fill="none">
                        <rect x="20" y="40" width="20" height="40" rx="6" fill="#38bdf8" fillOpacity="0.18" />
                        <rect x="50" y="20" width="20" height="60" rx="6" fill="#22d3ee" fillOpacity="0.18" />
                        <rect x="80" y="60" width="20" height="20" rx="6" fill="#818cf8" fillOpacity="0.18" />
                    </svg>
                </div>
                {/* Bottom left: Coin illustration */}
                <div className="absolute left-0 bottom-0 opacity-20 animate-float-slow">
                    <svg width="100" height="100" viewBox="0 0 100 100" fill="none">
                        <circle cx="50" cy="50" r="40" fill="#fbbf24" fillOpacity="0.12" />
                        <circle cx="50" cy="50" r="25" fill="#fde68a" fillOpacity="0.18" />
                        <text x="50%" y="56%" textAnchor="middle" fontSize="28" fill="#b45309" fontWeight="bold">₺</text>
                    </svg>
                </div>
            </div>
            {/* Add more animated colorful circles and waves */}
            <div className="absolute z-0 pointer-events-none w-full h-full">
                <div className="absolute left-1/2 top-1/4 w-44 h-44 rounded-full bg-blue-200 opacity-30 blur-2xl animate-float"></div>
                <div className="absolute right-1/2 bottom-1/3 w-36 h-36 rounded-full bg-pink-200 opacity-30 blur-2xl animate-float-slow"></div>
                <div className="absolute left-1/3 bottom-1/5 w-24 h-24 rounded-full bg-green-200 opacity-30 blur-2xl animate-float"></div>
                <div className="absolute right-1/4 top-1/5 w-28 h-28 rounded-full bg-yellow-200 opacity-30 blur-2xl animate-float-slow"></div>
                {/* Extra animated wave */}
                <div className="absolute left-0 bottom-20 w-full h-20 z-0 overflow-hidden pointer-events-none">
                    <svg width="100%" height="100%" viewBox="0 0 1440 80" fill="none" className="animate-wave">
                        <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" fill="#fbbf24" fillOpacity="0.07" />
                    </svg>
                </div>
            </div>
            {/* Place 'Gizlilik Garantisi' and 'Anında Takip' badges in bottom corners */}
            <div className="fixed left-10 bottom-36 z-30 animate-float-slow pointer-events-none">
                <span className="inline-flex items-center gap-1 bg-white/90 shadow px-4 py-2 rounded-full text-yellow-700 font-semibold text-base animate-glow border border-yellow-100">
                    <svg width="20" height="20" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="9" fill="#fbbf24" /><text x="50%" y="62%" textAnchor="middle" fontSize="13" fill="#fff">🔒</text></svg>
                    Privacy Guarantee
                </span>
            </div>
            <div className="fixed right-10 bottom-36 z-30 animate-float pointer-events-none">
                <span className="inline-flex items-center gap-1 bg-white/90 shadow px-4 py-2 rounded-full text-pink-700 font-semibold text-base animate-bounce-badge border border-pink-100">
                    <svg width="20" height="20" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="9" fill="#f472b6" /><text x="50%" y="62%" textAnchor="middle" fontSize="13" fill="#fff">★</text></svg>
                    Instant Tracking
                </span>
            </div>
            {/* More floating finance icons and motivational badges around the form (now only Hızlı Giriş and Akıllı Raporlama) */}
            <div className="absolute left-1/2 top-[38%] -translate-x-1/2 z-10 w-full max-w-4xl flex flex-wrap justify-between items-center pointer-events-none">
                <div className="animate-float-slow pointer-events-auto ml-[-180px] mt-[-60px]">
                    <span className="inline-flex items-center gap-1 bg-white/80 shadow px-3 py-1 rounded-full text-indigo-700 font-semibold text-sm mb-2 animate-glow">
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="9" fill="#34d399" /><text x="50%" y="62%" textAnchor="middle" fontSize="12" fill="#fff">✓</text></svg>
                        Quick Login
                    </span>
                </div>
                <div className="animate-float-slow pointer-events-auto mr-[-180px] mb-[-60px]">
                    <span className="inline-flex items-center gap-1 bg-white/80 shadow px-3 py-1 rounded-full text-blue-700 font-semibold text-sm mb-2 animate-glow">
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="9" fill="#38bdf8" /><text x="50%" y="62%" textAnchor="middle" fontSize="12" fill="#fff">💡</text></svg>
                        Smart Reporting
                    </span>
                </div>
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
                @keyframes confetti0 {
                    0% { transform: translateY(0) scale(1); }
                    50% { transform: translateY(30px) scale(1.2); }
                    100% { transform: translateY(0) scale(1); }
                }
                .animate-confetti0 {
                    animation: confetti0 4s ease-in-out infinite;
                }
                @keyframes confetti1 {
                    0% { transform: translateY(0) scale(1); }
                    50% { transform: translateY(-30px) scale(1.1); }
                    100% { transform: translateY(0) scale(1); }
                }
                .animate-confetti1 {
                    animation: confetti1 5s ease-in-out infinite;
                }
                @keyframes confetti2 {
                    0% { transform: translateY(0) scale(1); }
                    50% { transform: translateY(20px) scale(0.9); }
                    100% { transform: translateY(0) scale(1); }
                }
                .animate-confetti2 {
                    animation: confetti2 6s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
};

function RegisterFormInline({ onBackToLogin }) {
  const [formData, setFormData] = React.useState({
    username: '',
    firstname: '',
    lastname: '',
    password: '',
    email: ''
  });
  const [errorMessage, setErrorMessage] = React.useState('');
  const [message, setMessage] = React.useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await ApiService.registerUser(formData);
      if (response.success) {
        setMessage("User successfully registered");
        setTimeout(() => {
          navigate('/');
        }, 3000);
      }
    } catch (error) {
      setErrorMessage(error.response?.data.message || error.message || "Unable to register a user");
      setTimeout(() => {
        setErrorMessage('');
      }, 3000);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-lg flex flex-col gap-3">
      <div className="mb-2">
        <h2 className="text-3xl font-bold text-center text-indigo-700 mb-1 tracking-tight">Create Account</h2>
        <p className="text-center text-gray-500 text-base">Start your financial journey with us!</p>
      </div>
      {errorMessage && (
        <div className="text-red-600 bg-red-100 p-2 rounded-md text-center shadow mb-2 animate-pulse">
          {errorMessage}
        </div>
      )}
      {message && (
        <div className="text-green-600 bg-green-100 p-2 rounded-md text-center shadow mb-2 animate-pulse">
          {message}
        </div>
      )}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold">
          Username
        </label>
        <input
          value={formData.username}
          onChange={handleChange}
          required
          type="text"
          name='username'
          className="p-2 border border-gray-300 rounded-xl shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-colors"
          autoComplete="username"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold">
          E-Mail
        </label>
        <input
          type="email"
          name='email'
          value={formData.email}
          onChange={handleChange}
          required
          className="p-2 border border-gray-300 rounded-xl shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-colors"
          autoComplete="email"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold">
          First Name
        </label>
        <input
          type="text"
          name='firstname'
          value={formData.firstname}
          onChange={handleChange}
          required
          className="p-2 border border-gray-300 rounded-xl shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-colors"
          autoComplete="given-name"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold">
          Last Name
        </label>
        <input
          type="text"
          name='lastname'
          value={formData.lastname}
          onChange={handleChange}
          required
          className="p-2 border border-gray-300 rounded-xl shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-colors"
          autoComplete="family-name"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold">
          Password
        </label>
        <input
          type="password"
          name='password'
          value={formData.password}
          onChange={handleChange}
          required
          className="p-2 border border-gray-300 rounded-xl shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-colors"
          autoComplete="new-password"
        />
      </div>
      <button className="bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 transition-colors rounded-xl shadow text-white text-lg p-3 mt-2 font-bold w-full">
        Register
      </button>
      <button type="button" onClick={onBackToLogin} className="bg-blue-700 hover:bg-blue-800 transition-colors rounded-xl shadow text-white text-base p-2 mt-1 font-semibold w-full">
        Back to Login
      </button>
    </form>
  );
}

export default Login;
