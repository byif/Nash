import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import NashLogo from "@/components/nash/NashLogo";
import AuthBackground from "@/components/nash/AuthBackground";
import PasswordInput from "@/components/nash/PasswordInput";
import PasswordStrength from "@/components/nash/PasswordStrength";
import { useToast } from "@/hooks/use-toast";
import { signupUser, googleLogin } from "@/lib/api";

declare global {
  interface Window {
    google: any;
  }
}

const Signup = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  /* GOOGLE INIT */
  useEffect(() => {
    const initializeGoogle = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          // REPLACE WITH YOUR ACTUAL CLIENT ID FROM GOOGLE CLOUD CONSOLE
          client_id: "1080342829678-phddgtrucl4q2d86bptp0rjupcb8ajtk.apps.googleusercontent.com",
          callback: handleGoogleSignup,
          use_fedcm_for_prompt: false,
          auto_select: false,
        });
      }
    };
    
    // Small delay to ensure the script is loaded
    const timer = setTimeout(initializeGoogle, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleGoogleSignup = async (response: any) => {
    setIsLoading(true);
    try {
      // response.credential is the JWT token from Google
      const res = await googleLogin(response.credential);

      if (res.error) {
        throw new Error(res.error);
      }

      localStorage.setItem("user", JSON.stringify(res));

      toast({
        title: "Signed up with Google",
        description: "Welcome to NASH 🚀",
      });

      navigate("/chat");
    } catch (err: any) {
      setError(err.message || "Google signup failed");
    } finally {
      setIsLoading(false);
    }
  };

  /* NORMAL SIGNUP */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!fullName || !email || !password || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      const res = await signupUser({
        name: fullName,
        email,
        password,
      });

      if (res.error || !res.id) {
        setError(res.error || "Signup failed");
        return;
      }

      localStorage.setItem("user", JSON.stringify(res));
      toast({ title: "Account created!", description: "Welcome to NASH 🎉" });
      navigate("/chat");
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthBackground>
      <div className="w-full max-w-md animate-scale-in">
        <div className="nash-card p-8 space-y-6 bg-card border rounded-xl shadow-xl">
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <NashLogo size="lg" />
            </div>
            <h1 className="text-2xl font-display font-bold">Create your NASH account</h1>
            <p className="text-muted-foreground">Connect. Chat. Collaborate.</p>
          </div>

          {error && (
            <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-lg text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="John Doe" />
            </div>

            <div className="space-y-2">
              <Label>Email</Label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="john@example.com" />
            </div>

            <div className="space-y-2">
              <Label>Password</Label>
              <PasswordInput value={password} onChange={setPassword} />
              <PasswordStrength password={password} />
            </div>

            <div className="space-y-2">
              <Label>Confirm Password</Label>
              <PasswordInput value={confirmPassword} onChange={setConfirmPassword} />
            </div>

            <Button type="submit" variant="nash" className="w-full py-6 text-lg" disabled={isLoading}>
              {isLoading ? <Loader2 className="animate-spin mr-2" /> : "Create Account"}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-card px-2 text-muted-foreground">Or continue with</span></div>
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full py-6 font-semibold flex items-center justify-center gap-2"
            onClick={() => window.google.accounts.id.prompt()}
            disabled={isLoading}
          >
            <img src="https://www.gstatic.com/images/branding/googleg/svg/google_g_logo.svg" className="w-5 h-5" alt="Google" />
            Google
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="text-primary font-semibold hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </AuthBackground>
  );
};

export default Signup;