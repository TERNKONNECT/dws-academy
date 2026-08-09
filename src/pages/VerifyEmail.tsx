import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { BookOpen, CheckCircle2, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:9000";
const RESEND_COOLDOWN_SECONDS = 30;

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const { toast } = useToast();

  const email = searchParams.get("email") || "";
  const [otp, setOtp] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(false);
  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => setCooldown((c) => Math.max(0, c - 1)), 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    if (otp.length !== 6) {
      toast({ title: "Error", description: "Enter the 6-digit code.", variant: "destructive" });
      return;
    }
    setVerifying(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/verify-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Verification failed");
      setVerified(true);
    } catch (err: any) {
      toast({
        title: "Verification failed",
        description: err.message || "Invalid or expired code.",
        variant: "destructive",
      });
    } finally {
      setVerifying(false);
    }
  };

  // Manual only — never fires automatically. The user must click this themselves.
  const handleResend = async () => {
    if (!email || cooldown > 0) return;
    setResending(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/resend-verification`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not resend code");
      toast({ title: "Code sent", description: "Check your inbox for a new 6-digit code." });
      setCooldown(RESEND_COOLDOWN_SECONDS);
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-black via-gray-900 to-black">
      <Card className="w-full max-w-md border-white/10 bg-[#151517]/5 backdrop-blur-sm text-white">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="h-12 w-12 rounded-xl bg-yellow-400 flex items-center justify-center">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl text-white">
            {verified ? "Email verified" : "Verify your email"}
          </CardTitle>
          <CardDescription className="text-gray-400">
            {verified
              ? "You can now log in."
              : email
                ? `Enter the 6-digit code sent to ${email}`
                : "This verification link is missing your email address."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {verified ? (
            <>
              <div className="flex justify-center">
                <CheckCircle2 className="h-14 w-14 text-yellow-400" />
              </div>
              <Link to="/login">
                <Button className="w-full bg-yellow-400 hover:bg-yellow-500 text-white font-bold border-0">
                  Continue to Login
                </Button>
              </Link>
            </>
          ) : email ? (
            <>
              <form onSubmit={handleVerify} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="otp" className="text-gray-300">
                    Verification Code
                  </Label>
                  <div className="relative">
                    <KeyRound className="absolute left-3 top-3 h-4 w-4 text-white/60" />
                    <Input
                      id="otp"
                      type="text"
                      inputMode="numeric"
                      placeholder="123456"
                      className="pl-9 tracking-widest bg-[#151517]/10 border-white/20 text-white placeholder:text-white/60 focus-visible:ring-yellow-400"
                      maxLength={6}
                      autoFocus
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                    />
                  </div>
                </div>
                <Button
                  type="submit"
                  className="w-full bg-yellow-400 hover:bg-yellow-500 text-white font-bold border-0"
                  disabled={verifying || otp.length !== 6}
                >
                  {verifying ? "Verifying..." : "Verify Email"}
                </Button>
              </form>
              <button
                type="button"
                className="w-full text-sm text-gray-400 hover:text-yellow-400 disabled:opacity-50 disabled:hover:text-gray-400"
                onClick={handleResend}
                disabled={resending || cooldown > 0}
              >
                {cooldown > 0
                  ? `Resend code in ${cooldown}s`
                  : resending
                    ? "Sending..."
                    : "Didn't get a code? Resend it"}
              </button>
            </>
          ) : (
            <Link to="/signup">
              <Button variant="outline" className="w-full">
                Back to Signup
              </Button>
            </Link>
          )}

          <div className="text-center">
            <Link to="/login" className="text-sm text-yellow-400 hover:text-yellow-300">
              Back to Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VerifyEmail;
