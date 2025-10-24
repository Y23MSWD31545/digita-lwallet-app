import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Plus, Wallet, CreditCard, Building, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useWallet } from "@/contexts/WalletContext";
import { useToast } from "@/hooks/use-toast";
import BottomNavigation from "@/components/BottomNavigation";

const AddMoney = () => {
  const [amount, setAmount] = useState("");
  const [selectedMethod, setSelectedMethod] = useState<"card" | "bank" | "upi">("card");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();
  const { addMoney } = useWallet(); // Use the new addMoney function
  const { toast } = useToast();

  const quickAmounts = [500, 1000, 2000, 5000];

  const paymentMethods = [
    { id: "card", label: "Credit/Debit Card", icon: CreditCard, details: "••••1234" },
    { id: "bank", label: "Bank Transfer", icon: Building, details: "SBI Bank" },
    { id: "upi", label: "UPI", icon: Wallet, details: "user@paytm" }
  ];

  const handleAddMoney = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      const amountValue = parseFloat(amount);
      
      // Call backend API to add money
      await addMoney(amountValue);

      setIsProcessing(false);
      setShowSuccess(true);

      toast({
        title: "Success!",
        description: `₹${amountValue.toLocaleString()} added to your wallet`,
      });

      // Redirect after success
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);

    } catch (error: any) {
      setIsProcessing(false);
      toast({
        title: "Error",
        description: error.message || "Failed to add money. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="text-center"
        >
          <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={40} className="text-green-500" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Money Added Successfully!</h2>
          <p className="text-muted-foreground mb-4">
            ₹{parseFloat(amount).toLocaleString()} has been added to your wallet
          </p>
          <div className="text-sm text-muted-foreground">
            Redirecting to dashboard...
          </div>
        </motion.div>
      </div>
    );
  }

  if (isProcessing) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold mb-2">Processing Payment...</h2>
          <p className="text-muted-foreground">Adding ₹{parseFloat(amount).toLocaleString()} to your wallet</p>
        </motion.div>
      </div>
    );
  }

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
          <h1 className="text-xl font-bold">Add Money</h1>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Amount Input */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <h2 className="text-lg font-semibold">Enter Amount</h2>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold">₹</span>
            <Input
              type="number"
              placeholder="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="pl-10 text-2xl font-bold h-16 wallet-input"
            />
          </div>

          {/* Quick Amount Buttons */}
          <div className="grid grid-cols-2 gap-3">
            {quickAmounts.map((quickAmount) => (
              <Button
                key={quickAmount}
                variant="outline"
                onClick={() => setAmount(quickAmount.toString())}
                className="h-12"
              >
                ₹{quickAmount.toLocaleString()}
              </Button>
            ))}
          </div>
        </motion.div>

        {/* Payment Methods */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-4"
        >
          <h2 className="text-lg font-semibold">Select Payment Method</h2>
          <div className="space-y-3">
            {paymentMethods.map((method) => (
              <Card
                key={method.id}
                className={`p-4 cursor-pointer transition-all ${
                  selectedMethod === method.id
                    ? "ring-2 ring-primary bg-primary/5"
                    : "hover:shadow-md"
                }`}
                onClick={() => setSelectedMethod(method.id as any)}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    selectedMethod === method.id
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}>
                    <method.icon size={18} />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{method.label}</p>
                    <p className="text-sm text-muted-foreground">{method.details}</p>
                  </div>
                  {selectedMethod === method.id && (
                    <CheckCircle size={20} className="text-primary" />
                  )}
                </div>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Add Money Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="pt-4"
        >
          <Button
            onClick={handleAddMoney}
            disabled={!amount || parseFloat(amount) <= 0 || isProcessing}
            className="w-full h-14 text-lg font-semibold wallet-button-primary"
          >
            Add ₹{amount ? parseFloat(amount).toLocaleString() : "0"} to Wallet
          </Button>
        </motion.div>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default AddMoney;