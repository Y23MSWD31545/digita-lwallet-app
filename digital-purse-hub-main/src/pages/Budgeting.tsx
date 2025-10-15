import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, TrendingUp, TrendingDown, DollarSign, PieChart as PieChartIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import BottomNavigation from "@/components/BottomNavigation";

const Budgeting = () => {
  const navigate = useNavigate();

  const monthlyBudget = 15000;
  const totalSpent = 8750;
  const remainingBudget = monthlyBudget - totalSpent;

  const categoryData = [
    { name: "Food & Dining", amount: 3200, budget: 5000, color: "#FF6B6B", percentage: 64 },
    { name: "Bills & Utilities", amount: 2800, budget: 4000, color: "#4ECDC4", percentage: 70 },
    { name: "Transportation", amount: 1500, budget: 2500, color: "#45B7D1", percentage: 60 },
    { name: "Entertainment", amount: 800, budget: 1500, color: "#96CEB4", percentage: 53 },
    { name: "Shopping", amount: 450, budget: 2000, color: "#FFEAA7", percentage: 23 },
  ];

  const pieChartData = categoryData.map(item => ({
    name: item.name,
    value: item.amount,
    color: item.color
  }));

  const weeklySpendingData = [
    { week: "Week 1", amount: 2400 },
    { week: "Week 2", amount: 1800 },
    { week: "Week 3", amount: 2200 },
    { week: "Week 4", amount: 2350 },
  ];

  const insights = [
    {
      type: "warning",
      title: "Bills & Utilities Over Budget",
      description: "You've exceeded your utility budget by ₹800 this month",
      icon: TrendingUp,
      color: "text-orange-500 bg-orange-500/10"
    },
    {
      type: "success",
      title: "Great Shopping Control!",
      description: "You're 77% under your shopping budget. Keep it up!",
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
          <h2 className="text-lg font-semibold">December 2024 Overview</h2>
          
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
                <p className="font-bold text-lg">₹{remainingBudget.toLocaleString()}</p>
              </div>
            </div>
            
            <div className="mt-6">
              <div className="flex justify-between text-sm mb-2">
                <span>Budget Progress</span>
                <span>{Math.round((totalSpent / monthlyBudget) * 100)}%</span>
              </div>
              <Progress 
                value={(totalSpent / monthlyBudget) * 100} 
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
          <h2 className="text-lg font-semibold">Category Breakdown</h2>
          
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
                    >
                      {pieChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `₹${value}`} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Category List */}
              <div className="space-y-3">
                {categoryData.map((category, index) => (
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
                        ₹{category.amount} / ₹{category.budget}
                      </span>
                    </div>
                    <Progress 
                      value={category.percentage} 
                      className="h-2"
                      style={{ 
                        background: `${category.color}20`,
                      }}
                    />
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
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`₹${value}`, "Spent"]} />
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

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="space-y-4"
        >
          <h2 className="text-lg font-semibold">Quick Actions</h2>
          
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" className="h-16 flex-col gap-2">
              <PieChartIcon size={20} />
              <span className="text-sm">Set Budget</span>
            </Button>
            <Button variant="outline" className="h-16 flex-col gap-2">
              <TrendingUp size={20} />
              <span className="text-sm">View Report</span>
            </Button>
          </div>
        </motion.div>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default Budgeting;