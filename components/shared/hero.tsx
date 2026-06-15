"use client";

import { useState, useEffect } from "react";
import {
  Search,
  MapPin,
  ChevronRight,
  Star,
  Clock,
  Truck,
  UtensilsCrossed,
  Plus,
  Flame,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const NAV_LINKS = ["Menu", "Restaurants", "Deals", "Track Order"];

const CATEGORIES = [
  { label: "Burgers", emoji: "🍔" },
  { label: "Pizza", emoji: "🍕" },
  { label: "Sushi", emoji: "🍣" },
  { label: "Pasta", emoji: "🍝" },
  { label: "Tacos", emoji: "🌮" },
  { label: "Salads", emoji: "🥗" },
];

const STATS = [
  { icon: UtensilsCrossed, value: "500+", label: "Restaurants" },
  { icon: Star, value: "4.9", label: "Avg. Rating" },
  { icon: Clock, value: "28 min", label: "Avg. Delivery" },
  { icon: ShieldCheck, value: "100%", label: "Guaranteed Fresh" },
];

const FEATURED_ITEMS = [
  {
    name: "Smash Burger Deluxe",
    restaurant: "The Burger Lab",
    price: "$14.99",
    rating: "4.9",
    calories: "680 kcal",
    image: "https://images.pexels.com/photos/1639562/pexels-photo-1639562.jpeg?auto=compress&cs=tinysrgb&w=400",
    tag: "Bestseller",
  },
  {
    name: "Margherita Perfetta",
    restaurant: "Napoli Express",
    price: "$16.50",
    rating: "4.8",
    calories: "540 kcal",
    image: "https://images.pexels.com/photos/2147491/pexels-photo-2147491.jpeg?auto=compress&cs=tinysrgb&w=400",
    tag: "Chef's Pick",
  },
];

export default function HeroSection() {
  const [address, setAddress] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [activeCategory, setActiveCategory] = useState("Burgers");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section className="relative w-full min-h-screen overflow-hidden bg-neutral-950">
      {/* ── Video Background ───────────────────────────── */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-60"
        poster="https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=1920"
      >
        <source
          src="https://videos.pexels.com/video-files/3209828/3209828-hd_1920_1080_25fps.mp4"
          type="video/mp4"
        />
        <source
          src="https://videos.pexels.com/video-files/1893024/1893024-hd_1920_1080_30fps.mp4"
          type="video/mp4"
        />
      </video>

      {/* ── Gradient Overlays ───────────────────────────── */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/75 via-black/55 to-black/40" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/30" />
      {/* warm color wash on the left */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          background:
            "radial-gradient(ellipse 60% 80% at 0% 60%, hsl(28 78% 43% / 0.6), transparent)",
        }}
      />
      {/* subtle grain texture */}
      <div
        className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")",
          backgroundRepeat: "repeat",
          backgroundSize: "200px 200px",
        }}
      />


      {/* ── Main Content ────────────────────────────────── */}
      <div className="relative z-10 min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto px-6 w-full pt-24 pb-16">
          <div className="grid lg:grid-cols-2 gap-12 xl:gap-20 items-center">

            {/* ── Left Column ────────────────────────────── */}
            <div className="flex flex-col">

              {/* Promo Badge */}
              <div className="opacity-0-init animate-fade-in-up delay-100 inline-flex items-center self-start gap-2 bg-white/8 backdrop-blur-sm border border-white/15 rounded-full px-4 py-2 mb-7 cursor-pointer hover:bg-white/12 transition-colors group">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
                </span>
                <span className="text-white/85 text-xs font-medium tracking-wide">
                  Free delivery on your first 3 orders
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-white/40 group-hover:text-white/70 transition-colors" />
              </div>

              {/* Headline */}
              <div className="opacity-0-init animate-fade-in-up delay-200 mb-6">
                <h1
                  className="leading-[0.9] tracking-tight"
                  style={{ fontFamily: "var(--font-display), sans-serif" }}
                >
                  <span className="block text-white font-black"
                    style={{ fontSize: "clamp(3.5rem, 8vw, 6.5rem)" }}>
                    Hungry?
                  </span>
                  <span
                    className="block font-black"
                    style={{
                      fontSize: "clamp(3rem, 7vw, 5.5rem)",
                      color: "hsl(28 78% 58%)",
                    }}
                  >
                    We Deliver.
                  </span>
                </h1>
              </div>

              {/* Sub-headline */}
              <p className="opacity-0-init animate-fade-in-up delay-300 text-white/55 text-base md:text-lg leading-relaxed max-w-md mb-9 font-light">
                Fresh, hot meals from 500+ top restaurants — straight to your door
                in under{" "}
                <span className="text-white/80 font-medium">30 minutes</span>.
              </p>

            
            

              {/* Stats Row */}
              <div className="opacity-0-init animate-fade-in-up delay-600 flex flex-wrap gap-5 sm:gap-8">
                {STATS.map(({ icon: Icon, value, label }) => (
                  <div key={label} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/15 border border-primary/25 flex items-center justify-center shrink-0">
                      <Icon className="w-4.5 h-4.5 text-primary" />
                    </div>
                    <div>
                      <p
                        className="text-white font-bold text-lg leading-tight"
                        style={{ fontFamily: "var(--font-display), sans-serif" }}
                      >
                        {value}
                      </p>
                      <p className="text-white/40 text-xs">{label}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Floating rating badge */}
              <div className="opacity-0-init animate-slide-in-right delay-1000 mt-10">
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl px-4 py-3 shadow-xl animate-float-subtle" style={{ animationDelay: "1s" }}>
                  <div className="flex -space-x-2">
                    {[
                      "https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=60",
                      "https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=60",
                      "https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=60",
                    ].map((src, i) => (
                      <div
                        key={i}
                        className="w-7 h-7 rounded-full border-2 border-white/20 overflow-hidden"
                      >
                        <Image src={src} alt="user" width={28} height={28} className="object-cover" />
                      </div>
                    ))}
                  </div>
                  <div>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <p className="text-white/60 text-xs mt-0.5">50k+ happy customers</p>
                  </div>
                </div>
              </div>


            </div>

            {/* ── Right Column — Floating Cards ──────────── */}
            <div className="hidden lg:flex flex-col items-end justify-center gap-4 relative">


              

              
            </div>

          </div>
        </div>
      </div>

      {/* ── Scroll Indicator ────────────────────────────── */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2">
        <span className="text-white/25 text-[10px] tracking-[0.3em] uppercase font-medium">
          Scroll
        </span>
        <div className="w-px h-10 bg-gradient-to-b from-white/30 to-transparent animate-bounce" />
      </div>
    </section>
  );
}

/* ── Food Card Sub-Component ─────────────────────────── */
interface FoodItem {
  name: string;
  restaurant: string;
  price: string;
  rating: string;
  calories: string;
  image: string;
  tag: string;
}

function FoodCard({ item, compact = false }: { item: FoodItem; compact?: boolean }) {
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <div className="group relative bg-white/8 backdrop-blur-xl border border-white/15 rounded-3xl overflow-hidden shadow-2xl hover:border-white/25 transition-all duration-300 hover:shadow-primary/10">
      {/* Tag */}
      <div className="absolute top-3 left-3 z-10">
        <span className="flex items-center gap-1 bg-primary text-primary-foreground text-xs font-bold px-2.5 py-1 rounded-full shadow-lg">
          <Flame className="w-3 h-3" />
          {item.tag}
        </span>
      </div>

      {/* Image */}
      <div className={`relative overflow-hidden ${compact ? "h-36" : "h-52"}`}>
        <Image
          src={item.image}
          alt={item.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-700"
          sizes="(max-width: 768px) 100vw, 400px"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-3 mb-1">
          <div className="flex-1 min-w-0">
            <h3
              className="text-white font-bold text-base leading-tight truncate"
              style={{ fontFamily: "var(--font-display), sans-serif" }}
            >
              {item.name}
            </h3>
            <p className="text-white/45 text-xs mt-0.5 truncate">{item.restaurant}</p>
          </div>
          <p
            className="text-primary font-black text-lg shrink-0"
            style={{ fontFamily: "var(--font-display), sans-serif" }}
          >
            {item.price}
          </p>
        </div>

        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="text-white/70 text-xs font-medium">{item.rating}</span>
            </div>
            <span className="text-white/25 text-xs">·</span>
            <span className="text-white/40 text-xs">{item.calories}</span>
          </div>
          <button
            onClick={handleAdd}
            className={`flex items-center gap-1.5 text-xs font-semibold rounded-xl px-3 py-2 transition-all duration-200 ${
              added
                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                : "bg-primary/20 text-primary hover:bg-primary hover:text-primary-foreground border border-primary/30"
            }`}
          >
            <Plus className={`w-3.5 h-3.5 transition-transform ${added ? "rotate-45" : ""}`} />
            {added ? "Added!" : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
}
