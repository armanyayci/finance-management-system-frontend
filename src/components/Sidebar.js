import React, { useState } from "react";
import "../Style/HomePage.css";
import { SidebarData } from "./SidebarData";
import { useNavigate } from "react-router-dom";
import CurrencyExchange from "./CurrencyExchange";
import { Backdrop, CircularProgress, Typography } from "@mui/material";

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
      navigate("/"); // Çıkış sonrası yönlendirme
    }, 2000); // 2 saniye bekleme süresi
  };

  return (
    <>
      <div className="sidebar">
        <div className="maintitle">MAIN MENU</div>
        <ul className="sidebarlist">
          {SidebarData.map((val, key) => (
            <li
              key={key}
              id={window.location.pathname === val.link ? "active" : ""}
              onClick={() => {
                if (val.title === "Logout") {
                  handleLogout();
                } else if (val.title === "Currency Converter") {
                  setIsExchangeOpen(true);
                } else {
                  navigate(val.link);
                }
              }}
              className="row"
            >
              <div id="icon">{val.icon}</div>
              <div id="title">{val.title}</div>
            </li>
          ))}
        </ul>
      </div>

      {/* Logout işlemi sırasında Backdrop ve Progress */}
      <Backdrop sx={{ color: "#fff", zIndex: 9999, flexDirection: "column" }} open={logoutLoading}>
        <CircularProgress color="inherit" />
        <Typography variant="h6" sx={{ marginTop: 2 }}>Çıkış yapılıyor...</Typography>
      </Backdrop>

      {/* Currency Exchange Pop-up */}
      <CurrencyExchange open={isExchangeOpen} handleClose={() => setIsExchangeOpen(false)} />
    </>
  );
}

export default Sidebar;

