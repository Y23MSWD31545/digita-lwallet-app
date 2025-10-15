import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Filter, Search, ArrowUpRight, ArrowDownLeft, Zap, CheckCircle, XCircle, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useWallet } from "@/contexts/WalletContext";
import BottomNavigation from "@/components/BottomNavigation";

const TransactionHistory = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "success" | "failed">("all");
  const navigate = useNavigate();
  const { transactions } = useWallet();

  // Map transactions with correct icons
  const transactionsWithIcons = transactions.map(transaction => ({
    ...transaction,
    icon: transaction.type === "credit" 
      ? (transaction.category === "money_added" ? Plus : ArrowDownLeft)
      : transaction.category === "bill_payment" 
        ? Zap 
        : ArrowUpRight
  }));

  const filteredTransactions = transactionsWithIcons.filter(transaction => {
    const matchesSearch = transaction.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.subtitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === "all" || transaction.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  const groupedTransactions = filteredTransactions.reduce((acc, transaction) => {
    const date = transaction.date;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(transaction);
    return acc;
  }, {} as Record<string, typeof transactionsWithIcons>);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString('en-IN', { 
        day: 'numeric', 
        month: 'short', 
        year: 'numeric' 
      });
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="p-6 pt-12 border-b border-border">
        <div className="flex items-center gap-4 mb-4">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => navigate("/dashboard")}
          >
            <ArrowLeft size={20} />
          </Button>
          <h1 className="text-xl font-bold">Transaction History</h1>
        </div>

        {/* Search and Filter */}
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 wallet-input"
            />
          </div>
          <Button size="icon" variant="outline">
            <Filter size={18} />
          </Button>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mt-3">
          {[
            { key: "all", label: "All" },
            { key: "success", label: "Success" },
            { key: "failed", label: "Failed" }
          ].map(filter => (
            <Button
              key={filter.key}
              size="sm"
              variant={filterStatus === filter.key ? "default" : "outline"}
              onClick={() => setFilterStatus(filter.key as any)}
              className={filterStatus === filter.key ? "wallet-button-primary" : ""}
            >
              {filter.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Transactions List */}
      <div className="p-6 space-y-6">
        {Object.entries(groupedTransactions).map(([date, dayTransactions], dateIndex) => (
          <motion.div
            key={date}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: dateIndex * 0.1 }}
            className="space-y-3"
          >
            <h3 className="text-sm font-medium text-muted-foreground sticky top-0 bg-background py-2">
              {formatDate(date)}
            </h3>

            <div className="space-y-2">
              {dayTransactions.map((transaction, index) => (
                <motion.div
                  key={transaction.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: dateIndex * 0.1 + index * 0.05 }}
                >
                  <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        transaction.status === "success" 
                          ? transaction.type === "credit"
                            ? "bg-green-500/10 text-green-500"
                            : "bg-blue-500/10 text-blue-500"
                          : "bg-red-500/10 text-red-500"
                      }`}>
                        <transaction.icon size={18} />
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-sm">{transaction.title}</p>
                          {transaction.status === "success" ? (
                            <CheckCircle size={14} className="text-green-500" />
                          ) : (
                            <XCircle size={14} className="text-red-500" />
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">{transaction.subtitle}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <p className="text-xs text-muted-foreground">{transaction.time}</p>
                          <Badge 
                            variant={transaction.status === "success" ? "secondary" : "destructive"}
                            className="text-xs"
                          >
                            {transaction.status}
                          </Badge>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className={`font-semibold text-sm ${
                          transaction.status === "success"
                            ? transaction.type === "credit" 
                              ? "text-green-500" 
                              : "text-red-500"
                            : "text-muted-foreground"
                        }`}>
                          {transaction.type === "credit" ? "+" : "-"}₹{transaction.amount.toLocaleString()}
                        </p>
                        <p className="text-xs text-muted-foreground">{transaction.id}</p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}

        {filteredTransactions.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="w-16 h-16 mx-auto mb-4 bg-muted/50 rounded-full flex items-center justify-center">
              <Search size={24} className="text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-2">No transactions found</h3>
            <p className="text-muted-foreground text-sm">
              Try adjusting your search or filter criteria
            </p>
          </motion.div>
        )}
      </div>

      <BottomNavigation />
    </div>
  );
};

export default TransactionHistory;