import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Wallet, ArrowLeft, ArrowRight, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const OTPVerification = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  const mobileNumber = location.state?.mobileNumber || "XXXXXXXXXX";

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleOtpChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Auto-focus next input
      if (value && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        nextInput?.focus();
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleVerifyOtp = async () => {
    const otpString = otp.join("");
    
    if (otpString.length !== 6) {
      toast({
        title: "Error",
        description: "Please enter complete 6-digit OTP",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      if (otpString === "123456") {
        toast({
          title: "Verification successful!",
          description: "Account verified. Redirecting to login...",
        });
        navigate("/login");
      } else {
        toast({
          title: "Invalid OTP",
          description: "Please check and try again",
          variant: "destructive"
        });
      }
    }, 1000);
  };

  const handleResendOtp = () => {
    setResendTimer(30);
    setOtp(["", "", "", "", "", ""]);
    toast({
      title: "OTP Sent",
      description: "New OTP sent to your mobile number",
    });
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="wallet-gradient w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-[var(--shadow-wallet)]"
          >
            <Shield className="w-10 h-10 text-white" />
          </motion.div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Verify OTP</h1>
          <p className="text-muted-foreground">
            Enter the 6-digit code sent to
          </p>
          <p className="text-sm font-medium text-foreground mt-1">
            +91 {mobileNumber.slice(0, 2)}****{mobileNumber.slice(-2)}
          </p>
        </div>

        {/* OTP Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="wallet-card"
        >
          <div className="space-y-6">
            <div className="space-y-2">
              <Label className="text-center block">Enter OTP</Label>
              <div className="flex gap-3 justify-center">
                {otp.map((digit, index) => (
                  <Input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-12 h-12 text-center text-lg font-bold wallet-input"
                  />
                ))}
              </div>
              <p className="text-xs text-center text-muted-foreground mt-2">
                Use 123456 for demo
              </p>
            </div>

            <Button
              onClick={handleVerifyOtp}
              disabled={loading}
              className="wallet-button-primary w-full"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Verifying...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  Verify & Continue
                  <ArrowRight size={18} />
                </div>
              )}
            </Button>

            {/* Resend OTP */}
            <div className="text-center">
              {resendTimer > 0 ? (
                <p className="text-sm text-muted-foreground">
                  Resend OTP in {resendTimer}s
                </p>
              ) : (
                <button
                  onClick={handleResendOtp}
                  className="text-sm text-primary hover:underline font-medium"
                >
                  Resend OTP
                </button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mt-6 text-center"
        >
          <Button
            variant="ghost"
            onClick={() => navigate("/signup")}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft size={16} className="mr-2" />
            Back to Signup
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default OTPVerification;