import React, { useState, useContext } from 'react';
import { useNavigate } from "react-router-dom";
import { jwtDecode } from 'jwt-decode';
import { LoginContext } from "../Context/LoginContext";
import ApiService from '../service/ApiService';
import { Alert, Snackbar } from '@mui/material';

const LoginForm = ({ onShowRegister }) => {
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [twoFactorRequired, setTwoFactorRequired] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [twoFactorMessage, setTwoFactorMessage] = useState('');
  const navigate = useNavigate();
  const { loading,setLoading,openSnackbar, setOpenSnackbar } = useContext(LoginContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!username || !password) {
      setErrorMessage("Please enter username and password");
      setTimeout(() => setErrorMessage(''), 3000);
      setLoading(false);
      return;
    }

    const payload = { username, password };

    try {
      const res = await ApiService.Login(payload);

      if (res.success) {
        // 2FA gerekli mi kontrol et
        if (res.data.requiresTwoFactor) {
          setTwoFactorRequired(true);
          setTwoFactorMessage(res.data.message || 'Please enter the verification code sent to your email');
          setErrorMessage('');
        } else if (res.data.tokenResponse && res.data.tokenResponse.token) {
          // Normal login işlemi
          const token = res.data.tokenResponse.token;
          localStorage.setItem('token', token);
          const decodedData = jwtDecode(token);
          localStorage.setItem('username', decodedData.sub);
          
          if (decodedData.roles[0] === 'ROLE_USER') {
            setSuccessMessage('Login Successful! Redirecting...');
            setOpenSnackbar(true);

            setTimeout(() => {
              setSuccessMessage('');
              setOpenSnackbar(false);
              navigate('/home');
              window.location.reload();
            }, 3000);
          }
        }
      } else {
        setErrorMessage("Invalid username or password");
        setTimeout(() => setErrorMessage(''), 3000);
      }
    } catch (error) {
      //console.log(error.response.data.error);
      setErrorMessage("Login failed please try again later");
      setTimeout(() => setErrorMessage(''), 3000);
    }

    setLoading(false);
  };

  const handleVerify2FA = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!verificationCode) {
      setErrorMessage("Please enter verification code");
      setTimeout(() => setErrorMessage(''), 3000);
      setLoading(false);
      return;
    }

    try {
      const res = await ApiService.verify2FA(username, verificationCode);

      if (res.success && res.data && res.data.token) {
        localStorage.setItem('token', res.data.token);
        const decodedData = jwtDecode(res.data.token);
        localStorage.setItem('username', decodedData.sub);
        
        if (decodedData.roles[0] === 'ROLE_USER') {
          setSuccessMessage('2FA Verification Successful! Redirecting...');
          setOpenSnackbar(true);

          setTimeout(() => {
            setSuccessMessage('');
            setOpenSnackbar(false);
            navigate('/home');
            window.location.reload();
          }, 3000);
        }
      } else {
        setErrorMessage("Invalid verification code");
        setTimeout(() => setErrorMessage(''), 3000);
      }
    } catch (error) {
      setErrorMessage("Verification failed. Please try again.");
      setTimeout(() => setErrorMessage(''), 3000);
    }

    setLoading(false);
  };

  const handleBackToLogin = () => {
    setTwoFactorRequired(false);
    setVerificationCode('');
    setTwoFactorMessage('');
    setErrorMessage('');
  };

  return (
    <div className="relative">
      {!twoFactorRequired ? (
        // Normal Login Form
        <form onSubmit={handleSubmit} className={`flex flex-col gap-4 ${loading ? 'pointer-events-none opacity-50' : ''}`}>
          {errorMessage && (
            <Alert severity='error' className="mb-2 rounded-lg shadow text-base">{errorMessage}</Alert>
          )}
          <label className="flex flex-col gap-2 text-base font-semibold">
            Username
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              type="text"
              className="p-3 border border-gray-300 rounded-xl shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-colors"
              autoComplete="username"
            />
          </label>
          <label className="flex flex-col gap-2 text-base font-semibold">
            Password
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              className="p-3 border border-gray-300 rounded-xl shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-colors"
              autoComplete="current-password"
            />
          </label>
          <button 
            className="bg-blue-600 hover:bg-blue-700 transition-colors rounded-xl shadow text-white text-lg p-3 mt-4 font-semibold w-full"
            disabled={loading}
          >
            Login
          </button>
          <div className="text-center mb-2 mt-2 font-semibold text-gray-700">
            Don't you have an account?
            <button
              type="button"
              className="bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 transition-colors rounded-xl shadow text-white text-base p-3 mt-2 font-semibold ml-3 w-40"
              disabled={loading}
              onClick={onShowRegister}
            >
              Register
            </button>
          </div>
        </form>
      ) : (
        // 2FA Verification Form
        <form onSubmit={handleVerify2FA} className={`flex flex-col gap-4 ${loading ? 'pointer-events-none opacity-50' : ''}`}>
          <div className="text-center mb-4">
            <h3 className="text-xl font-bold text-indigo-700 mb-2">Two-Factor Authentication</h3>
            <p className="text-gray-600 text-sm">{twoFactorMessage}</p>
          </div>
          {errorMessage && (
            <Alert severity='error' className="mb-2 rounded-lg shadow text-base">{errorMessage}</Alert>
          )}
          <label className="flex flex-col gap-2 text-base font-semibold">
            Verification Code
            <input
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              type="text"
              placeholder="Enter 6-digit code"
              maxLength="6"
              className="p-3 border border-gray-300 rounded-xl shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-colors text-center text-2xl tracking-widest"
              autoComplete="one-time-code"
            />
          </label>
          <button 
            className="bg-green-600 hover:bg-green-700 transition-colors rounded-xl shadow text-white text-lg p-3 mt-4 font-semibold w-full"
            disabled={loading}
          >
            Verify Code
          </button>
          <button
            type="button"
            className="bg-gray-500 hover:bg-gray-600 transition-colors rounded-xl shadow text-white text-base p-2 mt-2 font-semibold w-full"
            disabled={loading}
            onClick={handleBackToLogin}
          >
            Back to Login
          </button>
        </form>
      )}
      {/* Snackbar ile Login Başarılı Mesajı */}
      <Snackbar open={openSnackbar} autoHideDuration={3000} anchorOrigin={{ vertical: "top", horizontal: "right" }}>
        <Alert severity="success" sx={{ width: '100%' }}>
          {successMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default LoginForm;
