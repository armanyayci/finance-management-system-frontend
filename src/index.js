// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import './index.css';
// import reportWebVitals from './reportWebVitals';
// import {router} from './utils/router' 
// import { RouterProvider } from 'react-router-dom';

// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(
//   <React.StrictMode>
//      <RouterProvider router={router} />
//   </React.StrictMode>
// );

// // If you want to start measuring performance in your app, pass a function
// // to log results (for example: reportWebVitals(console.log))
// // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import { router } from "./utils/router";
import { RouterProvider } from "react-router-dom";
import { ExpenseProvider } from "./components/Context/ExpenseContext"; // Context dosyanın yolu bu olmalı!
import { LoginProvider } from "./components/Context/LoginContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <LoginProvider>
    <ExpenseProvider> {/* ExpenseProvider'ı RouterProvider'ın dışına koyuyoruz */}
      <RouterProvider router={router} />
    </ExpenseProvider>
    </LoginProvider>
    
  </React.StrictMode>
);

reportWebVitals();

