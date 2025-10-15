import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, TrendingUp, TrendingDown, DollarSign, PieChart as PieChartIcon, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import BottomNavigation from "@/components/BottomNavigation";
import { useWallet } from "@/contexts/WalletContext";

// Define fixed category data, colors, and mock spending (which should ideally come from WalletContext)
const CATEGORY_DATA = [
  { name: "Food & Dining", budget: 5000, color: "#FF6B6B" },
  { name: "Bills & Utilities", budget: 4000, color: "#4ECDC4" },
  { name: "Transportation", budget: 2500, color: "#45B7D1" },
  { name: "Entertainment", budget: 1500, color: "#96CEB4" },
  { name: "Shopping", budget: 2000, color: "#FFEAA7" },
];

const Budgeting = () => {
  const navigate = useNavigate();
  const { transactions } = useWallet();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Mock persistence for the overall monthly budget limit
  const [monthlyBudget, setMonthlyBudget] = useState(() => {
    const savedBudget = localStorage.getItem('monthlyBudget');
    return savedBudget ? parseFloat(savedBudget) : 15000;
  });
  
  const [budgetInput, setBudgetInput] = useState(monthlyBudget.toString());

  // Calculate total spending from all transactions (for simplicity, only sum debits)
  const totalSpent = transactions
    .filter(t => t.type === 'debit' && t.status === 'success')
    .reduce((sum, t) => sum + t.amount, 0);

  const remainingBudget = monthlyBudget - totalSpent;
  const budgetPercentage = Math.min(100, (totalSpent / monthlyBudget) * 100);

  // Calculate spending per fixed category based on transaction titles
  const getCategorySpending = useCallback(() => {
    const spendingMap = CATEGORY_DATA.map(cat => ({
      ...cat,
      amount: 0,
    }));

    transactions.forEach(t => {
      if (t.type === 'debit' && t.status === 'success') {
        const categoryName = CATEGORY_DATA.find(cat => t.title.toLowerCase().includes(cat.name.toLowerCase()))?.name || "Other";
        const categoryIndex = spendingMap.findIndex(cat => cat.name === categoryName);
        
        if (categoryIndex !== -1) {
          spendingMap[categoryIndex].amount += t.amount;
        } else {
          // If 'Other' category is needed, implement here. For now, we only track fixed ones.
        }
      }
    });

    return spendingMap.map(cat => ({
        ...cat,
        percentage: Math.min(100, (cat.amount / cat.budget) * 100)
    }));
  }, [transactions]);
  
  const categorySpendingData = getCategorySpending();

  const pieChartData = categorySpendingData
    .filter(item => item.amount > 0)
    .map(item => ({
        name: item.name,
        value: item.amount,
        color: item.color
    }));
    
  const handleSetBudget = () => {
    const newBudget = parseFloat(budgetInput);
    if (newBudget > 0) {
      setMonthlyBudget(newBudget);
      localStorage.setItem('monthlyBudget', newBudget.toString());
      setIsModalOpen(false);
    }
  };
  
  // Dummy weekly data for the line chart (can be refined later)
  const weeklySpendingData = [
    { week: "Wk 1", amount: 2400 },
    { week: "Wk 2", amount: 1800 },
    { week: "Wk 3", amount: 2200 },
    { week: "Wk 4", amount: 2350 },
  ];

  // Dummy insights based on current mock data
  const insights = [
    {
      type: "warning",
      title: "Close to Budget Limit",
      description: `You've used ${budgetPercentage.toFixed(0)}% of your total budget.`,
      icon: TrendingUp,
      color: "text-orange-500 bg-orange-500/10"
    },
    {
      type: "success",
      title: "Great Shopping Control!",
      description: "You're well under your shopping budget.",
      icon: TrendingDown,
      color: "text-green-500 bg-green-500/10"
    },
  ];


  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="p-6 pt-12 border-b border-border">
        <div className="flex items-center gap-4">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => navigate("/dashboard")}
          >
            <ArrowLeft size={20} />
          </Button>
          <h1 className="text-xl font-bold">Budget & Analytics</h1>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Monthly Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <h2 className="text-lg font-semibold flex justify-between items-center">
            December 2024 Overview
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="w-8 h-8 text-muted-foreground hover:text-primary">
                    <Edit size={16} />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Set Monthly Budget</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="budgetAmount">Total Monthly Limit (₹)</Label>
                    <Input
                      id="budgetAmount"
                      type="number"
                      placeholder="e.g., 20000"
                      value={budgetInput}
                      onChange={(e) => setBudgetInput(e.target.value)}
                      className="wallet-input"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button type="submit" onClick={handleSetBudget} className="wallet-button-primary">
                    Save Budget
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </h2>
          
          <Card className="p-6 wallet-gradient text-white">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <DollarSign className="w-8 h-8 mx-auto mb-2 text-white/80" />
                <p className="text-white/80 text-xs">Budget</p>
                <p className="font-bold text-lg">₹{monthlyBudget.toLocaleString()}</p>
              </div>
              <div className="text-center">
                <TrendingUp className="w-8 h-8 mx-auto mb-2 text-white/80" />
                <p className="text-white/80 text-xs">Spent</p>
                <p className="font-bold text-lg">₹{totalSpent.toLocaleString()}</p>
              </div>
              <div className="text-center">
                <TrendingDown className="w-8 h-8 mx-auto mb-2 text-white/80" />
                <p className="text-white/80 text-xs">Remaining</p>
                <p className={`font-bold text-lg ${remainingBudget < 0 ? 'text-red-300' : 'text-green-300'}`}>
                    ₹{remainingBudget.toLocaleString()}
                </p>
              </div>
            </div>
            
            <div className="mt-6">
              <div className="flex justify-between text-sm mb-2">
                <span>Budget Progress</span>
                <span>{budgetPercentage.toFixed(0)}%</span>
              </div>
              <Progress 
                value={budgetPercentage} 
                className="h-2 bg-white/20"
              />
            </div>
          </Card>
        </motion.div>

        {/* Category Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          <h2 className="text-lg font-semibold">Category Breakdown (Fixed)</h2>
          
          <Card className="p-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Pie Chart */}
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      dataKey="value"
                      labelLine={false}
                      // Only show label if the slice is large enough
                      label={({ name, percent }) => percent > 0.05 ? `${name} (${(percent * 100).toFixed(0)}%)` : ''}
                    >
                      {pieChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`₹${value.toLocaleString()}`, "Spent"]} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Category List */}
              <div className="space-y-3">
                {categorySpendingData.map((category, index) => (
                  <motion.div
                    key={category.name}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="space-y-2"
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: category.color }}
                        />
                        <span className="text-sm font-medium">{category.name}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        ₹{category.amount.toLocaleString()} / ₹{category.budget.toLocaleString()}
                      </span>
                    </div>
                    {/* Progress Bar */}
                    <div className="h-2 rounded-full" style={{ background: `${category.color}20` }}>
                      <div 
                        className="h-2 rounded-full" 
                        style={{ 
                          width: `${category.percentage}%`, 
                          backgroundColor: category.color 
                        }}
                      />
                    </div>
                    {/* Alert for budget overuse */}
                    {category.amount > category.budget && (
                        <p className="text-xs text-destructive mt-1">
                            Over budget by ₹{(category.amount - category.budget).toLocaleString()}!
                        </p>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Weekly Spending Trend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-4"
        >
          <h2 className="text-lg font-semibold">Weekly Spending Trend</h2>
          
          <Card className="p-6">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weeklySpendingData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="week" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" tickFormatter={(value) => `₹${value / 1000}k`} />
                  <Tooltip formatter={(value) => [`₹${value.toLocaleString()}`, "Spent"]} />
                  <Line 
                    type="monotone" 
                    dataKey="amount" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={3}
                    dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </motion.div>

        {/* Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="space-y-4"
        >
          <h2 className="text-lg font-semibold">Smart Insights</h2>
          
          <div className="space-y-3">
            {insights.map((insight, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
              >
                <Card className="p-4">
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${insight.color}`}>
                      <insight.icon size={20} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-sm">{insight.title}</h3>
                      <p className="text-xs text-muted-foreground mt-1">{insight.description}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default Budgeting;
