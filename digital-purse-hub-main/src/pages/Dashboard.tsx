import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Eye, 
  EyeOff, 
  Plus, 
  ArrowUpRight, 
  ArrowDownLeft, 
  QrCode,
  Send,
  Receipt,
  Zap,
  Bell,
  User,
  CreditCard,
  TrendingUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useWallet } from "@/contexts/WalletContext";
import BottomNavigation from "@/components/BottomNavigation";

const Dashboard = () => {
  const [showBalance, setShowBalance] = useState(true);
  const navigate = useNavigate();
  const { walletBalance, transactions } = useWallet();

  const quickActions = [
    { icon: QrCode, label: "Scan QR", path: "/scan-qr", color: "from-blue-500 to-blue-600" },
    { icon: Send, label: "Send Money", path: "/send-money", color: "from-green-500 to-green-600" },
    { icon: Receipt, label: "Pay Bills", path: "/bill-payments", color: "from-purple-500 to-purple-600" },
    { icon: Plus, label: "Add Money", path: "/add-money", color: "from-orange-500 to-orange-600" },
  ];

  // Get recent transactions from context
  const recentTransactions = transactions.slice(0, 3).map(transaction => ({
    id: transaction.id,
    type: transaction.type,
    title: transaction.title,
    subtitle: transaction.subtitle,
    amount: transaction.amount,
    time: `${transaction.date} ${transaction.time}`,
    icon: transaction.type === "credit" ? ArrowDownLeft : 
          transaction.category === "bill_payment" ? Zap : ArrowUpRight
  }));

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="wallet-gradient p-6 pt-12"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-white text-2xl font-bold">Good Evening</h1>
            <p className="text-white/80 text-sm">Welcome back to PayWallet</p>
          </div>
          <div className="flex gap-3">
            <Button size="icon" variant="ghost" className="text-white hover:bg-white/10">
              <Bell size={20} />
            </Button>
            <Button size="icon" variant="ghost" className="text-white hover:bg-white/10">
              <User size={20} />
            </Button>
          </div>
        </div>

        {/* Wallet Balance Card */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-white/80 text-sm font-medium">Wallet Balance</span>
            <button 
              onClick={() => setShowBalance(!showBalance)}
              className="text-white/80 hover:text-white"
            >
              {showBalance ? <Eye size={18} /> : <EyeOff size={18} />}
            </button>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-white text-3xl font-bold">
              ₹{showBalance ? walletBalance.toLocaleString() : "••••••"}
            </span>
            {showBalance && (
              <span className="text-green-300 text-sm bg-green-500/20 px-2 py-1 rounded-full flex items-center gap-1">
                <TrendingUp size={12} />
                +5.2%
              </span>
            )}
          </div>
          <p className="text-white/60 text-xs mt-1">Available for spending</p>
        </motion.div>
      </motion.div>

      {/* Quick Actions */}
      <div className="px-6 -mt-6 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-2 gap-4"
        >
            {quickActions.map((action, index) => (
              <motion.button
                key={action.path}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate(action.path)}
                className={`bg-gradient-to-r ${action.color} p-4 rounded-xl text-white shadow-lg hover:shadow-xl transition-all`}
              >
                <action.icon size={24} className="mb-2" />
                <span className="text-sm font-medium block">{action.label}</span>
              </motion.button>
            ))}
        </motion.div>
      </div>

      {/* Recent Transactions */}
      <div className="px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">Recent Transactions</h2>
            <Button variant="ghost" size="sm" className="text-primary" onClick={() => navigate("/transaction-history")}>
              View All
            </Button>
          </div>

          <div className="space-y-3">
            {recentTransactions.map((transaction, index) => (
              <motion.div
                key={transaction.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className="transaction-item"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    transaction.type === "credit" 
                      ? "bg-green-500/10 text-green-500" 
                      : "bg-red-500/10 text-red-500"
                  }`}>
                    <transaction.icon size={18} />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-foreground text-sm">{transaction.title}</p>
                    <p className="text-xs text-muted-foreground">{transaction.subtitle}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-semibold text-sm ${
                    transaction.type === "credit" ? "text-green-500" : "text-red-500"
                  }`}>
                    {transaction.type === "credit" ? "+" : "-"}₹{transaction.amount.toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground">{transaction.time}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Offers Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-4 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-sm">Cashback Offer!</p>
              <p className="text-xs text-white/80">Get 2% cashback on all transactions</p>
            </div>
            <CreditCard size={32} className="text-white/80" />
          </div>
        </motion.div>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default Dashboard;