"use client";

import { SITE_CONFIG } from "@/config/site";
import { Button } from "@/ui/components/tags/button";

const Hero = () => {
  return (
    <section className="relative pt-20 pb-32 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">

        {/* Left Side */}
        <div className="space-y-8 animate-fade-in relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm font-medium text-slate-700">
              {SITE_CONFIG.hero?.badgeText ?? "India's Trusted Platform"}
            </span>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight text-slate-900">
            <span className="text-gradient">
              {SITE_CONFIG.name}
            </span>
            <br />
            {SITE_CONFIG.hero?.titleLine1 ?? "Your Journey to"}
            <br />
            {SITE_CONFIG.hero?.titleLine2 ?? "Growth & Freedom 🇮🇳"}
          </h1>

          <p className="text-lg text-slate-600 leading-relaxed max-w-xl">
            {SITE_CONFIG.hero?.description ??
              "India’s youth-first platform for Jobs, Sarkari Results, Blogs & Courses — fast, reliable and always up-to-date."}
          </p>

          {/* Buttons on click redirect to /jobs*/}

          <div className="flex flex-wrap gap-4">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-base rounded-xl shadow-glow" onClick={() => window.location.href = '/jobs'}>
              {SITE_CONFIG.hero?.primaryCTA ?? "Explore Updates"}
            </Button>
            {/*
            <Button
              variant="outline"
              className="border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white px-8 py-6 text-base rounded-xl"
            >
              {SITE_CONFIG.hero?.secondaryCTA ?? "Browse Courses"}
            </Button>
            */}
          </div>
        </div>

        {/* Right Side (Image) */}
        <div className="hidden lg:block animate-fade-in relative">
          <div className="absolute -inset-4 gradient-bg animate-gradient rounded-3xl blur-2xl opacity-20" />
          <img
            src={SITE_CONFIG.hero?.image ?? "images/hero-illustration.jpg"}
            alt="Hero"
            className="rounded-3xl shadow-soft w-full h-auto relative"
          />
        </div>

      </div>
    </section>
  );
};

export default Hero;
