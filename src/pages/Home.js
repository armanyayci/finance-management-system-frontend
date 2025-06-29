import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import '../Style/HomePage.css';
import FinancialSummary from '../components/FinancialSummary';
import ExpenseChart from '../components/ExpenseChart';
import LastTransactions from '../components/LastTransactions';
import ApiService from '../components/service/ApiService';

const WEATHER_API_KEY = 'b1b15e88fa797225412429c1c50c122a1'; // demo key, replace with your own for production

const WeatherWidget = () => {
  const [weather, setWeather] = useState(null);
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Hava durumuna göre arka plan rengi seç
  const getBgColor = (main) => {
    switch ((main || '').toLowerCase()) {
      case 'clear': return 'from-yellow-100 via-yellow-50 to-white';
      case 'clouds': return 'from-blue-100 via-blue-50 to-white';
      case 'rain': return 'from-blue-200 via-blue-100 to-white';
      case 'snow': return 'from-slate-100 via-white to-blue-50';
      case 'thunderstorm': return 'from-indigo-200 via-indigo-100 to-white';
      default: return 'from-blue-50 via-white to-white';
    }
  };

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation not supported");
      setLoading(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { latitude, longitude } = pos.coords;
      setLocation({ latitude, longitude });
      try {
        const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${WEATHER_API_KEY}&units=metric`);
        const data = await res.json();
        setWeather(data);
      } catch (e) {
        setError("Weather fetch failed");
      } finally {
        setLoading(false);
      }
    }, () => {
      setError("Location permission denied");
      setLoading(false);
    });
  }, []);

  if (loading) return (
    <div className="absolute top-5 right-7 z-20 bg-white/60 backdrop-blur-md rounded-2xl shadow-lg px-7 py-4 flex items-center gap-5 min-w-[210px] border border-blue-100 animate-pulse">
      <span className="w-12 h-12 bg-blue-100 rounded-full"></span>
      <div>
        <div className="h-5 w-24 bg-blue-100 rounded mb-2"></div>
        <div className="h-4 w-16 bg-blue-50 rounded"></div>
      </div>
    </div>
  );
  if (error) return (
    <div className="absolute top-5 right-7 z-20 bg-white/70 backdrop-blur-md rounded-2xl shadow-lg px-7 py-4 text-red-500 text-base border border-red-200">{error}</div>
  );
  if (!weather) return null;
  const bgColor = getBgColor(weather.weather[0].main);
  return (
    <div className={`absolute top-5 right-7 z-20 bg-gradient-to-br ${bgColor} bg-opacity-80 backdrop-blur-md rounded-2xl shadow-xl px-7 py-4 flex items-center gap-6 min-w-[230px] border border-blue-200 hover:shadow-2xl hover:brightness-105 transition-all duration-300 group`} style={{boxShadow:'0 4px 24px 0 rgba(59,130,246,0.10)'}}>
      {/* Soft background circle */}
      <div className="absolute left-2 top-2 w-14 h-14 rounded-full opacity-20 -z-0" style={{background: 'radial-gradient(circle at 60% 40%, #38bdf8 0%, #a5b4fc 80%, transparent 100%)'}}></div>
      <img src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} alt="weather icon" className="w-14 h-14 drop-shadow relative z-10" />
      <div className="relative z-10 flex flex-col">
        <span className="text-2xl font-extrabold text-blue-700 leading-6">{Math.round(weather.main.temp)}°C</span>
        <span className="text-base text-gray-700 font-bold leading-5">{weather.name}</span>
        <span className="text-sm text-blue-500/80 font-medium capitalize leading-4">{weather.weather[0].description}</span>
      </div>
    </div>
  );
};

export const Home = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [accounts, setAccounts] = useState([]); // Hesap verilerini Home'da yönet
  const [currentAccountIndex, setCurrentAccountIndex] = useState(0); // Aktif hesap indexi
  const username = localStorage.getItem('username');

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const usersRes = await ApiService.GetAllUsers();
        console.log('All users response:', usersRes);
        if (usersRes && Array.isArray(usersRes)) {
          const user = usersRes.find(u => u.username === username);
          console.log('Found user:', user);
          setUserInfo(user);
        }
      } catch (e) {
        console.error('Error fetching user:', e);
        setUserInfo(null);
      } finally {
        setLoading(false);
      }
    };
    if (username) fetchUser();
  }, [username]);

  // Hesap bilgilerini çek
  useEffect(() => {
    const fetchAccountInfo = async () => {
      try {
        const response = await ApiService.GetAccountInfoByUsername(username);
        if (response && response.success) {
          let accountList = Array.isArray(response.data) ? response.data : [response.data];
          // TRY hesabı varsa ilk sıraya al
          const tryIndex = accountList.findIndex(acc => acc.accountType === 'TRY');
          if (tryIndex > -1) {
            const [tryAccount] = accountList.splice(tryIndex, 1);
            accountList.unshift(tryAccount);
          }
          setAccounts(accountList);
          setCurrentAccountIndex(0);
        }
      } catch (error) {
        console.error('Error fetching account info:', error);
        setAccounts([]);
      }
    };
    if (username) {
      fetchAccountInfo();
    }
  }, [username]);

  // Hesap değiştirme fonksiyonları
  const handleAccountChange = (newIndex) => {
    setCurrentAccountIndex(newIndex);
  };

  const currentAccount = accounts[currentAccountIndex];

  return (
      <div className='home'>
        <div className="fixed left-0 top-0 h-screen z-50"><Sidebar/></div>
        <div className='flex-1 p-8 relative' style={{marginLeft:'20rem'}}>
          <WeatherWidget />
          {/* Welcome Header */}
          <div className="mb-8">
            {loading ? (
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome back...</h1>
            ) : userInfo ? (
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome back, {userInfo.firstname} {userInfo.lastname}!</h1>
            ) : (
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome back!</h1>
            )}
            <p className="text-gray-600">Here's your financial overview for today.</p>
          </div>

          {/* Main Content Grid - 2li grid + altına LastTransactions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 items-stretch">
            <div className="col-span-1 flex flex-col h-full">
              <FinancialSummary 
                accounts={accounts}
                currentAccountIndex={currentAccountIndex}
                onAccountChange={handleAccountChange}
              />
            </div>
            <div className="col-span-1 flex flex-col h-full"><ExpenseChart/></div>
          </div>
          <div className="w-full">
            <LastTransactions 
              customClass="!ml-0"
              currentAccount={currentAccount}
              accounts={accounts}
            />
          </div>
        </div>
      </div>
  )
}

export default Home;
