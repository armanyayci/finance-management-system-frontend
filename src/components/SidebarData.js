import React from 'react';
import HomeIcon from '@mui/icons-material/Home';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import LibraryAddCheckIcon from '@mui/icons-material/LibraryAddCheck';
import CalculateIcon from '@mui/icons-material/Calculate';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import LogoutIcon from '@mui/icons-material/Logout';

export const SidebarData =
[
    {
        title : "Main Page",
        icon : <HomeIcon fontSize='large'/>,
        link: "/home"
    },
    {
        title : "Income Tracker",
        icon : <AddCircleIcon fontSize='large'/>,
        link: "/"
    },
    {
        title : "Expense Tracker",
        icon : <LibraryAddCheckIcon fontSize='large'/>,
        link: "/"
    },
    {
        title : "Tax Calculator",
        icon : <CalculateIcon fontSize='large'/>,
        link: "/"
    },
    {
        title : "Budget Planner",
        icon : <BusinessCenterIcon fontSize='large'/>,
        link: "/"
    },
    {
        title : "Logout",
        icon : <LogoutIcon fontSize='large'/>,
        link: "/"
    }
]
  