import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

export default function AuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const setUser = useAuthStore((state) => state.setUser);

  useEffect(() => {
    const accessToken = searchParams.get("accessToken");
    const error = searchParams.get("error");
    
    if (error) {
      toast({
        title: "Authentication Failed",
        description: error,
        variant: "destructive"
      });
      navigate("/login");
      return;
    }

    if (accessToken) {
      // Decode JWT to get user details or fetch from an endpoint. 
      // For now, save token to localStorage and set a mock user to proceed to dashboard.
      localStorage.setItem("accessToken", accessToken);
      
      const payloadBase64 = accessToken.split('.')[1];
      let user = { id: "oauth-user", email: "", name: "OAuth User", role: "user" };
      if (payloadBase64) {
        try {
          const payload = JSON.parse(atob(payloadBase64));
          user = {
            id: payload.sub || "oauth-user",
            email: payload.email || "",
            name: payload.name || "OAuth User",
            role: payload.role || "user"
          };
        } catch (e) {
          console.error("Failed to decode token", e);
        }
      }
      
      setUser(user);
      
      toast({
        title: "Successfully logged in",
        description: "Welcome to the dashboard"
      });
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  }, [searchParams, navigate, setUser, toast]);

  return (
    <div className="min-h-screen bg-[#0D0D12] flex items-center justify-center">
      <div className="flex flex-col items-center space-y-4">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
        <h2 className="text-xl font-bold text-white tracking-widest uppercase">Authenticating...</h2>
        <p className="text-sm text-white/50">Please wait while we establish your secure session.</p>
      </div>
    </div>
  );
}
