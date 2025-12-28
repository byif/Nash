import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import NashLogo from "@/components/nash/NashLogo";
import AuthBackground from "@/components/nash/AuthBackground";
import PasswordInput from "@/components/nash/PasswordInput";
import { useToast } from "@/hooks/use-toast";
import { loginUser, googleLogin } from "@/lib/api";

/* 🔹 ADD THIS */
declare global {
  interface Window {
    google: any;
  }
}

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  /* 🔹 GOOGLE INIT */
  useEffect(() => {
    const initGoogle = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          // ✅ SAME CLIENT ID AS SIGNUP
          client_id: "1080342829678-phddgtrucl4q2d86bptp0rjupcb8ajtk.apps.googleusercontent.com",
          callback: handleGoogleLogin,
          use_fedcm_for_prompt: false,
          auto_select: false,
        });
      }
    };

    const timer = setTimeout(initGoogle, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleGoogleLogin = async (response: any) => {
    setIsLoading(true);
    setError("");

    try {
      const res = await googleLogin(response.credential);

      if (res.error) {
        throw new Error(res.error);
      }

      const user = res.user || res; // ✅ SAFE
      localStorage.setItem("user", JSON.stringify(user));

      toast({
        title: "Logged in with Google",
        description: "Welcome back to NASH 🚀",
      });

      navigate("/chat");
    } catch (err: any) {
      setError(err.message || "Google login failed");
    } finally {
      setIsLoading(false);
    }
  };

  /* 🔹 NORMAL LOGIN */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!email || !password) {
      setError("Please enter email and password");
      setIsLoading(false);
      return;
    }

    try {
      const res = await loginUser({ email, password });

      if (!res.id) {
        setError(res.error || "Invalid credentials");
        return;
      }

      localStorage.setItem("user", JSON.stringify(res));

      toast({
        title: "Welcome back!",
        description: "You've successfully logged in to NASH.",
      });

      navigate("/chat");
    } catch {
      setError("Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthBackground>
      <div className="w-full max-w-md animate-scale-in">
        <div className="nash-card p-8 space-y-8">

          {/* Header */}
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <NashLogo size="lg" />
            </div>
            <h1 className="text-2xl font-display font-bold">
              Welcome back to NASH
            </h1>
            <p className="text-muted-foreground">
              Sign in to continue your conversations
            </p>
          </div>

          {error && (
            <div className="bg-destructive/10 text-destructive p-3 rounded-lg text-center">
              {error}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Password</Label>
              <PasswordInput value={password} onChange={setPassword} />
            </div>

            <Button
              type="submit"
              variant="nash"
              size="lg"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin mr-2" />
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative text-center text-xs uppercase text-muted-foreground">
            or continue with
          </div>

          {/* GOOGLE LOGIN */}
          <Button
            type="button"
            variant="nashSecondary"
            size="lg"
            className="w-full"
            onClick={() => window.google.accounts.id.prompt()}
            disabled={isLoading}
          >
            Continue with Google
          </Button>

          {/* Signup Link */}
          <p className="text-center text-sm text-muted-foreground">
            Don’t have an account?{" "}
            <Link to="/signup" className="text-primary hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </AuthBackground>
  );
};

export default Login;
