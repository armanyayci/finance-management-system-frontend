import { createContext, useState } from "react";

export const LoginContext = createContext();

export const LoginProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);

  return (
    <LoginContext.Provider value={{ loading, setLoading}}>
      {children}
    </LoginContext.Provider>
  );
};
