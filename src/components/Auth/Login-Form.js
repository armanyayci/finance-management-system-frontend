import React, { useState, useContext } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from 'jwt-decode';
import { LoginContext } from "../Context/LoginContext";
import ApiService from '../service/ApiService';
import { Alert, Snackbar } from '@mui/material';


const LoginForm = () => {
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
    <div className="flex items-center justify-center min-h-screen relative">
      <form onSubmit={handleSubmit} className={`flex flex-col ${loading ? 'pointer-events-none opacity-50' : ''}`}>
        {errorMessage && (
          
          <Alert severity='error' className="mb-4">
            {errorMessage}
          </Alert>
        )}

        <label className="flex flex-col gap-2 text-lg font-semibold mt-4">
          Username
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            type="text"
            className="p-4 border border-gray-500 shadow-sm bg-white-200 w-[70vh] rounded-[250px]"
          />
        </label>

        <label className="flex flex-col gap-2 text-lg font-semibold mt-4">
          Password
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            className="p-4 border border-gray-500 shadow-sm bg-white-200 w-[70vh] rounded-[250px]"
          />
        </label>

        <button 
          className="bg-red-600 rounded-[250px] shadow-sm text-black text-lg p-4 mt-[50px] font-semibold" 
          disabled={loading}
        >
          Login
        </button>

        <div className="text-center mb-4 mt-4 font-semibold">
          Don't you have an account? 
          <Link to="/register">
            <button 
              className="bg-blue-800 rounded shadow-sm text-black text-sm p-4 mt-4 text-lg font-semibold ml-4 w-[200px] rounded-[250px]" 
              disabled={loading}
            >
              Register
            </button>
          </Link>
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
