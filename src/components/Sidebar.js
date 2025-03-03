import React, { useState} from "react";
import "../Style/HomePage.css";
import { SidebarData } from "./SidebarData";
import { useNavigate } from "react-router-dom";
import CurrencyExchange from "./CurrencyExchange"; // CurrencyExchange bileşeni import edildi

function Sidebar() {
  const navigate = useNavigate();
  const [isExchangeOpen, setIsExchangeOpen] = useState(false); // Pop-up state

  const handleLogout = () => {
    localStorage.removeItem("token"); // Oturumu kapat
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
                  navigate(val.link);
                } else if (val.title === "Currency Converter") {
                  setIsExchangeOpen(true); // Pop-up aç
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

      {/* Currency Exchange Pop-up */}
      <CurrencyExchange open={isExchangeOpen} handleClose={() => setIsExchangeOpen(false)} />
    </>
  );
}

export default Sidebar;
