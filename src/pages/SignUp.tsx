import { Link, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Leaf, Check } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/store";

export default function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const signUp = useAuth((s) => s.signUp);
  const nav = useNavigate();
  return (
    <div className="min-h-[calc(100vh-200px)] grid md:grid-cols-2">
      <div className="grid place-items-center px-6 py-12 order-2 md:order-1">
        <form onSubmit={(e) => { e.preventDefault(); signUp(name || "Friend", email || "friend@email.com"); nav({ to: "/profile" }); }} className="w-full max-w-md space-y-5">
          <div><h1 className="text-3xl font-bold">Create your account</h1><p className="text-muted-foreground mt-1">Start sipping fresh in less than a minute.</p></div>
          <div className="grid grid-cols-2 gap-4"><div><Label className="mb-1.5 block">First name</Label><Input className="h-11" value={name} onChange={e=>setName(e.target.value)} /></div><div><Label className="mb-1.5 block">Last name</Label><Input className="h-11" /></div></div>
          <div><Label className="mb-1.5 block">Email</Label><Input type="email" className="h-11" value={email} onChange={e=>setEmail(e.target.value)} /></div>
          <div><Label className="mb-1.5 block">Password</Label><Input type="password" className="h-11" placeholder="Min 8 characters" /></div>
          <p className="text-xs text-muted-foreground">By signing up, you agree to our Terms of Service and Privacy Policy.</p>
          <Button type="submit" className="w-full rounded-full h-11">Create account</Button>
          <Button type="button" variant="outline" className="w-full rounded-full h-11 gap-2"><span className="text-base">G</span> Sign up with Google</Button>
          <p className="text-sm text-center text-muted-foreground">Already have an account? <Link to="/signin" className="text-brand font-semibold">Sign in</Link></p>
        </form>
      </div>
      <div className="hidden md:block relative brand-gradient order-1 md:order-2">
        <div className="absolute inset-0 grid place-items-center p-12 text-white">
          <div className="max-w-md">
            <div className="flex items-center gap-2 mb-6"><div className="grid h-12 w-12 place-items-center rounded-2xl bg-white/15"><Leaf className="h-6 w-6" /></div><span className="text-3xl font-bold">MaysChills</span></div>
            <h2 className="text-4xl font-extrabold leading-tight">Join 12,000+ members<br/> sipping fresh daily.</h2>
            <ul className="mt-6 space-y-3">
              {["10% off your first order", "Track orders in real-time", "Save your favourites", "Subscribe & save 20%"].map(b => <li key={b} className="flex items-center gap-3"><div className="grid h-6 w-6 rounded-full bg-white/20 place-items-center"><Check className="h-3.5 w-3.5" /></div>{b}</li>)}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
