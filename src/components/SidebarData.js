import React from 'react';
import HomeIcon from '@mui/icons-material/Home';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import LibraryAddCheckIcon from '@mui/icons-material/LibraryAddCheck';
import CalculateIcon from '@mui/icons-material/Calculate';
import LogoutIcon from '@mui/icons-material/Logout';
import TranslateIcon from '@mui/icons-material/Translate';
import PersonIcon from '@mui/icons-material/Person';

const firstName = localStorage.getItem('firstname') || 'User';
const lastName = localStorage.getItem('lastname') || '';

export const SidebarData = [
    {
        title : 'Profile',
        icon : <PersonIcon fontSize='large'/>,
        link: "/profile"
    },
    {
        title : "Main Page",
        icon : <HomeIcon fontSize='large'/>,
        link: "/home"
    },
    {
        title : "Expense Tracker",
        icon : <LibraryAddCheckIcon fontSize='large'/>,
        link: "/expenses"
    },
    {
        title : "Currency Exchange",
        icon : <CalculateIcon fontSize='large'/>,
        link: "/currency"
    },
    {
        title : "Currency Converter",
        icon : <TranslateIcon fontSize='large'/>,
        link: "/"
    },
    {
        title : "Logout",
        icon : <LogoutIcon fontSize='large'/>,
        link: "/"
    }
    
]
  