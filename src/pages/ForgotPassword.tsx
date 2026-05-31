import { useState } from "react";
import { Link } from "react-router-dom";
import { BookOpen, Mail, ArrowLeft, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:9000";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast({
        title: "Error",
        description: "Please enter your email.",
        variant: "destructive",
      });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send reset code");
      setSent(true);
      toast({
        title: "Code sent",
        description: data.message || "Check your email for the reset code.",
      });
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to send reset code.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || !password) {
      toast({
        title: "Error",
        description: "Enter the OTP and your new password.",
        variant: "destructive",
      });
      return;
    }
    if (password.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters.",
        variant: "destructive",
      });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to reset password");
      toast({
        title: "Password reset",
        description: data.message || "You can now log in.",
      });
      setOtp("");
      setPassword("");
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to reset password.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-black via-gray-900 to-black">
      <Card className="w-full max-w-md border-white/10 bg-white/5 backdrop-blur-sm text-white">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="h-12 w-12 rounded-xl bg-yellow-400 flex items-center justify-center">
              <BookOpen className="h-6 w-6 text-black" />
            </div>
          </div>
          <CardTitle className="text-2xl text-white">Reset Password</CardTitle>
          <CardDescription className="text-gray-400">
            {sent
              ? "Enter the OTP from your email and choose a new password."
              : "Enter your email to receive a reset OTP."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!sent ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-300">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    className="pl-9 bg-white/10 border-white/20 text-white placeholder:text-gray-500 focus-visible:ring-yellow-400"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              <Button
                type="submit"
                className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold border-0"
                disabled={loading}
              >
                {loading ? "Sending..." : "Send Reset OTP"}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleReset} className="space-y-4">
              <p className="text-sm text-gray-400">
                We sent a password reset code to{" "}
                <strong className="text-white">{email}</strong>
              </p>
              <div className="space-y-2">
                <Label htmlFor="otp" className="text-gray-300">
                  OTP
                </Label>
                <Input
                  id="otp"
                  inputMode="numeric"
                  placeholder="123456"
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-500 focus-visible:ring-yellow-400"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-300">
                  New Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="New password"
                    className="pl-9 bg-white/10 border-white/20 text-white placeholder:text-gray-500 focus-visible:ring-yellow-400"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
              <Button
                type="submit"
                className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold border-0"
                disabled={loading}
              >
                {loading ? "Resetting..." : "Reset Password"}
              </Button>
            </form>
          )}
          <div className="mt-6 text-center">
            <Link
              to="/login"
              className="text-sm text-yellow-400 hover:text-yellow-300 inline-flex items-center gap-1"
            >
              <ArrowLeft className="h-3 w-3" /> Back to Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ForgotPassword;
