import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BookOpen, Mail, Lock, User, Eye, EyeOff } from "lucide-react";
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
import { useAuthStore } from "@/stores/authStore";
import { useToast } from "@/hooks/use-toast";

import { useRef } from "react";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const signup = useAuthStore((s) => s.signup);
  const navigate = useNavigate();
  const { toast } = useToast();

  const flowStep = useRef(localStorage.getItem("voice_flow_step") || "idle");

  const voiceActive = [
    "signup-name",
    "signup-email",
    "signup-password",
    "signup-ready",
  ].includes(flowStep.current);

  const collectedRef = useRef({ name: "", email: "" });

  const isEmail = (val: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
  const normalizeEmail = (val: string) =>
    val
      .toLowerCase()
      .replace(/\s+at\s+/g, "@")
      .replace(/\s+dot\s+/g, ".")
      .replace(/\s/g, "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      toast({
        title: "Error",
        description: "Please fill in all fields.",
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
      const message = await signup(name, email, password);
      toast({
        title: "Check your email",
        description: message,
      });
      navigate("/login");
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Signup failed.",
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
          <CardTitle className="text-2xl text-white">Create Account</CardTitle>
          <CardDescription className="text-gray-400">
            Start your learning journey today
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-gray-300">
                Full Name
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                <Input
                  id="name"
                  placeholder="John Doe"
                  className="pl-9 bg-white/10 border-white/20 text-white placeholder:text-gray-500 focus-visible:ring-yellow-400"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>
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
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-300">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="pl-9 pr-9 bg-white/10 border-white/20 text-white placeholder:text-gray-500 focus-visible:ring-yellow-400"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute right-3 top-3"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Toggle password"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-500" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-500" />
                  )}
                </button>
              </div>
            </div>
            <Button
              type="submit"
              className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold border-0"
              disabled={loading}
            >
              {loading ? "Creating account..." : "Sign Up"}
            </Button>
          </form>
          <p className="text-center text-sm text-gray-400 mt-6">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-yellow-400 font-medium hover:text-yellow-300"
            >
              Log In
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Signup;
