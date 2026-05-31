import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { BookOpen, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:9000";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const [message, setMessage] = useState("Verifying your email...");

  useEffect(() => {
    const token = searchParams.get("token");
    const email = searchParams.get("email");

    if (!token || !email) {
      setStatus("error");
      setMessage("This verification link is missing required information.");
      return;
    }

    fetch(
      `${API_URL}/api/auth/verify-email?token=${encodeURIComponent(token)}&email=${encodeURIComponent(email)}`,
    )
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Verification failed");
        setStatus("success");
        setMessage(data.message || "Email verified. You can now log in.");
      })
      .catch((error) => {
        setStatus("error");
        setMessage(error.message || "Verification failed.");
      });
  }, [searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-black via-gray-900 to-black">
      <Card className="w-full max-w-md border-white/10 bg-white/5 backdrop-blur-sm text-white">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="h-12 w-12 rounded-xl bg-yellow-400 flex items-center justify-center">
              <BookOpen className="h-6 w-6 text-black" />
            </div>
          </div>
          <CardTitle className="text-2xl text-white">Email Verification</CardTitle>
          <CardDescription className="text-gray-400">{message}</CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-5">
          {status === "success" && (
            <CheckCircle2 className="h-14 w-14 text-yellow-400 mx-auto" />
          )}
          {status === "error" && (
            <XCircle className="h-14 w-14 text-red-400 mx-auto" />
          )}
          {status !== "loading" && (
            <Link to="/login">
              <Button className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold border-0">
                Go to Login
              </Button>
            </Link>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default VerifyEmail;
