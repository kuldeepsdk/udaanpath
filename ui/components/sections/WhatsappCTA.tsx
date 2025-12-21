"use client";

import { Button } from "@/ui/components/tags/button";
import Image from "next/image";
import { MessageCircle } from "lucide-react";

const WHATSAPP_CHANNEL_URL =
  "https://whatsapp.com/channel/0029VbBG8135PO0sX5HVPZ1p";

const WhatsAppCTA = () => {
  return (
    <section className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Animated background glows */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/4 top-1/4 w-72 h-72 bg-green-500/25 blur-[140px] rounded-full animate-pulse" />
        <div className="absolute right-1/4 bottom-1/4 w-72 h-72 bg-emerald-400/25 blur-[140px] rounded-full animate-pulse delay-1000" />
      </div>

      <div className="max-w-5xl mx-auto">
        <div className="glass-card rounded-3xl px-6 py-12 sm:p-14 shadow-xl border-0 text-center relative">

          {/* Top animated strip */}
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-green-500 via-emerald-400 to-green-500 animate-gradient" />

          {/* Heading */}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900">
            Join our{" "}
            <span className="text-green-600">WhatsApp Channel</span>
          </h2>

          {/* Description */}
          <p className="mt-4 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto">
            Instant alerts for new government jobs, results, admit cards and
            daily <strong>Mandi Bhav</strong> — directly on WhatsApp.
          </p>

          {/* CTA Button */}
          <div className="mt-10 flex justify-center">
            <a
              href={WHATSAPP_CHANNEL_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                size="lg"
                className="group bg-green-600 hover:bg-green-700 text-white px-10 py-6 rounded-2xl text-lg shadow-glow flex items-center gap-3 transition-all duration-300 hover:-translate-y-1"
              >
                <MessageCircle className="h-6 w-6 transition-transform duration-300 group-hover:scale-110" />
                Join WhatsApp Channel
              </Button>
            </a>
          </div>

          {/* QR Section */}
          <div className="mt-10 flex flex-col items-center gap-3">
            <a
              href={WHATSAPP_CHANNEL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group"
            >
              <Image
                src="/images/udaanpath_whatsapp_qr_rounded_solid.png"
                width={160}
                height={160}
                alt="UdaanPath WhatsApp Channel QR"
                className="rounded-2xl shadow-lg transition-transform duration-300 group-hover:scale-105"
              />
            </a>

            <p className="text-xs text-slate-500">
              Scan QR or tap to join instantly
            </p>
          </div>

        </div>
      </div>
    </section>
  );
};

export default WhatsAppCTA;
