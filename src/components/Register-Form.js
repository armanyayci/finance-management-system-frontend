import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ApiService from './service/ApiService';

const RegisterForm = () => {
  // const [username, setUsername] = useState('');
  // const [firstname, setFirstname] = useState('');
  // const [lastname, setLastname] = useState('');
  // const [password, setPassword] = useState('');
  // const [email, setEmail] = useState('');
  const [formData,setFormData]=useState({
    username:'',
    firstname:'',
    lastname:'',
    password:'',
    email:''
  })
  const [errorMessage, setErrorMessage] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange =(e)=>{
    const {name,value} =e.target;
    setFormData({...formData,[name]:value});
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    //this part made for below part which is comment part
    
    try {
      const response = await ApiService.registerUser(formData);
      console.log(response);
      if(response.success){
      setMessage("User succesfully registered");
      setTimeout(() => {
        navigate('/')
      }, 4000);
        
      }
    } catch (error) {
      setErrorMessage(error.response?.data.message || error.message || "unable to register a user")
      setTimeout(() => {
        setErrorMessage('');
      }, 3000);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      {message && (
        <div className="fixed top-0 left-0 w-full bg-green-500 text-white text-center py-3 shadow-md">
          {message}
        </div>
      )}
      <form onSubmit={handleSubmit} className="flex flex-col">
        {/* Error message */}
        {errorMessage && (
          <div className="text-red-600 bg-red-200 p-2 rounded-md mb-2 w-[70vh] text-center shadow-md">
            {errorMessage}
          </div>
        )}
        <label className="flex flex-col gap-2 text-lg font-semibold">
          Username
          <input
            value={formData.username}
            onChange={handleChange}
            required
            type="text"
            name='username'
            className="p-4 border border-gray-500 shadow-sm bg-gray-200 w-[70vh] rounded-[250px]"
          />
        </label>
        <label className="flex flex-col gap-2 text-lg font-semibold">
          First Name
          <input
            type="text"
            name='firstname'
            value={formData.firstname}
            onChange={handleChange}
            required
            className="p-4 border border-gray-500 shadow-sm bg-gray-200 w-[70vh] rounded-[250px]"
          />
        </label>
        <label className="flex flex-col gap-2 text-lg font-semibold">
          Last Name
          <input
            type="text"
            name='lastname'
            value={formData.lastname}
            onChange={handleChange}
            required
            className="p-4 border border-gray-500 shadow-sm bg-gray-200 w-[70vh] rounded-[250px]"
          />
        </label>
        <label className="flex flex-col gap-2 text-lg font-semibold">
          Password
          <input
            type="password"
            name='password'
            value={formData.password}
            onChange={handleChange}
            required
            className="p-4 border border-gray-500 shadow-sm bg-gray-200 w-[70vh] rounded-[250px]"
          />
        </label>
        <label className="flex flex-col gap-2 text-lg font-semibold">
          E-Mail
          <input
            type="email"
            name='email'
            value={formData.email}
            onChange={handleChange}
            required
            className="p-4 border border-gray-500 shadow-sm bg-gray-200 w-[70vh] rounded-[250px]"
          />
        </label>
        <button className="bg-red-600 rounded shadow-sm text-black text-lg p-3 mt-4 rounded-[250px]">
          Register
        </button>
        <div className="text-center mb-4 mt-4 font-semibold">
          Have you already an account?{' '}
          <Link to="/">
            <button className="bg-blue-800 rounded shadow-sm text-black text-sm p-4 mt-4 text-lg font-semibold ml-4 w-[200px] rounded-[250px]">
              Login
            </button>
          </Link>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;




// Form validation
    // if (!username || !firstname || !lastname || !password || !email) {
    //   setErrorMessage('Please fill in all the fields');
    //   setTimeout(() => setErrorMessage(''), 3000); // Remove error after 3 seconds
    //   return;
    // }

    // const payload = {
    //   username,
    //   firstname,
    //   lastname,
    //   password,
    //   email,
    // };

    // try {
    //   await axios.post('http://localhost:8080/finance-mgmt/api/api/authenticate/signup', payload);
    //   navigate('/');
    // } catch (error) {
    //   setErrorMessage('Registration failed. Please try again.');
    //   setTimeout(() => setErrorMessage(''), 3000);
    // }