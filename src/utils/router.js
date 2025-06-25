import {createBrowserRouter, } from "react-router-dom";
import Home from '../pages/Home';
import Login from "../pages/Login";
import Register from "../pages/Register";
import Expenses from "../pages/Expenses";
import CurrencyList from "../pages/CurrencyList";
import Profile from '../pages/Profile';

export const router = createBrowserRouter([
    {
      path: "/",
      element: <Login/>,
    },
    {
      path: "/home",
      element:<Home/>,
    },
    {
        path: "/register",
        element:<Register/>,
      },
      {
        path: "/expenses",
        element:<Expenses/>,
      },
      {
        path: "/currency",
        element:<CurrencyList/>,
      },
      {
        path: "/profile",
        element:<Profile/>,
      },
  ]);