import React, { createContext, useContext, useState, useEffect } from "react";

export interface Transaction {
  id: string;
  type: "credit" | "debit";
  category: "money_received" | "money_sent" | "bill_payment" | "money_added" | "qr_payment";
  title: string;
  subtitle: string;
  amount: number;
  date: string;
  time: string;
  status: "success" | "failed";
  icon: any;
}

interface WalletContextType {
  walletBalance: number;
  transactions: Transaction[];
  addTransaction: (transaction: Omit<Transaction, "id" | "date" | "time">) => void;
  updateBalance: (amount: number, type: "credit" | "debit") => void;
  processPayment: (amount: number, recipient: string, category: Transaction["category"], title: string) => Promise<boolean>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
};

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [walletBalance, setWalletBalance] = useState(() => {
    const saved = localStorage.getItem("walletBalance");
    return saved ? parseFloat(saved) : 12547.50;
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem("transactions");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("walletBalance", walletBalance.toString());
  }, [walletBalance]);

  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }, [transactions]);

  const generateTransactionId = () => {
    return `TXN${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  };

  const addTransaction = (transaction: Omit<Transaction, "id" | "date" | "time">) => {
    const now = new Date();
    const newTransaction: Transaction = {
      ...transaction,
      id: generateTransactionId(),
      date: now.toISOString().split('T')[0],
      time: now.toTimeString().slice(0, 5),
    };

    setTransactions(prev => [newTransaction, ...prev]);
  };

  const updateBalance = (amount: number, type: "credit" | "debit") => {
    setWalletBalance(prev => {
      const newBalance = type === "credit" ? prev + amount : prev - amount;
      return Math.max(0, newBalance); // Prevent negative balance
    });
  };

  const processPayment = async (
    amount: number, 
    recipient: string, 
    category: Transaction["category"],
    title: string
  ): Promise<boolean> => {
    // Simulate payment processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Random success/failure (90% success rate)
    const isSuccess = Math.random() > 0.1;
    
    if (isSuccess) {
      updateBalance(amount, "debit");
      addTransaction({
        type: "debit",
        category,
        title,
        subtitle: recipient,
        amount,
        status: "success",
        icon: null // Will be set by the component
      });
    } else {
      addTransaction({
        type: "debit",
        category,
        title,
        subtitle: recipient,
        amount,
        status: "failed",
        icon: null // Will be set by the component
      });
    }

    return isSuccess;
  };

  return (
    <WalletContext.Provider value={{
      walletBalance,
      transactions,
      addTransaction,
      updateBalance,
      processPayment
    }}>
      {children}
    </WalletContext.Provider>
  );
};