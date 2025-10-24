import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Transaction {
  id: string;
  type: 'credit' | 'debit';
  title: string;
  subtitle: string;
  amount: number;
  date: string;
  time: string;
  category: string;
  icon?: any;
}

interface WalletContextType {
  walletBalance: number;
  transactions: Transaction[];
  addMoney: (amount: number) => Promise<void>;
  sendMoney: (amount: number, recipient: string) => Promise<void>;
  refreshBalance: () => Promise<void>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Load user's balance from localStorage on mount
  useEffect(() => {
    const loadUserData = () => {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          setWalletBalance(user.walletBalance || 0);
        } catch (e) {
          console.error('Error parsing user data:', e);
        }
      }

      // Load transactions from localStorage
      const transactionsStr = localStorage.getItem('transactions');
      if (transactionsStr) {
        try {
          const loadedTransactions = JSON.parse(transactionsStr);
          setTransactions(loadedTransactions);
        } catch (e) {
          console.error('Error parsing transactions:', e);
        }
      }
    };

    loadUserData();
  }, []);

  // Refresh balance from backend
  const refreshBalance = async () => {
    const userStr = localStorage.getItem('user');
    if (!userStr) return;

    try {
      const user = JSON.parse(userStr);
      const response = await fetch(`http://localhost:8080/api/wallet/balance/${user.id}`);
      const data = await response.json();

      if (response.ok) {
        setWalletBalance(data.walletBalance);
        
        // Update localStorage
        user.walletBalance = data.walletBalance;
        localStorage.setItem('user', JSON.stringify(user));
      }
    } catch (error) {
      console.error('Error refreshing balance:', error);
    }
  };

  // Add money to wallet
  const addMoney = async (amount: number) => {
    const userStr = localStorage.getItem('user');
    if (!userStr) throw new Error('User not logged in');

    try {
      const user = JSON.parse(userStr);
      const response = await fetch('http://localhost:8080/api/wallet/add-money', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          amount: amount
        })
      });

      const data = await response.json();

      if (response.ok) {
        // Update balance
        setWalletBalance(data.newBalance);
        
        // Update localStorage
        user.walletBalance = data.newBalance;
        localStorage.setItem('user', JSON.stringify(user));

        // Add transaction
        const newTransaction: Transaction = {
          id: Date.now().toString(),
          type: 'credit',
          title: 'Money Added',
          subtitle: 'Added to wallet',
          amount: amount,
          date: new Date().toLocaleDateString(),
          time: new Date().toLocaleTimeString(),
          category: 'add_money'
        };

        const updatedTransactions = [newTransaction, ...transactions];
        setTransactions(updatedTransactions);
        localStorage.setItem('transactions', JSON.stringify(updatedTransactions));
      } else {
        throw new Error(data.error || 'Failed to add money');
      }
    } catch (error) {
      console.error('Add money error:', error);
      throw error;
    }
  };

  // Send money from wallet
  const sendMoney = async (amount: number, recipient: string) => {
    const userStr = localStorage.getItem('user');
    if (!userStr) throw new Error('User not logged in');

    try {
      const user = JSON.parse(userStr);
      const response = await fetch('http://localhost:8080/api/wallet/send-money', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          amount: amount
        })
      });

      const data = await response.json();

      if (response.ok) {
        // Update balance
        setWalletBalance(data.newBalance);
        
        // Update localStorage
        user.walletBalance = data.newBalance;
        localStorage.setItem('user', JSON.stringify(user));

        // Add transaction
        const newTransaction: Transaction = {
          id: Date.now().toString(),
          type: 'debit',
          title: 'Money Sent',
          subtitle: `To ${recipient}`,
          amount: amount,
          date: new Date().toLocaleDateString(),
          time: new Date().toLocaleTimeString(),
          category: 'money_sent'
        };

        const updatedTransactions = [newTransaction, ...transactions];
        setTransactions(updatedTransactions);
        localStorage.setItem('transactions', JSON.stringify(updatedTransactions));
      } else {
        throw new Error(data.error || 'Failed to send money');
      }
    } catch (error) {
      console.error('Send money error:', error);
      throw error;
    }
  };

  return (
    <WalletContext.Provider value={{
      walletBalance,
      transactions,
      addMoney,
      sendMoney,
      refreshBalance
    }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};