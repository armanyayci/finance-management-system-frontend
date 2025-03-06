import React from 'react';
import HomeIcon from '@mui/icons-material/Home';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import LibraryAddCheckIcon from '@mui/icons-material/LibraryAddCheck';
import CalculateIcon from '@mui/icons-material/Calculate';
import LogoutIcon from '@mui/icons-material/Logout';
import TranslateIcon from '@mui/icons-material/Translate';
import PersonIcon from '@mui/icons-material/Person';
import ApiService from './service/ApiService';
import { toast } from 'react-toastify';

const username = localStorage.getItem('username');
let firstName,lastName;
 
const usersResponse = await ApiService.GetAllUsers();
        const user = usersResponse.find(user => user.username === username);
        if (user) {
            localStorage.setItem('firstname',user.firstname);
            localStorage.setItem('lastname',user.lastname);
          firstName= localStorage.getItem('firstname');
          lastName=localStorage.getItem('lastname');
        } else {
          toast.error('User not found!', { position: 'top-right' });
        }
      

export const SidebarData =

[
    {
        title : `${firstName} ${lastName}` ,
        icon : <PersonIcon fontSize='large'/>,
        link: "/"
    },
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
  