import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Upload, Wallet, CheckCircle, XCircle, Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useWallet } from "@/contexts/WalletContext";
import { useToast } from "@/hooks/use-toast";
import BottomNavigation from "@/components/BottomNavigation";

const ScanQR = () => {
  const [step, setStep] = useState<"upload" | "amount" | "pin" | "processing" | "result">("upload");
  const [amount, setAmount] = useState("");
  const [pin, setPin] = useState("");
  const [merchant, setMerchant] = useState({ name: "", upiId: "" });
  const [paymentResult, setPaymentResult] = useState<{ success: boolean; transactionId?: string }>({ success: false });
  const navigate = useNavigate();
  const { processPayment } = useWallet();
  const { toast } = useToast();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Simulate QR processing
      setTimeout(() => {
        const mockMerchant = {
          name: "Coffee Shop Express",
          upiId: "coffeeshop@paytm"
        };
        setMerchant(mockMerchant);
        setStep("amount");
        toast({
          title: "QR Code Scanned!",
          description: "Merchant details loaded successfully",
        });
      }, 1000);
    }
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
      merchant.name || merchant.upiId,
      "qr_payment",
      "QR Payment"
    );

    setPaymentResult({ 
      success, 
      transactionId: success ? `TXN${Math.random().toString(36).substr(2, 9).toUpperCase()}` : undefined 
    });
    setStep("result");
  };

  const quickAmounts = [100, 200, 500, 1000];

  // Upload QR Step
  if (step === "upload") {
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
            <h1 className="text-xl font-bold">Scan QR Code</h1>
          </div>
        </div>

        <div className="p-6 flex-1 flex flex-col items-center justify-center space-y-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-64 h-64 border-2 border-dashed border-border rounded-2xl flex flex-col items-center justify-center bg-muted/50"
          >
            <Upload size={48} className="text-muted-foreground mb-4" />
            <p className="text-center text-muted-foreground mb-4">
              Upload QR code from gallery<br />or scan directly
            </p>
            <Button
              onClick={() => fileInputRef.current?.click()}
              className="wallet-button-primary"
            >
              <Upload size={16} className="mr-2" />
              Upload QR
            </Button>
          </motion.div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileUpload}
          />
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
              onClick={() => setStep("upload")}
            >
              <ArrowLeft size={20} />
            </Button>
            <h1 className="text-xl font-bold">Enter Amount</h1>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Merchant Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-2"
          >
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Wallet size={24} className="text-primary" />
            </div>
            <h2 className="text-xl font-semibold">{merchant.name}</h2>
            <p className="text-muted-foreground">{merchant.upiId}</p>
          </motion.div>

          {/* Amount Input */}
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

            {/* Quick Amount Buttons */}
            <div className="grid grid-cols-2 gap-3">
              {quickAmounts.map((quickAmount) => (
                <Button
                  key={quickAmount}
                  variant="outline"
                  onClick={() => setAmount(quickAmount.toString())}
                  className="h-12"
                >
                  ₹{quickAmount}
                </Button>
              ))}
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
              <p className="text-muted-foreground">Pay to: {merchant.name}</p>
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
              {/* PIN Input */}
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
          <p className="text-muted-foreground">Please wait while we process your payment</p>
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
          <p className="text-muted-foreground">To: {merchant.name}</p>
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
              setStep("upload");
              setAmount("");
              setPin("");
              setMerchant({ name: "", upiId: "" });
              setPaymentResult({ success: false });
            }}
            variant="outline"
            className="w-full"
          >
            Make Another Payment
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default ScanQR;