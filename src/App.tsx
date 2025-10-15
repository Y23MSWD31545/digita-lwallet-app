import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import { ThemeProvider } from "next-themes"; // [New Import]
import { WalletProvider } from "@/contexts/WalletContext";
import { UserProvider } from "@/contexts/UserContext";

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
import Settings from "./pages/Settings"; 

const queryClient = new QueryClient();

// Protected Route Wrapper remains the same
const ProtectedRoute = ({ element, isAuthenticated }: { element: JSX.Element, isAuthenticated: boolean }) => {
  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" replace />;
  }
  return element;
};

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <ThemeProvider // [New: ThemeProvider wrapper]
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <UserProvider>
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
                  <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} isAuthenticated={isAuthenticated} />} />
                  <Route path="/scan-qr" element={<ProtectedRoute element={<ScanQR />} isAuthenticated={isAuthenticated} />} />
                  <Route path="/send-money" element={<ProtectedRoute element={<SendMoney />} isAuthenticated={isAuthenticated} />} />
                  <Route path="/bill-payments" element={<ProtectedRoute element={<BillPayments />} isAuthenticated={isAuthenticated} />} />
                  <Route path="/transaction-history" element={<ProtectedRoute element={<TransactionHistory />} isAuthenticated={isAuthenticated} />} />
                  <Route path="/budgeting" element={<ProtectedRoute element={<Budgeting />} isAuthenticated={isAuthenticated} />} />
                  <Route path="/add-money" element={<ProtectedRoute element={<AddMoney />} isAuthenticated={isAuthenticated} />} />
                  <Route path="/settings" element={<ProtectedRoute element={<Settings />} isAuthenticated={isAuthenticated} />} />
                  
                  {/* Root redirect: Navigate users based on auth status */}
                  <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />} />
                  
                  {/* 404 Route */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </div>
            </BrowserRouter>
            </WalletProvider>
          </UserProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider> // [End ThemeProvider wrapper]
  );
};

export default App;
