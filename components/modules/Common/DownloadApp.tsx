"use client";

import { toast } from "sonner";
import { Smartphone, ChevronRight, Apple, Play } from "lucide-react";

import { Button } from "@/components/ui/button";

export function AppDownloadCta() {
  const handleDownloadClick = (platform: string) => {
    toast.info(`FoodHub for ${platform} is coming soon!`, {
      description: "We're putting the finishing touches on our mobile experience.",
    });
  };

  return (
    <section className="bg-secondary/30 px-4 py-12 md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-linear-to-br from-primary via-primary to-primary/90 text-primary-foreground shadow-2xl">
          {/* Decorative elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -right-40 -top-40 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute left-1/2 top-1/2 h-[30rem] w-[30rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/5 blur-[100px]" />
          </div>

          <div className="relative grid items-center gap-12 p-8 md:p-12 lg:grid-cols-2 lg:p-20">
            {/* Content */}
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-white/90 backdrop-blur-md">
                <Smartphone className="size-4" />
                <span>Mobile Experience</span>
              </div>

              <div className="space-y-4">
                <h2 className="text-4xl font-extrabold leading-[1.1] tracking-tight md:text-5xl lg:text-6xl">
                  Deliciousness <br />
                  <span className="text-white/80">is just a tap away.</span>
                </h2>
                <p className="max-w-lg text-lg leading-relaxed text-white/80 md:text-xl">
                  Get the full FoodHub experience on your phone. Enjoy exclusive app-only deals, 
                  faster checkout, and live order tracking.
                </p>
              </div>

              <div className="flex flex-col gap-4 sm:flex-row">
                <Button
                  size="lg"
                  className="group h-16 rounded-2xl bg-white px-8 text-base font-bold text-primary hover:bg-white/90 shadow-lg transition-all active:scale-95"
                  onClick={() => handleDownloadClick("iOS")}
                >
                  <Apple className="mr-2 size-6 fill-current" />
                  App Store
                  <ChevronRight className="ml-1 size-4 transition-transform group-hover:translate-x-1" />
                </Button>

                <Button
                  size="lg"
                  variant="outline"
                  className="group h-16 rounded-2xl border-2 border-white/30 bg-white/5 px-8 text-base font-bold text-white backdrop-blur-sm hover:bg-white/10 hover:text-white shadow-lg transition-all active:scale-95"
                  onClick={() => handleDownloadClick("Android")}
                >
                  <Play className="mr-2 size-5 fill-current" />
                  Google Play
                  <ChevronRight className="ml-1 size-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </div>

              <div className="flex flex-wrap items-center gap-8 pt-10 border-t border-white/20">
                <div className="space-y-1">
                  <div className="text-3xl font-black tracking-tighter">5M+</div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-white/60">Active Users</div>
                </div>
                <div className="hidden h-10 w-px bg-white/20 sm:block" />
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-3xl font-black tracking-tighter">
                    4.9
                    <svg
                      className="size-5 fill-amber-400 text-amber-400"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  </div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-white/60">App Rating</div>
                </div>
                <div className="hidden h-10 w-px bg-white/20 sm:block" />
                <div className="space-y-1">
                  <div className="text-3xl font-black tracking-tighter">24/7</div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-white/60">Live Support</div>
                </div>
              </div>
            </div>

            {/* Phone mockup */}
            <div className="relative flex items-center justify-center lg:justify-end">
              <div className="relative group/phone">
                {/* Glow effect */}
                <div className="absolute inset-0 -z-10 bg-white/20 blur-[60px] rounded-full scale-75 group-hover/phone:scale-100 transition-transform duration-700" />
                
                {/* Phone frame */}
                <div className="relative w-64 h-130 rounded-[3rem] bg-zinc-900 p-2 shadow-[0_0_0_2px_rgba(255,255,255,0.1),0_40px_100px_-20px_rgba(0,0,0,0.5)] md:w-72 md:h-145">
                  <div className="absolute top-6 left-1/2 h-6 w-24 -translate-x-1/2 rounded-full bg-black/40 backdrop-blur-md" />
                  <div className="h-full w-full overflow-hidden rounded-[2.5rem] bg-white ring-1 ring-white/10">
                    <img
                      src="https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800"
                      alt="App screenshot"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover/phone:scale-110"
                    />
                  </div>
                </div>

                {/* Floating dynamic islands */}
                <div className="absolute -right-6 top-12 animate-bounce-subtle">
                  <div className="rounded-2xl bg-white p-4 shadow-2xl ring-1 ring-black/5">
                    <div className="flex items-center gap-3">
                      <div className="flex size-10 items-center justify-center rounded-full bg-green-500 text-white shadow-lg shadow-green-500/20">
                        <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-xs font-black text-black uppercase tracking-tight">Order Confirmed</p>
                        <p className="text-[10px] font-bold text-green-600">Arriving in 15-20 min</p>
                      </div>
                    </div>
                  </div>
                </div>

                
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
