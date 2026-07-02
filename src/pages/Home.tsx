import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Bike, Leaf, MapPin, Package, ShieldCheck, Sparkles, Star, Truck } from "lucide-react";
import { categories, products, ngn } from "@/data/products";
import ProductCard from "@/components/customer/ProductCard";

const heroImg = "https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=900&q=80&auto=format&fit=crop";

export default function Home() {
  const bestSellers = products.slice(0, 4);
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="brand-gradient absolute inset-0 -z-10" />
        <div className="mx-auto grid max-w-7xl gap-5 px-4 py-6 sm:py-8 md:grid-cols-2 md:items-center md:gap-8 md:px-6 md:py-10 lg:py-12">
          <div className="space-y-4 text-white sm:space-y-5">
            <Badge className="border-white/20 bg-white/15 text-white backdrop-blur"><Sparkles className="mr-1 h-3 w-3" /> 100% Natural Ingredients</Badge>
            <h1 className="max-w-xl text-3.5xl font-extrabold leading-tight sm:text-4xl lg:text-5xl">
              Fresh wellness,<br /> delivered with ease.
            </h1>
            <p className="max-w-lg text-sm text-white/85 sm:text-base">Cold-pressed juices, nutrient-packed smoothies, and healthy meal plans delivered fresh to your door — every single day.</p>
            <div className="flex flex-wrap gap-3">
              <Link to="/shop" search={{}}><Button size="lg" className="gap-2 rounded-full bg-accent-orange text-white hover:bg-accent-orange/90">Order Now <ArrowRight className="h-4 w-4" /></Button></Link>
              <Button size="lg" variant="outline" className="rounded-full border-white/30 bg-white/10 text-white hover:bg-white/20">See How It Works</Button>
            </div>
            <div className="flex flex-wrap items-center gap-4 pt-1 sm:gap-6">
              {[{n:"12k+", l:"Happy Customers"},{n:"48+", l:"Fresh Recipes"},{n:"4.9", l:"Avg Rating"}].map(s => (
                <div key={s.l}><div className="text-lg font-bold sm:text-xl">{s.n}</div><div className="text-[10px] uppercase tracking-[0.2em] text-white/70 sm:text-[11px]">{s.l}</div></div>
              ))}
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-md">
            <div className="absolute -inset-4 rounded-full bg-amber-300/20 blur-3xl" />
            <img src={heroImg} alt="Fresh ingredients" className="relative aspect-[4/5] w-full rounded-[24px] object-cover shadow-2xl sm:aspect-square" />
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:py-10 lg:px-6">
        <h2 className="text-2xl font-bold">Browse Our Menu</h2>
        <p className="mb-6 text-sm text-muted-foreground sm:mb-8">Everything made fresh daily with locally sourced ingredients.</p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5 lg:gap-4">
          {categories.slice(1).map(c => (
            <Link key={c.value} to="/shop" search={{ cat: c.value }} className="group rounded-2xl border bg-card p-4 text-center transition hover:border-brand hover:shadow-lg card-elevated sm:p-5">
              <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-full bg-brand-soft transition group-hover:bg-brand group-hover:text-brand-foreground sm:h-14 sm:w-14">
                <Leaf className="h-5 w-5 text-brand transition group-hover:text-brand-foreground sm:h-6 sm:w-6" />
              </div>
              <div className="text-sm font-semibold">{c.name}</div>
              <div className="text-xs text-muted-foreground">{c.count} items</div>
            </Link>
          ))}
        </div>
      </section>

      {/* Best sellers */}
      <section className="mx-auto max-w-7xl px-4 py-6 sm:py-8 lg:px-6">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold">Best-Selling Items</h2>
            <p className="text-sm text-muted-foreground">Our most loved drinks and bites this week.</p>
          </div>
          <Link to="/shop" search={{}} className="flex items-center gap-1 text-sm font-semibold text-brand">View Full Menu <ArrowRight className="h-3 w-3" /></Link>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">{bestSellers.map(p => <ProductCard key={p.id} product={p} />)}</div>
      </section>

      {/* Meal plans */}
      <section className="mx-auto max-w-7xl px-4 lg:px-6 py-10">
        <h2 className="text-2xl font-bold text-center">Commit to a Healthier You</h2>
        <p className="text-muted-foreground text-center mb-10">Choose a plan that fits your lifestyle. Subscribe, save, sip.</p>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { name: "7-Day Detox", price: 15000, popular: false, perks: ["Daily green juice & smoothie", "2 cleanse meals", "Free morning delivery", "Nutrition guide included"] },
            { name: "14-Day Healthy Plan", price: 26000, popular: true, perks: ["Everything in 7-day", "2x balanced meal options", "Personal coach check-ins", "Priority customer support"] },
            { name: "30-Day Plan", price: 48000, popular: false, perks: ["Everything in 14-day", "30 fully personal meals", "Nutritionist health check", "20% off all add-ons"] },
          ].map(plan => (
            <div key={plan.name} className={`relative rounded-2xl border p-6 ${plan.popular ? "bg-brand text-brand-foreground border-brand shadow-xl scale-[1.02]" : "bg-card card-elevated"}`}>
              {plan.popular && <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent-orange text-white border-0">Most Popular</Badge>}
              <h3 className="text-xl font-bold">{plan.name}</h3>
              <div className="mt-2 text-3xl font-extrabold">{ngn(plan.price)}<span className="text-sm font-medium opacity-70">/week</span></div>
              <ul className="mt-6 space-y-2 text-sm">{plan.perks.map(p => <li key={p} className="flex gap-2"><Star className="h-4 w-4 shrink-0 mt-0.5" /> {p}</li>)}</ul>
              <Button className={`mt-6 w-full rounded-full ${plan.popular ? "bg-white text-brand hover:bg-white/90" : ""}`} variant={plan.popular ? "default" : "outline"}>Start {plan.name}</Button>
            </div>
          ))}
        </div>
      </section>

      {/* Delivery promise */}
      <section className="mx-auto max-w-7xl px-4 lg:px-6 py-10">
        <div className="rounded-3xl bg-secondary p-6 md:p-10 grid md:grid-cols-2 gap-6 items-center">
          <img src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&q=80&auto=format&fit=crop" alt="Delivery" className="rounded-2xl aspect-[4/3] object-cover" />
          <div>
            <h2 className="text-3xl font-bold">Fresh to Your Door in 45 Mins</h2>
            <p className="mt-2 text-muted-foreground">We deliver across Lagos — same-day delivery on all orders placed before 4pm. Or pick up free, on us, at our locations.</p>
            <div className="mt-6 space-y-3">
              {[
                { i: Truck, t: "Real-time Order Tracking", d: "Track your order from blender to bag, with live updates." },
                { i: Bike, t: "Delivery Fee Calculator", d: "Enter your address and see exact delivery fee. Transparent and fair." },
                { i: MapPin, t: "Pick Up Available", d: "Skip delivery — grab your order direct from any of our 4 locations." },
              ].map(it => (
                <div key={it.t} className="flex gap-3"><div className="grid h-10 w-10 place-items-center rounded-full bg-brand-soft shrink-0"><it.i className="h-5 w-5 text-brand" /></div><div><div className="font-semibold">{it.t}</div><div className="text-sm text-muted-foreground">{it.d}</div></div></div>
              ))}
            </div>
            <Button className="mt-6 rounded-full">Check Delivery to My Area</Button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="mx-auto max-w-7xl px-4 lg:px-6 py-10">
        <h2 className="text-2xl font-bold text-center">Thousands Love MaysChills</h2>
        <p className="text-muted-foreground text-center mb-10">Don't just take our word for it — hear from our happy customers.</p>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { name: "Amara Okafor", role: "Lagos", text: "The 14-day plan completely transformed my mornings. I wake up feeling alive instead of needing coffee. The delivery is always on time!" },
            { name: "Chukwudi Eze", role: "Ikeja", text: "Finally a healthy food service I can actually afford. The Green Detox Juice is my go-to every morning. Best in the country and I've tried many!" },
            { name: "Toni Adeyemi", role: "Victoria Island", text: "Best day to day is N20 smoothie and my wraps and salads. The five-step ordering is amazing — I honestly don't know how to open my eyes!" },
          ].map(r => (
            <div key={r.name} className="rounded-2xl bg-card border p-6 card-elevated">
              <div className="flex gap-0.5 text-amber-400 mb-3">{Array.from({length:5}).map((_,i)=><Star key={i} className="h-4 w-4 fill-current" />)}</div>
              <p className="text-sm">{`"${r.text}"`}</p>
              <div className="mt-4 flex items-center gap-3">
                <div className="grid h-9 w-9 place-items-center rounded-full bg-brand text-brand-foreground text-xs font-bold">{r.name[0]}</div>
                <div><div className="font-semibold text-sm">{r.name}</div><div className="text-xs text-muted-foreground">{r.role}</div></div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 lg:px-6 pb-12">
        <div className="brand-gradient rounded-3xl p-8 md:p-12 text-white flex flex-col md:flex-row items-center gap-6 justify-between">
          <div>
            <h2 className="text-3xl md:text-4xl font-extrabold">Your First Order is 10% Off — Start Today</h2>
            <p className="mt-2 text-white/85">Join 12,000+ customers living healthier lives with MaysChills.</p>
          </div>
          <div className="flex gap-3">
            <Link to="/shop" search={{}}><Button size="lg" className="bg-accent-orange hover:bg-accent-orange/90 rounded-full">Order Now</Button></Link>
            <Button size="lg" variant="outline" className="bg-transparent border-white/30 text-white hover:bg-white/10 rounded-full"><ShieldCheck className="h-4 w-4 mr-1" /> View Subscriptions</Button>
          </div>
        </div>
      </section>
    </div>
  );
}
