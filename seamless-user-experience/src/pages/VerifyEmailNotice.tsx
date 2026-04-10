import { Link } from "react-router-dom";
import { Mail, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function VerifyEmailNotice() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0D0D12]">
      <div className="max-w-md w-full p-8 text-center space-y-6">
        <Mail className="mx-auto h-16 w-16 text-primary" />
        <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Please Verify Your Email</h2>
        <p className="text-sm text-white/50">
          We've sent a verification link to your email address. 
          Please check your inbox and confirm your email to activate your account.
        </p>
        <div className="pt-4">
          <Link to="/login">
            <Button variant="outline" className="w-full h-12 text-[10px] uppercase font-bold tracking-widest border-white/5 bg-white/5 hover:bg-white/10 text-white transition-all rounded-full group">
              Return to Login <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}