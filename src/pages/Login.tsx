import { useState } from "react";
import { errorField, errorMessage } from "@/lib/utils";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
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
import { useEffect, useRef } from "react";
import { useTTS } from "@/hooks/useTTS";
// import { useVoiceCommands } from "@/hooks/useVoiceCommands";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const login = useAuthStore((s) => s.login);
  const navigate = useNavigate();
  const { toast } = useToast();

  const normalized_email_ref = useRef("");

  const flowStep = useRef(localStorage.getItem("voice_flow_step") || "idle");
  const voiceActive =
    flowStep.current === "login-email" ||
    flowStep.current === "login-password" ||
    flowStep.current === "login-ready";

  useEffect(() => {
    if (flowStep.current !== "login-email") return;
  }, []);

  const isEmail = (val: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);

  // Normalize speech-to-text email: "john at gmail dot com" → "john@gmail.com"
  const normalizeEmail = (val: string) =>
    val
      .toLowerCase()
      .replace(/\s+at\s+/g, "@")
      .replace(/\s+dot\s+/g, ".")
      .replace(/\s/g, "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }
    setLoading(true);
    try {
      const user = await login(email, password);
      toast({
        title: "Welcome back!",
        description: "You have been logged in successfully.",
        duration: 1000,
      });
      if (user.role === "admin" || user.role === "super-admin") {
        navigate("/dashboard");
      } else {
        navigate("/");
      }
    } catch (err: unknown) {
      if (errorField(err, "code") === "EMAIL_NOT_VERIFIED") {
        toast({
          title: "Email not verified",
          description: "Please verify your email to continue. We've taken you to the verification page.",
          variant: "destructive",
        });
        navigate(`/verify-email?email=${encodeURIComponent(email)}`);
        return;
      }
      toast({
        title: "Error",
        description: errorMessage(err, "Invalid credentials."),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-black via-gray-900 to-black">
      <Card className="w-full max-w-md border-white/10 bg-[#151517]/5 backdrop-blur-sm text-white">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Link to="/" className="text-xl font-bold text-white tracking-tight">
              School of Events Africa
            </Link>
          </div>
          <CardTitle className="text-2xl text-white">Welcome Back</CardTitle>
          <CardDescription className="text-gray-400">
            Sign in to continue your learning journey
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-300">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-white/60" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  className="pl-9 bg-[#151517]/10 border-white/20 text-white placeholder:text-white/60 focus-visible:ring-primary"
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
                <Lock className="absolute left-3 top-3 h-4 w-4 text-white/60" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="pl-9 pr-9 bg-[#151517]/10 border-white/20 text-white placeholder:text-white/60 focus-visible:ring-primary"
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
                    <EyeOff className="h-4 w-4 text-white/60" />
                  ) : (
                    <Eye className="h-4 w-4 text-white/60" />
                  )}
                </button>
              </div>
            </div>
            <div className="text-right">
              <Link
                to="/forgot-password"
                className="text-sm text-primary hover:text-primary/80"
              >
                Forgot password?
              </Link>
            </div>
            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold border-0 rounded-full"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
          <p className="text-center text-sm text-gray-400 mt-6">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-primary font-medium hover:text-primary/80"
            >
              Sign Up
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
