import { useState } from "react";
import { Link } from "react-router-dom";
import { BookOpen, Mail, ArrowLeft } from "lucide-react";
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
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast({
        title: "Error",
        description: "Please enter your email.",
        variant: "destructive",
      });
      return;
    }
    setSent(true);
    toast({
      title: "Email sent!",
      description: "Check your inbox for reset instructions.",
    });
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
              ? "Check your email for a reset link."
              : "Enter your email to receive reset instructions."}
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
              >
                Send Reset Link
              </Button>
            </form>
          ) : (
            <div className="text-center space-y-4">
              <p className="text-sm text-gray-400">
                We've sent a password reset link to{" "}
                <strong className="text-white">{email}</strong>
              </p>
            </div>
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
