import React from 'react';
import '../Style/HomePage.css';
import { SidebarData } from './SidebarData';
import { useNavigate } from 'react-router-dom';

function Sidebar() {
  
  const navigate = useNavigate();

  const handleLogout = () => {
    // Token veya oturum bilgilerini temizle
    localStorage.removeItem('token'); 
  };

  return (
    <div className='sidebar'>
      <div className='maintitle'>MAIN MENU</div>
      <ul className='sidebarlist'>
        {SidebarData.map((val, key) => {
          return (
            <li
              key={key}
              id={window.location.pathname === val.link ? 'active' : ''}
              onClick={() => {
                if (val.title === 'Logout') {
                  handleLogout(); // Çıkış işlemi
                }
                navigate(val.link); // Giriş sayfasına yönlendirme
              }}
              className='row'
            >
              <div id='icon'>{val.icon}</div>
              <div id='title'>{val.title}</div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default Sidebar;
