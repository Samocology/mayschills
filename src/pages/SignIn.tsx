import { Link, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Leaf, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/store";

export default function SignIn() {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const signIn = useAuth((s) => s.signIn);
  const nav = useNavigate();
  return (
    <div className="min-h-[calc(100vh-200px)] grid lg:grid-cols-[1.05fr_0.95fr]">
      <div className="hidden lg:block relative brand-gradient">
        <div className="absolute inset-0 grid place-items-center p-10 text-white">
          <div className="max-w-md">
            <div className="mb-6 flex items-center gap-2"><div className="grid h-12 w-12 place-items-center rounded-2xl bg-white/15"><Leaf className="h-6 w-6" /></div><span className="text-3xl font-bold">MaysChills</span></div>
            <h2 className="text-4xl font-extrabold leading-tight">Sip your way back to feeling good.</h2>
            <p className="mt-4 text-white/85">Welcome back. Track your orders, manage your subscription, and unlock member-only flavors.</p>
          </div>
        </div>
      </div>
      <div className="grid place-items-center px-4 py-10 sm:px-6 lg:px-8">
        <form onSubmit={(e) => { e.preventDefault(); signIn(email || "amara@email.com"); nav({ to: "/profile" }); }} className="w-full max-w-md rounded-3xl border bg-card p-6 shadow-sm sm:p-8">
          <div><h1 className="text-3xl font-bold">Welcome back</h1><p className="mt-1 text-sm text-muted-foreground">Sign in to your MaysChills account.</p></div>
          <div className="mt-6 space-y-4">
            <div><Label className="mb-1.5 block">Email</Label><Input type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="h-11" /></div>
            <div>
              <div className="mb-1.5 flex justify-between"><Label>Password</Label><a className="text-xs font-medium text-brand">Forgot password?</a></div>
              <div className="relative"><Input type={show?"text":"password"} placeholder="••••••••" className="h-11 pr-10" /><button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-3 text-muted-foreground">{show?<EyeOff className="h-4 w-4" />:<Eye className="h-4 w-4" />}</button></div>
            </div>
            <Button type="submit" className="h-11 w-full rounded-full">Sign In</Button>
            <div className="relative my-4"><div className="absolute inset-0 grid place-items-center"><div className="w-full border-t" /></div><div className="relative grid place-items-center"><span className="bg-background px-3 text-xs text-muted-foreground">OR</span></div></div>
            <Button type="button" variant="outline" className="h-11 w-full gap-2 rounded-full"><span className="text-base">G</span> Continue with Google</Button>
          </div>
          <p className="mt-6 text-center text-sm text-muted-foreground">New to MaysChills? <Link to="/signup" className="font-semibold text-brand">Create account</Link></p>
        </form>
      </div>
    </div>
  );
}
