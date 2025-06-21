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
        const token = res.data.token;
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

  return (
    <div className="relative">
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
