import { createContext, useState } from "react";

export const LoginContext = createContext();

export const LoginProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);
  

  return (
    <LoginContext.Provider value={{ loading, setLoading,openSnackbar, setOpenSnackbar}}>
      {children}
    </LoginContext.Provider>
  );
};
