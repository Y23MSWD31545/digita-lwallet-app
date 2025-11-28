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
  status: string;
  referenceNumber?: string;
  recipientUsername?: string;
}

interface WalletContextType {
  walletBalance: number;
  transactions: Transaction[];
  addMoney: (amount: number) => Promise<any>;
  sendMoney: (amount: number, recipientUsername: string) => Promise<any>;
  refreshBalance: () => Promise<void>;
  refreshTransactions: () => Promise<void>;
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
    };

    loadUserData();
    refreshTransactions();
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

  // Refresh transactions from backend
  const refreshTransactions = async () => {
    const userStr = localStorage.getItem('user');
    if (!userStr) return;

    try {
      const user = JSON.parse(userStr);
      const response = await fetch(`http://localhost:8080/api/wallet/transactions/${user.id}`);
      
      if (response.ok) {
        const data = await response.json();
        setTransactions(data);
      }
    } catch (error) {
      console.error('Error refreshing transactions:', error);
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

        // Refresh transactions to show the new transaction
        await refreshTransactions();

        return data;
      } else {
        throw new Error(data.error || 'Failed to add money');
      }
    } catch (error) {
      console.error('Add money error:', error);
      throw error;
    }
  };

  // Send money to another user
  const sendMoney = async (amount: number, recipientUsername: string) => {
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
          recipientUsername: recipientUsername,
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

        // Refresh transactions to show the new transaction
        await refreshTransactions();

        return data;
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
      refreshBalance,
      refreshTransactions
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