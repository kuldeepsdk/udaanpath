"use client";

import { useEffect, useState } from "react";
import { Button } from "@/ui/components/tags/button";
import { getRotatingAds } from "@/app/actions/ads.actions";
import type { Ad } from "@/types/ads";


const RotatingAds = () => {
  const [ads, setAds] = useState<Ad[]>([]);
  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(true);

   // Fetch ads via BFF
  useEffect(() => {
    async function loadAds() {
      try {
        const data = await getRotatingAds();
        setAds(data);
      } catch (err) {
        console.error("Failed to load ads", err);
      }
    }
    loadAds();
  }, []);

  // Auto-slide every 10 seconds
  useEffect(() => {
    if (ads.length === 0) return;

    const interval = setInterval(() => {
      setFade(false);

      setTimeout(() => {
        setIndex((prev) => (prev + 1) % ads.length);
        setFade(true);
      }, 500);
    }, 10000); // default 10 seconds

    return () => clearInterval(interval);
  }, [ads, index]);

  if (ads.length === 0) return null;

  const ad = ads[index];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div
        className={`max-w-6xl mx-auto grid lg:grid-cols-2 gap-10 items-center transition-all duration-500 ${
          fade ? "opacity-100" : "opacity-0"
        }`}
      >
        {/* LEFT SIDE — Base64 Image */}
        <div className="relative">
          <img
            src={`data:image/jpeg;base64,${ad.image_base64}`}
            alt="Advertisement"
            className="rounded-3xl shadow-xl w-full h-auto object-cover"
          />

          <span className="absolute top-4 left-4 bg-yellow-500 text-white px-3 py-1 text-xs font-semibold rounded-full shadow">
            Sponsored
          </span>
        </div>

        {/* RIGHT SIDE — HTML Content */}
        <div className="space-y-6">
          <h3 className="text-4xl font-bold text-slate-900">{ad.title}</h3>

          <div
            className="text-lg text-slate-600 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: ad.description }}
          />

          {/* Optional button — we hide it for now */}
          <Button
            disabled
            className="bg-blue-600 text-white opacity-40 cursor-not-allowed px-8 py-6 rounded-xl text-lg hidden"
          >
            No Action Available
          </Button>
        </div>
      </div>
    </section>
  );
};

export default RotatingAds;
