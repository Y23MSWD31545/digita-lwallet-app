import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Send, User, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useWallet } from "@/contexts/WalletContext";
import { useToast } from "@/hooks/use-toast";
import BottomNavigation from "@/components/BottomNavigation";

const SendMoney = () => {
  const [recipientUsername, setRecipientUsername] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [transactionDetails, setTransactionDetails] = useState<any>(null);
  
  const navigate = useNavigate();
  const { sendMoney, walletBalance } = useWallet();
  const { toast } = useToast();

  const quickAmounts = [100, 500, 1000, 2000];

  const handleSendMoney = async () => {
    if (!recipientUsername.trim()) {
      toast({
        title: "Error",
        description: "Please enter recipient's username",
        variant: "destructive",
      });
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid amount",
        variant: "destructive",
      });
      return;
    }

    const amountValue = parseFloat(amount);

    if (amountValue > walletBalance) {
      toast({
        title: "Insufficient Balance",
        description: `You don't have enough balance. Available: ₹${walletBalance}`,
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      const result = await sendMoney(amountValue, recipientUsername);
      
      setTransactionDetails({
        amount: amountValue,
        recipient: recipientUsername,
        referenceNumber: result.referenceNumber,
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString()
      });

      setIsProcessing(false);
      setShowSuccess(true);

      toast({
        title: "Success!",
        description: `₹${amountValue} sent to ${recipientUsername}`,
      });

      setTimeout(() => {
        navigate("/dashboard");
      }, 3000);

    } catch (error: any) {
      setIsProcessing(false);
      toast({
        title: "Transaction Failed",
        description: error.message || "Unable to send money. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (showSuccess && transactionDetails) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-6">
            <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={40} className="text-green-500" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Payment Successful!</h2>
            <p className="text-muted-foreground">
              ₹{transactionDetails.amount.toLocaleString()} sent successfully
            </p>
          </div>

          <Card className="p-6 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Recipient</span>
              <span className="font-semibold">@{transactionDetails.recipient}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Amount</span>
              <span className="font-semibold text-green-500">₹{transactionDetails.amount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Reference No.</span>
              <span className="font-mono text-sm">{transactionDetails.referenceNumber}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Date & Time</span>
              <span className="text-sm">{transactionDetails.date} {transactionDetails.time}</span>
            </div>
          </Card>

          <div className="mt-6 space-y-3">
            <Button 
              onClick={() => navigate("/dashboard")} 
              className="w-full"
            >
              Back to Dashboard
            </Button>
            <Button 
              onClick={() => navigate("/transaction-history")} 
              variant="outline"
              className="w-full"
            >
              View Transaction History
            </Button>
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
          <p className="text-muted-foreground">
            Sending ₹{parseFloat(amount).toLocaleString()} to @{recipientUsername}
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="wallet-gradient p-6 pt-12">
        <div className="flex items-center gap-4 mb-4">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => navigate("/dashboard")}
            className="text-white hover:bg-white/10"
          >
            <ArrowLeft size={20} />
          </Button>
          <h1 className="text-xl font-bold text-white">Send Money</h1>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
          <p className="text-white/60 text-sm">Available Balance</p>
          <p className="text-white text-2xl font-bold">₹{walletBalance.toLocaleString()}</p>
        </div>
      </div>

      <div className="p-6 space-y-6 -mt-6">
        {/* Recipient Input */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <Card className="p-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="recipient">Recipient Username</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  id="recipient"
                  type="text"
                  placeholder="Enter username"
                  value={recipientUsername}
                  onChange={(e) => setRecipientUsername(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-bold">₹</span>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="pl-10 text-xl font-bold h-14"
                />
              </div>
            </div>

            {/* Quick Amount Buttons */}
            <div className="grid grid-cols-4 gap-2">
              {quickAmounts.map((quickAmount) => (
                <Button
                  key={quickAmount}
                  variant="outline"
                  size="sm"
                  onClick={() => setAmount(quickAmount.toString())}
                >
                  ₹{quickAmount}
                </Button>
              ))}
            </div>

            <div className="space-y-2">
              <Label htmlFor="note">Note (Optional)</Label>
              <Input
                id="note"
                type="text"
                placeholder="Add a note..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>
          </Card>
        </motion.div>

        {/* Warning */}
        {amount && parseFloat(amount) > walletBalance && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start gap-3 p-4 bg-destructive/10 border border-destructive/20 rounded-lg"
          >
            <AlertCircle className="text-destructive mt-0.5" size={18} />
            <div className="flex-1">
              <p className="text-sm font-medium text-destructive">Insufficient Balance</p>
              <p className="text-xs text-destructive/80 mt-1">
                You need ₹{(parseFloat(amount) - walletBalance).toLocaleString()} more to complete this transaction
              </p>
            </div>
          </motion.div>
        )}

        {/* Send Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Button
            onClick={handleSendMoney}
            disabled={!amount || !recipientUsername || parseFloat(amount) <= 0 || parseFloat(amount) > walletBalance || isProcessing}
            className="w-full h-14 text-lg font-semibold wallet-button-primary"
          >
            <Send size={20} className="mr-2" />
            Send ₹{amount ? parseFloat(amount).toLocaleString() : "0"}
          </Button>
        </motion.div>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default SendMoney;