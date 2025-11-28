import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import { WalletProvider } from "@/contexts/WalletContext";

// Pages
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import OTPVerification from "./pages/OTPVerification";
import Dashboard from "./pages/Dashboard";
import ScanQR from "./pages/ScanQR";
import SendMoney from "./pages/SendMoney";
import BillPayments from "./pages/BillPayments";
import TransactionHistory from "./pages/TransactionHistory";
import Budgeting from "./pages/Budgeting";
import AddMoney from "./pages/AddMoney";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WalletProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
          <div className="min-h-screen bg-background">
            <Routes>
              {/* Authentication Routes */}
              <Route path="/signup" element={<Signup />} />
              <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
              <Route path="/verify-otp" element={<OTPVerification />} />
              
              {/* Protected Routes */}
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/scan-qr" element={<ScanQR />} />
              <Route path="/send-money" element={<SendMoney />} />
              <Route path="/bill-payments" element={<BillPayments />} />
              <Route path="/transaction-history" element={<TransactionHistory />} />
              <Route path="/budgeting" element={<Budgeting />} />
              <Route path="/add-money" element={<AddMoney />} />
              
              {/* Root redirect */}
              <Route path="/" element={<Navigate to="/login" replace />} />
              
              {/* 404 Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </BrowserRouter>
        </WalletProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
