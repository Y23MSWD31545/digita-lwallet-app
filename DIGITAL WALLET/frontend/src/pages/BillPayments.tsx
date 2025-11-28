import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Zap, Smartphone, Fuel, Tv, CheckCircle, XCircle, Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useWallet } from "@/contexts/WalletContext";
import { useToast } from "@/hooks/use-toast";
import BottomNavigation from "@/components/BottomNavigation";

const BillPayments = () => {
  const [step, setStep] = useState<"category" | "details" | "amount" | "pin" | "processing" | "result">("category");
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [billDetails, setBillDetails] = useState("");
  const [amount, setAmount] = useState("");
  const [pin, setPin] = useState("");
  const [paymentResult, setPaymentResult] = useState<{ success: boolean; transactionId?: string }>({ success: false });
  const navigate = useNavigate();
  const { processPayment } = useWallet();
  const { toast } = useToast();

  const billCategories = [
    {
      id: "electricity",
      label: "Electricity",
      icon: Zap,
      color: "from-yellow-500 to-orange-500",
      placeholder: "Enter consumer number"
    },
    {
      id: "mobile",
      label: "Mobile Recharge",
      icon: Smartphone,
      color: "from-blue-500 to-indigo-500",
      placeholder: "Enter mobile number"
    },
    {
      id: "gas",
      label: "Gas Bill",
      icon: Fuel,
      color: "from-red-500 to-pink-500",
      placeholder: "Enter consumer number"
    },
    {
      id: "dth",
      label: "DTH/Cable",
      icon: Tv,
      color: "from-purple-500 to-violet-500",
      placeholder: "Enter subscriber ID"
    }
  ];

  const handleCategorySelect = (category: any) => {
    setSelectedCategory(category);
    setStep("details");
  };

  const handleDetailsSubmit = () => {
    if (!billDetails || billDetails.length < 5) {
      toast({
        title: "Invalid Details",
        description: "Please enter valid bill details",
        variant: "destructive",
      });
      return;
    }
    setStep("amount");
  };

  const handleAmountSubmit = () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount",
        variant: "destructive",
      });
      return;
    }
    setStep("pin");
  };

  const handlePayment = async () => {
    if (pin !== "1234") {
      toast({
        title: "Invalid PIN",
        description: "Please enter the correct wallet PIN",
        variant: "destructive",
      });
      return;
    }

    setStep("processing");
    
    const success = await processPayment(
      parseFloat(amount),
      `${selectedCategory.label} - ${billDetails}`,
      "bill_payment",
      selectedCategory.label
    );

    setPaymentResult({ 
      success, 
      transactionId: success ? `TXN${Math.random().toString(36).substr(2, 9).toUpperCase()}` : undefined 
    });
    setStep("result");
  };

  // Category Selection Step
  if (step === "category") {
    return (
      <div className="min-h-screen bg-background pb-20">
        <div className="p-6 pt-12 border-b border-border">
          <div className="flex items-center gap-4">
            <Button
              size="icon"
              variant="ghost"
              onClick={() => navigate("/dashboard")}
            >
              <ArrowLeft size={20} />
            </Button>
            <h1 className="text-xl font-bold">Pay Bills</h1>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <h2 className="text-lg font-semibold">Select Bill Category</h2>
            <div className="grid grid-cols-2 gap-4">
              {billCategories.map((category, index) => (
                <motion.button
                  key={category.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleCategorySelect(category)}
                  className={`bg-gradient-to-r ${category.color} p-6 rounded-xl text-white shadow-lg hover:shadow-xl transition-all`}
                >
                  <category.icon size={32} className="mb-3" />
                  <p className="font-semibold">{category.label}</p>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Recent Bills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-3"
          >
            <h3 className="text-sm font-medium text-muted-foreground">Recent Bills</h3>
            <div className="space-y-2">
              {[
                { type: "Electricity", provider: "MSEB", amount: 1200 },
                { type: "Mobile", provider: "Airtel", amount: 299 },
                { type: "Gas", provider: "Indane", amount: 850 }
              ].map((bill, index) => (
                <Card
                  key={index}
                  className="p-3 cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => {
                    const category = billCategories.find(c => c.label.includes(bill.type));
                    if (category) {
                      setSelectedCategory(category);
                      setBillDetails(`${bill.provider} - ****1234`);
                      setAmount(bill.amount.toString());
                      setStep("pin");
                    }
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <Zap size={16} className="text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{bill.type}</p>
                        <p className="text-xs text-muted-foreground">{bill.provider} - ****1234</p>
                      </div>
                    </div>
                    <p className="font-semibold text-sm">₹{bill.amount}</p>
                  </div>
                </Card>
              ))}
            </div>
          </motion.div>
        </div>

        <BottomNavigation />
      </div>
    );
  }

  // Bill Details Entry Step
  if (step === "details") {
    return (
      <div className="min-h-screen bg-background pb-20">
        <div className="p-6 pt-12 border-b border-border">
          <div className="flex items-center gap-4">
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setStep("category")}
            >
              <ArrowLeft size={20} />
            </Button>
            <h1 className="text-xl font-bold">{selectedCategory.label}</h1>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-4"
          >
            <div className={`w-16 h-16 bg-gradient-to-r ${selectedCategory.color} rounded-full flex items-center justify-center mx-auto`}>
              <selectedCategory.icon size={24} className="text-white" />
            </div>
            <h2 className="text-xl font-semibold">{selectedCategory.label}</h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-4"
          >
            <Input
              placeholder={selectedCategory.placeholder}
              value={billDetails}
              onChange={(e) => setBillDetails(e.target.value)}
              className="h-14 wallet-input"
              autoFocus
            />
          </motion.div>

          <Button
            onClick={handleDetailsSubmit}
            disabled={!billDetails}
            className="w-full h-14 text-lg font-semibold wallet-button-primary"
          >
            Continue
          </Button>
        </div>

        <BottomNavigation />
      </div>
    );
  }

  // Amount Entry Step
  if (step === "amount") {
    return (
      <div className="min-h-screen bg-background pb-20">
        <div className="p-6 pt-12 border-b border-border">
          <div className="flex items-center gap-4">
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setStep("details")}
            >
              <ArrowLeft size={20} />
            </Button>
            <h1 className="text-xl font-bold">Enter Amount</h1>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-2"
          >
            <div className={`w-16 h-16 bg-gradient-to-r ${selectedCategory.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
              <selectedCategory.icon size={24} className="text-white" />
            </div>
            <h2 className="text-xl font-semibold">{selectedCategory.label}</h2>
            <p className="text-muted-foreground">{billDetails}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-4"
          >
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold">₹</span>
              <Input
                type="number"
                placeholder="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pl-10 text-2xl font-bold h-16 wallet-input"
                autoFocus
              />
            </div>
          </motion.div>

          <Button
            onClick={handleAmountSubmit}
            disabled={!amount || parseFloat(amount) <= 0}
            className="w-full h-14 text-lg font-semibold wallet-button-primary"
          >
            Continue
          </Button>
        </div>

        <BottomNavigation />
      </div>
    );
  }

  // PIN Entry Step
  if (step === "pin") {
    return (
      <div className="min-h-screen bg-background pb-20">
        <div className="p-6 pt-12 border-b border-border">
          <div className="flex items-center gap-4">
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setStep("amount")}
            >
              <ArrowLeft size={20} />
            </Button>
            <h1 className="text-xl font-bold">Enter PIN</h1>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-4"
          >
            <h2 className="text-xl font-semibold">Confirm Payment</h2>
            <div className="space-y-2">
              <p className="text-muted-foreground">Pay for: {selectedCategory.label}</p>
              <p className="text-sm text-muted-foreground">{billDetails}</p>
              <p className="text-3xl font-bold">₹{parseFloat(amount).toLocaleString()}</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-4"
          >
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-4">Enter your 4-digit wallet PIN</p>
              <div className="flex justify-center gap-3 mb-6">
                {[0, 1, 2, 3].map((index) => (
                  <div
                    key={index}
                    className="w-12 h-12 border-2 border-border rounded-lg flex items-center justify-center text-xl font-bold"
                  >
                    {pin[index] ? "•" : ""}
                  </div>
                ))}
              </div>
              <Input
                type="password"
                placeholder="Enter PIN"
                value={pin}
                onChange={(e) => setPin(e.target.value.slice(0, 4))}
                className="wallet-input text-center"
                maxLength={4}
                autoFocus
              />
            </div>
          </motion.div>

          <Button
            onClick={handlePayment}
            disabled={pin.length !== 4}
            className="w-full h-14 text-lg font-semibold wallet-button-primary"
          >
            Pay ₹{parseFloat(amount).toLocaleString()}
          </Button>
        </div>

        <BottomNavigation />
      </div>
    );
  }

  // Processing Step
  if (step === "processing") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold mb-2">Processing Payment...</h2>
          <p className="text-muted-foreground">Please wait while we process your bill payment</p>
        </motion.div>
      </div>
    );
  }

  // Result Step
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="text-center max-w-sm mx-auto"
      >
        <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${
          paymentResult.success ? "bg-green-500/10" : "bg-red-500/10"
        }`}>
          {paymentResult.success ? (
            <CheckCircle size={40} className="text-green-500" />
          ) : (
            <XCircle size={40} className="text-red-500" />
          )}
        </div>
        
        <h2 className={`text-2xl font-bold mb-2 ${
          paymentResult.success ? "text-green-500" : "text-red-500"
        }`}>
          Payment {paymentResult.success ? "Successful!" : "Failed!"}
        </h2>
        
        <div className="space-y-2 mb-6">
          <p className="text-muted-foreground">Amount: ₹{parseFloat(amount).toLocaleString()}</p>
          <p className="text-muted-foreground">For: {selectedCategory.label}</p>
          <p className="text-sm text-muted-foreground">{billDetails}</p>
          {paymentResult.transactionId && (
            <p className="text-sm text-muted-foreground">Transaction ID: {paymentResult.transactionId}</p>
          )}
        </div>

        <div className="space-y-3">
          <Button
            onClick={() => navigate("/dashboard")}
            className="w-full wallet-button-primary"
          >
            Back to Dashboard
          </Button>
          <Button
            onClick={() => {
              setStep("category");
              setSelectedCategory(null);
              setBillDetails("");
              setAmount("");
              setPin("");
              setPaymentResult({ success: false });
            }}
            variant="outline"
            className="w-full"
          >
            Pay Another Bill
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default BillPayments;