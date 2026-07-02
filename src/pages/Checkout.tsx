'use client';

import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useCart } from "@/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Check, Tag, ShieldCheck, ArrowRight, CreditCard, Building, Wallet, Clock, MapPin, Package } from "lucide-react";
import { ngn } from "@/data/products";
import { toast } from "sonner";
import useAdmin from "@/store/admin";

const steps = ["Cart Review", "Customer Info", "Delivery", "Payment", "Confirmation"];

export default function Checkout() {
  const [step, setStep] = useState(1);
  const [delivery, setDelivery] = useState<"home"|"pickup"|"express">("home");
  const [payment, setPayment] = useState<"card"|"transfer"|"wallet">("card");
  const items = useCart((s) => s.items);
  const clear = useCart((s) => s.clear);
  const nav = useNavigate();
  const subtotal = items.reduce((a, i) => a + i.unitPrice * i.qty, 0);
  const coupon = 1135;
  const deliveryFee = delivery === "pickup" ? 0 : delivery === "express" ? 1500 : 800;
  const vat = Math.round(subtotal * 0.075);
  const total = subtotal - coupon + deliveryFee + vat;

  const addOrder = useAdmin((s) => s.addOrder);
  const placeOrder = () => {
    const id = "#SFR-" + Math.floor(20000 + Math.random()*999);
    const order = {
      id,
      customer: "Guest",
      email: "guest@local",
      items: items.map(i => `${i.product.name} × ${i.qty}`),
      itemCount: items.reduce((a,i)=>a+i.qty,0),
      amount: total,
      status: "Pending",
      payment: payment === "card" ? "Card" : payment,
      deliveryType: delivery === "home" ? "Home Delivery" : delivery,
      rider: null,
      time: new Date().toLocaleTimeString(),
      date: new Date().toLocaleDateString(),
    } as any;
    addOrder(order);
    clear();
    toast.success("Order placed!");
    nav({ to: `/order-track`, search: { id } });
  };

  return (
    <div className="mx-auto max-w-6xl px-4 lg:px-6 py-8">
      {/* Stepper */}
      <div className="flex items-center mb-8 overflow-x-auto">
        {steps.map((s, i) => {
          const n = i + 1;
          const active = step === n;
          const done = step > n;
          return (
            <div key={s} className="flex items-center shrink-0">
              <div className={`flex items-center gap-2 ${done ? "text-brand" : active ? "text-accent-orange" : "text-muted-foreground"}`}>
                <div className={`grid h-7 w-7 place-items-center rounded-full text-xs font-bold border-2 ${done ? "bg-brand text-brand-foreground border-brand" : active ? "bg-accent-orange text-white border-accent-orange" : "border-border"}`}>
                  {done ? <Check className="h-3.5 w-3.5" /> : n}
                </div>
                <span className="font-medium text-sm">{s}</span>
              </div>
              {i < steps.length - 1 && <div className="h-px w-10 md:w-20 bg-border mx-2" />}
            </div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-[1fr_360px] gap-8">
        <div className="space-y-6">
          {step >= 2 && (
            <Section icon={Tag} title="Coupon & Promo Code">
              <div className="flex gap-2"><Input defaultValue="DETOX20" className="font-mono" /><Button variant="outline" className="gap-1"><Check className="h-4 w-4 text-brand" /> Applied</Button></div>
              <div className="rounded-lg bg-brand-soft p-3 text-sm text-brand"><Check className="h-4 w-4 inline mr-1" /> Coupon <span className="font-bold">DETOX20</span> applied! You're saving ₦1,135 on this order.</div>
            </Section>
          )}
          {step >= 2 && (
            <Section title="Customer Information">
              <div className="grid md:grid-cols-2 gap-4">
                <Field label="First Name" defaultValue="Amara" />
                <Field label="Last Name" defaultValue="Okafor" />
                <Field label="Email Address" defaultValue="amara.okafor@gmail.com" />
                <Field label="Phone Number" defaultValue="+234 801 234 5678" />
              </div>
              <div><Label className="mb-1.5 block text-sm">Order Notes (optional)</Label><Textarea placeholder="Please make the green smoothie extra cold. No ice for the mango bliss please." rows={3} /></div>
            </Section>
          )}
          {step >= 3 && (
            <Section icon={MapPin} title="Delivery Details">
              <div className="grid grid-cols-3 gap-2">
                {[
                  { v:"home", t:"Home Delivery", d:"Delivered to your address", p:"₦800 delivery fee" },
                  { v:"pickup", t:"Pickup", d:"Pick up at our store", p:"Free" },
                  { v:"express", t:"Express", d:"30-min priority delivery", p:"₦1,500 delivery fee" },
                ].map(o => (
                  <button key={o.v} onClick={() => setDelivery(o.v as "home"|"pickup"|"express")} className={`rounded-xl border p-3 text-left text-sm ${delivery===o.v?"border-brand bg-brand-soft":""}`}>
                    <div className="flex items-center gap-2 font-semibold"><div className={`h-3 w-3 rounded-full border-2 ${delivery===o.v?"border-brand bg-brand":"border-muted-foreground"}`} />{o.t}</div>
                    <div className="text-xs text-muted-foreground mt-1">{o.d}</div>
                    <div className="text-xs font-semibold mt-1 text-brand">{o.p}</div>
                  </button>
                ))}
              </div>
              <Field label="Street Address" defaultValue="14 Banana Island Road, Apartment 3B" />
              <div className="grid md:grid-cols-2 gap-4"><Field label="City" defaultValue="Lagos" /><Field label="State" defaultValue="Lagos State" /></div>
              <Field label="Delivery Instructions (optional)" placeholder="e.g. Gate code, landmark..." />
              <div className="grid md:grid-cols-2 gap-4"><Field label="Preferred Delivery Date" defaultValue="Today, Jan 20" /><Field label="Preferred Time Slot" defaultValue="12:00 PM – 2:00 PM" /></div>
            </Section>
          )}
          {step >= 4 && (
            <Section icon={CreditCard} title="Payment Method">
              <div className="flex justify-end -mt-8"><Badge variant="outline" className="text-xs"><ShieldCheck className="h-3 w-3 mr-1" /> SSL Secured</Badge></div>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { v:"card", t:"Card", d:"Visa, Mastercard", i:CreditCard },
                  { v:"transfer", t:"Bank Transfer", d:"Direct transfer", i:Building },
                  { v:"wallet", t:"Wallet", d:"MaysChills balance", i:Wallet },
                ].map(o => (
                  <button key={o.v} onClick={() => setPayment(o.v as "card"|"transfer"|"wallet")} className={`rounded-xl border p-3 text-left ${payment===o.v?"border-brand bg-brand-soft":""}`}>
                    <o.i className="h-5 w-5 mb-1" />
                    <div className="font-semibold text-sm">{o.t}</div>
                    <div className="text-xs text-muted-foreground">{o.d}</div>
                  </button>
                ))}
              </div>
              {payment === "card" && (
                <div className="space-y-4">
                  {/* ATM card visual */}
                  <div className="relative aspect-[1.586/1] max-w-md rounded-2xl p-6 text-white overflow-hidden brand-gradient">
                    <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10" />
                    <div className="absolute -right-20 bottom-0 h-32 w-32 rounded-full bg-amber-300/30" />
                    <div className="flex justify-between items-start">
                      <div className="text-xs font-semibold tracking-widest opacity-80">MAYSCHILLS BANK</div>
                      <div className="text-sm font-bold italic">VISA</div>
                    </div>
                    <div className="mt-6 grid h-9 w-12 rounded-md bg-gradient-to-br from-amber-200 to-amber-500" />
                    <div className="mt-4 text-xl font-mono tracking-widest">4242 4242 4242 4242</div>
                    <div className="mt-4 flex justify-between text-xs">
                      <div><div className="opacity-70">CARDHOLDER</div><div className="font-semibold tracking-wider">AMARA OKAFOR</div></div>
                      <div><div className="opacity-70">EXPIRES</div><div className="font-semibold">08 / 27</div></div>
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4"><Field label="Cardholder Name" defaultValue="Amara Okafor" /><Field label="Card Number" defaultValue="4242 4242 4242 4242" /></div>
                  <div className="grid grid-cols-2 gap-4"><Field label="Expiry Date" defaultValue="08 / 27" /><Field label="CVV" defaultValue="•••" /></div>
                  <div className="text-xs text-brand bg-brand-soft p-3 rounded-lg flex items-center gap-1"><ShieldCheck className="h-3.5 w-3.5" /> Your card details are encrypted and secure. We never store CVV numbers.</div>
                </div>
              )}
            </Section>
          )}

          <div className="flex gap-3 justify-between">
            <Button variant="outline" onClick={() => setStep(Math.max(1, step-1))} disabled={step===1}>Back</Button>
            {step < 4 ? (
              <Button onClick={() => setStep(step+1)} className="gap-2 rounded-full">Continue <ArrowRight className="h-4 w-4" /></Button>
            ) : (
              <Button onClick={placeOrder} size="lg" className="gap-2 rounded-full"><ShieldCheck className="h-4 w-4" /> Place Order Securely</Button>
            )}
          </div>
        </div>

        <aside className="lg:sticky lg:top-20 h-fit space-y-4">
          <div className="rounded-2xl border bg-card p-5 space-y-3">
            <h3 className="font-bold flex items-center gap-2"><Package className="h-4 w-4" /> Order Summary</h3>
            <div className="space-y-3">
              {items.slice(0, 3).map(i => (
                <div key={i.id} className="flex gap-3 text-sm">
                  <img src={i.product.image} className="h-12 w-12 rounded-lg object-cover shrink-0" alt="" />
                  <div className="flex-1 min-w-0"><div className="font-medium truncate">{i.product.name} ×{i.qty}</div><div className="text-xs text-muted-foreground truncate">{i.size}</div></div>
                  <div className="font-semibold">{ngn(i.unitPrice * i.qty)}</div>
                </div>
              ))}
            </div>
            <div className="border-t pt-3 space-y-1.5 text-sm">
              <Row k={`Subtotal (${items.length} items)`} v={ngn(subtotal)} />
              <Row k="Coupon (DETOX20)" v={`-${ngn(coupon)}`} dim />
              <Row k="Delivery Fee" v={deliveryFee === 0 ? "Free" : ngn(deliveryFee)} />
              <Row k="VAT (7.5%)" v={ngn(vat)} />
              <div className="rounded-lg bg-brand-soft p-2 text-xs text-brand flex justify-between"><span>Free delivery promo</span><span className="font-semibold">⊘ Applied</span></div>
            </div>
            <div className="border-t pt-3 flex justify-between"><span className="font-bold">Total</span><span className="font-extrabold text-2xl text-brand">{ngn(total)}</span></div>
            <Button onClick={() => step < 4 ? setStep(4) : placeOrder()} className="w-full rounded-full gap-2"><ShieldCheck className="h-4 w-4" /> Place Order Securely</Button>
            <Link to="/cart"><Button variant="outline" className="w-full rounded-full">Continue Shopping</Button></Link>
            <p className="text-xs text-center text-muted-foreground">Secure checkout · SSL encrypted</p>
          </div>
          <div className="rounded-2xl border bg-card p-5">
            <h4 className="font-semibold text-sm mb-3">Delivery Estimate</h4>
            <div className="space-y-2 text-sm">
              <div className="flex gap-2"><Clock className="h-4 w-4 text-muted-foreground mt-0.5" /><div><div className="text-xs text-muted-foreground">Estimated delivery time</div><div className="font-medium">Today, 12:00 PM – 2:00 PM</div></div></div>
              <div className="flex gap-2"><MapPin className="h-4 w-4 text-muted-foreground mt-0.5" /><div><div className="text-xs text-muted-foreground">Delivering to</div><div className="font-medium">Banana Island, Lagos</div></div></div>
              <div className="flex gap-2"><Package className="h-4 w-4 text-muted-foreground mt-0.5" /><div><div className="text-xs text-muted-foreground">Packaging</div><div className="font-medium">Eco-friendly insulated bag</div></div></div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Section({ icon: Icon, title, children }: { icon?: typeof Tag; title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border bg-card p-6 space-y-4">
      <h3 className="font-bold flex items-center gap-2">{Icon && <Icon className="h-4 w-4 text-brand" />} {title}</h3>
      {children}
    </div>
  );
}
function Field({ label, ...props }: { label: string } & React.ComponentProps<"input">) {
  return <div><Label className="mb-1.5 block text-sm">{label}</Label><Input {...props} /></div>;
}
function Row({ k, v, dim }: { k: string; v: string; dim?: boolean }) {
  return <div className={`flex justify-between ${dim?"text-brand":""}`}><span className="text-muted-foreground">{k}</span><span className="font-semibold">{v}</span></div>;
}
