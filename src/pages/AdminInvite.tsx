import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { BookOpen, CheckCircle2, Lock, XCircle } from "lucide-react";
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
import { useAuthStore } from "@/stores/authStore";
import type { User } from "@/types";

const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:9000";

const AdminInvite = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    "loading",
  );
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("Checking your admin invitation...");
  const [submitting, setSubmitting] = useState(false);

  const token = searchParams.get("token") || "";
  const inviteEmail = searchParams.get("email") || "";

  useEffect(() => {
    if (!token || !inviteEmail) {
      setStatus("error");
      setMessage("This invitation link is missing required information.");
      return;
    }

    fetch(
      `${API_URL}/api/auth/admin-invite?token=${encodeURIComponent(token)}&email=${encodeURIComponent(inviteEmail)}`,
    )
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Invitation failed");
        setName(data.name);
        setEmail(data.email);
        setStatus("ready");
        setMessage("Create your password to activate your admin account.");
      })
      .catch((error) => {
        setStatus("error");
        setMessage(error.message || "Invitation failed.");
      });
  }, [inviteEmail, token]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      toast({
        title: "Password too short",
        description: "Password must be at least 6 characters.",
        variant: "destructive",
      });
      return;
    }
    if (password !== confirmPassword) {
      toast({
        title: "Passwords do not match",
        description: "Enter the same password in both fields.",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/admin-invite/accept`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to accept invitation");

      const user: User = {
        id: data.user._id ?? data.user.id,
        name: data.user.name,
        email: data.user.email,
        role: data.user.role,
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${data.user.name}`,
        joinedAt: data.user.createdAt,
      };

      localStorage.setItem("lms_token", data.token);
      localStorage.setItem("lms_user", JSON.stringify(user));
      useAuthStore.setState({
        user,
        token: data.token,
        isAuthenticated: true,
      });

      toast({
        title: "Admin account ready",
        description: data.message || "You can now use the dashboard.",
      });
      navigate("/dashboard", { replace: true });
    } catch (error) {
      toast({
        title: "Invite failed",
        description:
          error instanceof Error
            ? error.message
            : "Failed to accept invitation.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
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
          <CardTitle className="text-2xl text-white">Admin Invitation</CardTitle>
          <CardDescription className="text-gray-400">{message}</CardDescription>
        </CardHeader>
        <CardContent>
          {status === "loading" && (
            <div className="flex justify-center py-6">
              <div className="h-10 w-10 rounded-full border-2 border-yellow-400 border-t-transparent animate-spin" />
            </div>
          )}

          {status === "error" && (
            <div className="space-y-5 text-center">
              <XCircle className="h-14 w-14 text-red-400 mx-auto" />
              <Button asChild className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold border-0">
                <Link to="/login">Go to Login</Link>
              </Button>
            </div>
          )}

          {status === "ready" && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="rounded-lg border border-white/10 bg-white/10 p-3">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 text-yellow-400" />
                  <div>
                    <p className="font-medium text-white">{name}</p>
                    <p className="text-sm text-gray-400">{email}</p>
                  </div>
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
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-9 bg-white/10 border-white/20 text-white placeholder:text-gray-500 focus-visible:ring-yellow-400"
                    placeholder="Create password"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password" className="text-gray-300">
                  Confirm Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                  <Input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-9 bg-white/10 border-white/20 text-white placeholder:text-gray-500 focus-visible:ring-yellow-400"
                    placeholder="Confirm password"
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold border-0"
                disabled={submitting}
              >
                {submitting ? "Creating..." : "Create Password"}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminInvite;
