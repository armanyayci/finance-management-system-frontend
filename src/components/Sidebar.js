import React, { useState } from "react";
import { SidebarData } from "./SidebarData";
import { useNavigate } from "react-router-dom";
import CurrencyExchange from "./CurrencyExchange";
import { Backdrop, CircularProgress, Typography } from "@mui/material";
import { BanknotesIcon } from '@heroicons/react/24/outline';

function Sidebar() {
  const navigate = useNavigate();
  const [isExchangeOpen, setIsExchangeOpen] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);

  const handleLogout = () => {
    setLogoutLoading(true);

    setTimeout(() => {
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      localStorage.removeItem("expenses");
      localStorage.removeItem("firstname");
      localStorage.removeItem("lastname");
      setLogoutLoading(false);
      navigate("/");
    }, 2000);
  };

  return (
    <>
      <div className="h-full w-80 bg-gradient-to-b from-slate-900 to-slate-800 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="h-20 flex items-center justify-center border-b border-slate-700 bg-gradient-to-r from-blue-600 to-blue-700">
          <div className="flex items-center gap-3">
            <BanknotesIcon className="w-8 h-8 text-white" />
            <span className="text-white text-xl font-bold">FinanceApp</span>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="py-4 flex-1">
          {SidebarData.map((item, index) => {
            const isActive = window.location.pathname === item.link;
            const isLogout = item.title === "Logout";
            
            return (
              <div
                key={index}
                onClick={() => {
                  if (item.title === "Logout") {
                    handleLogout();
                  } else if (item.title === "Currency Converter") {
                    setIsExchangeOpen(true);
                  } else {
                    navigate(item.link);
                  }
                }}
                className={`
                  mx-3 mb-2 rounded-xl cursor-pointer transition-all duration-200 group
                  ${isActive 
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg' 
                    : isLogout
                    ? 'hover:bg-red-500/10 text-gray-300 hover:text-red-400'
                    : 'hover:bg-slate-700/50 text-gray-300 hover:text-white'
                  }
                `}
              >
                <div className="flex items-center px-4 py-4 gap-4">
                  <div className={`
                    flex-shrink-0 transition-transform duration-200 group-hover:scale-110
                    ${isActive ? 'text-white' : isLogout ? 'text-gray-400 group-hover:text-red-400' : 'text-gray-400 group-hover:text-white'}
                  `}>
                    {item.icon}
                  </div>
                  <span className={`
                    font-medium text-sm
                    ${isActive ? 'text-white' : isLogout ? 'text-gray-300 group-hover:text-red-400' : 'text-gray-300 group-hover:text-white'}
                  `}>
                    {item.title}
                  </span>
                </div>
              </div>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="mt-auto mb-4 px-4">
          <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700">
            <p className="text-xs text-gray-400 text-center">
              © 2024 FinanceApp
            </p>
          </div>
        </div>
      </div>

      {/* Logout Loading */}
      <Backdrop sx={{ color: "#fff", zIndex: 9999, flexDirection: "column" }} open={logoutLoading}>
        <CircularProgress color="inherit" />
        <Typography variant="h6" sx={{ marginTop: 2 }}>Logging out...</Typography>
      </Backdrop>

      {/* Currency Exchange Pop-up */}
      <CurrencyExchange open={isExchangeOpen} handleClose={() => setIsExchangeOpen(false)} />
    </>
  );
}

export default Sidebar;

