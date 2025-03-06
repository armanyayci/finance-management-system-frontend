import { createContext, useState } from "react";

export const ExpenseContext = createContext();

export const ExpenseProvider = ({ children }) => {
  const [totalAmount, setTotalAmount] = useState(0);
  const [expenses, setExpenses] = useState([]);

  return (
    <ExpenseContext.Provider value={{ expenses, setExpenses,totalAmount, setTotalAmount }}>
      {children}
    </ExpenseContext.Provider>
  );
};
