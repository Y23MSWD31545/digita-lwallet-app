import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  Search, 
  Filter,
  ArrowUpRight,
  ArrowDownLeft,
  Plus,
  Zap,
  Calendar
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import BottomNavigation from "@/components/BottomNavigation";

interface Transaction {
  id: string;
  type: 'credit' | 'debit';
  category: string;
  title: string;
  subtitle: string;
  amount: number;
  date: string;
  time: string;
  status: string;
  referenceNumber?: string;
}

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"all" | "credit" | "debit">("all");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTransactions();
  }, []);

  useEffect(() => {
    filterTransactions();
  }, [searchQuery, filterType, transactions]);

  const fetchTransactions = async () => {
    try {
      const userStr = localStorage.getItem('user');
      if (!userStr) {
        navigate('/login');
        return;
      }

      const user = JSON.parse(userStr);
      const response = await fetch(`http://localhost:8080/api/wallet/transactions/${user.id}`);
      
      if (response.ok) {
        const data = await response.json();
        setTransactions(data);
        setFilteredTransactions(data);
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterTransactions = () => {
    let filtered = [...transactions];

    // Filter by type
    if (filterType !== "all") {
      filtered = filtered.filter(t => t.type === filterType);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(t => 
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.referenceNumber?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredTransactions(filtered);
  };

  const getIconForTransaction = (transaction: Transaction) => {
    if (transaction.type === "credit") {
      if (transaction.category === "money_added") return Plus;
      return ArrowDownLeft;
    }
    if (transaction.category === "bill_payment") return Zap;
    return ArrowUpRight;
  };

  const getTotalByType = (type: "credit" | "debit") => {
    return transactions
      .filter(t => t.type === type)
      .reduce((sum, t) => sum + t.amount, 0);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading transactions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="wallet-gradient p-6 pt-12">
        <div className="flex items-center gap-4 mb-6">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => navigate("/dashboard")}
            className="text-white hover:bg-white/10"
          >
            <ArrowLeft size={20} />
          </Button>
          <h1 className="text-xl font-bold text-white">Transaction History</h1>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <p className="text-white/60 text-xs mb-1">Total Received</p>
            <p className="text-white text-lg font-bold">₹{getTotalByType("credit").toLocaleString()}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <p className="text-white/60 text-xs mb-1">Total Spent</p>
            <p className="text-white text-lg font-bold">₹{getTotalByType("debit").toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-4 -mt-6">
        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3"
        >
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              type="text"
              placeholder="Search transactions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filter Buttons */}
          <div className="flex gap-2">
            <Button
              variant={filterType === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterType("all")}
              className="flex-1"
            >
              All
            </Button>
            <Button
              variant={filterType === "credit" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterType("credit")}
              className="flex-1"
            >
              <ArrowDownLeft size={14} className="mr-1" />
              Credit
            </Button>
            <Button
              variant={filterType === "debit" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterType("debit")}
              className="flex-1"
            >
              <ArrowUpRight size={14} className="mr-1" />
              Debit
            </Button>
          </div>
        </motion.div>

        {/* Transactions List */}
        <div className="space-y-3">
          {filteredTransactions.length > 0 ? (
            filteredTransactions.map((transaction, index) => {
              const IconComponent = getIconForTransaction(transaction);
              return (
                <motion.div
                  key={transaction.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="transaction-item cursor-pointer hover:shadow-md"
                  onClick={() => {
                    // You can add a modal here to show transaction details
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      transaction.type === "credit" 
                        ? "bg-green-500/10 text-green-500" 
                        : "bg-red-500/10 text-red-500"
                    }`}>
                      <IconComponent size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground text-sm truncate">
                        {transaction.title}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {transaction.subtitle}
                      </p>
                      {transaction.referenceNumber && (
                        <p className="text-xs text-muted-foreground font-mono mt-0.5">
                          {transaction.referenceNumber}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold text-sm ${
                        transaction.type === "credit" ? "text-green-500" : "text-red-500"
                      }`}>
                        {transaction.type === "credit" ? "+" : "-"}₹{transaction.amount.toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {transaction.date}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {transaction.time}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })
          ) : (
            <div className="text-center py-12">
              <Calendar size={48} className="mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-2">No transactions found</p>
              <p className="text-sm text-muted-foreground">
                {searchQuery ? "Try a different search term" : "Start using your wallet to see transactions"}
              </p>
            </div>
          )}
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default TransactionHistory;