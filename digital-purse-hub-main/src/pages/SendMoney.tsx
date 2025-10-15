import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, User, Phone, Mail, CheckCircle, XCircle, Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useWallet } from "@/contexts/WalletContext";
import { useToast } from "@/hooks/use-toast";
import BottomNavigation from "@/components/BottomNavigation";

const SendMoney = () => {
  const [step, setStep] = useState<"recipient" | "amount" | "pin" | "processing" | "result">("recipient");
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [pin, setPin] = useState("");
  const [contactMethod, setContactMethod] = useState<"phone" | "username">("phone");
  const [paymentResult, setPaymentResult] = useState<{ success: boolean; transactionId?: string }>({ success: false });
  const navigate = useNavigate();
  const { processPayment } = useWallet();
  const { toast } = useToast();

  const quickAmounts = [500, 1000, 2000, 5000];

  const handleRecipientSubmit = () => {
    if (!recipient || recipient.length < 3) {
      toast({
        title: "Invalid Recipient",
        description: "Please enter a valid mobile number or username",
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
      recipient,
      "money_sent",
      "Money Sent"
    );

    setPaymentResult({ 
      success, 
      transactionId: success ? `TXN${Math.random().toString(36).substr(2, 9).toUpperCase()}` : undefined 
    });
    setStep("result");
  };

  // Recipient Entry Step
  if (step === "recipient") {
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
            <h1 className="text-xl font-bold">Send Money</h1>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Contact Method Selection */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <h2 className="text-lg font-semibold">Send money to</h2>
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant={contactMethod === "phone" ? "default" : "outline"}
                onClick={() => setContactMethod("phone")}
                className="h-12 flex items-center gap-2"
              >
                <Phone size={16} />
                Phone
              </Button>
              <Button
                variant={contactMethod === "username" ? "default" : "outline"}
                onClick={() => setContactMethod("username")}
                className="h-12 flex items-center gap-2"
              >
                <User size={16} />
                Username
              </Button>
            </div>
          </motion.div>

          {/* Recipient Input */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-4"
          >
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2">
                {contactMethod === "phone" ? <Phone size={20} className="text-muted-foreground" /> : <User size={20} className="text-muted-foreground" />}
              </div>
              <Input
                placeholder={contactMethod === "phone" ? "Enter mobile number" : "Enter username"}
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                className="pl-14 h-14 wallet-input"
                type={contactMethod === "phone" ? "tel" : "text"}
                autoFocus
              />
            </div>
          </motion.div>

          {/* Recent Contacts */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-3"
          >
            <h3 className="text-sm font-medium text-muted-foreground">Recent Contacts</h3>
            <div className="space-y-2">
              {["John Doe", "Sarah Wilson", "Mike Johnson"].map((contact, index) => (
                <Card
                  key={contact}
                  className="p-3 cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => setRecipient(contact)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <User size={16} className="text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{contact}</p>
                      <p className="text-xs text-muted-foreground">+91 98765 432{index + 1}0</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </motion.div>

          <Button
            onClick={handleRecipientSubmit}
            disabled={!recipient}
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
              onClick={() => setStep("recipient")}
            >
              <ArrowLeft size={20} />
            </Button>
            <h1 className="text-xl font-bold">Enter Amount</h1>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Recipient Display */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-2"
          >
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <User size={24} className="text-primary" />
            </div>
            <h2 className="text-xl font-semibold">Send money to</h2>
            <p className="text-muted-foreground">{recipient}</p>
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
                  ₹{quickAmount.toLocaleString()}
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
            <h2 className="text-xl font-semibold">Confirm Transfer</h2>
            <div className="space-y-2">
              <p className="text-muted-foreground">Send to: {recipient}</p>
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
            Send ₹{parseFloat(amount).toLocaleString()}
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
          <h2 className="text-xl font-semibold mb-2">Processing Transfer...</h2>
          <p className="text-muted-foreground">Please wait while we process your transfer</p>
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
          Transfer {paymentResult.success ? "Successful!" : "Failed!"}
        </h2>
        
        <div className="space-y-2 mb-6">
          <p className="text-muted-foreground">Amount: ₹{parseFloat(amount).toLocaleString()}</p>
          <p className="text-muted-foreground">To: {recipient}</p>
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
              setStep("recipient");
              setRecipient("");
              setAmount("");
              setPin("");
              setPaymentResult({ success: false });
            }}
            variant="outline"
            className="w-full"
          >
            Send Money Again
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default SendMoney;