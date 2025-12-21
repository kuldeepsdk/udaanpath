"use client";

import Image from "next/image";
import { Button } from "@/ui/components/tags/button";

interface AdProps {
  title: string;
  description: string;
  image: string;
  buttonText: string;
  buttonLink: string;
}

const SponsoredAd: React.FC<AdProps> = ({
  title,
  description,
  image,
  buttonText,
  buttonLink,
}) => {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-10 items-center">

        {/* Left: image */}
        <div className="relative">
          <Image
            src={image}
            alt="Advertisement"
            width={800}
            height={500}
            className="rounded-3xl shadow-xl"
          />
          <span className="absolute top-4 left-4 bg-yellow-500 text-white px-3 py-1 text-xs font-semibold rounded-full shadow">
            Sponsored
          </span>
        </div>

        {/* Right: text */}
        <div className="space-y-6">
          <h3 className="text-4xl font-bold text-slate-900">{title}</h3>
          <p className="text-lg text-slate-600 leading-relaxed">{description}</p>

          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 rounded-xl shadow-md text-lg"
            onClick={() => window.open(buttonLink, "_blank")}
          >
            {buttonText}
          </Button>
        </div>

      </div>
    </section>
  );
};

export default SponsoredAd;
