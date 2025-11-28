import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Home, 
  QrCode, 
  Send, 
  Receipt, 
  History, 
  PieChart 
} from "lucide-react";

const BottomNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { icon: Home, label: "Home", path: "/dashboard" },
    { icon: QrCode, label: "Scan QR", path: "/scan-qr" },
    { icon: Send, label: "Send", path: "/send-money" },
    { icon: Receipt, label: "Bills", path: "/bill-payments" },
    { icon: History, label: "History", path: "/transaction-history" },
    { icon: PieChart, label: "Budget", path: "/budgeting" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed bottom-0 left-0 right-0 bg-card border-t border-border px-2 py-2 safe-area-padding-bottom"
    >
      <div className="flex justify-around items-center max-w-md mx-auto">
        {navItems.map(({ icon: Icon, label, path }) => (
          <motion.button
            key={path}
            onClick={() => navigate(path)}
            className={`bottom-nav-item ${isActive(path) ? "bottom-nav-active" : ""}`}
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.05 }}
          >
            <Icon size={20} />
            <span className="text-xs mt-1 font-medium">{label}</span>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};

export default BottomNavigation;