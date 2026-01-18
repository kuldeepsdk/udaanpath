"use client";

import Link from "next/link";
import { featuresData } from "@/ui/components/assets/featuresData";
import { FeatureCard } from "@/ui/components/assets/FeatureCard";

const Features = () => {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#f8fbff] to-white">
      {/* Title */}
      <div className="max-w-3xl mx-auto text-center mb-14">
        <h2 className="text-4xl font-extrabold text-slate-900 mb-4">
          Why Choose <span className="text-blue-600">UdaanPath?</span>
        </h2>
        <p className="text-slate-600 text-lg">
          One platform for government jobs, exam updates and free tools that
          actually help you submit forms without rejection.
        </p>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {featuresData.map((item, index) => (
          <FeatureCard
            key={index}
            Icon={item.icon}
            title={item.title}
            desc={item.desc}
            delay={index * 120}
            href={item.href}
          />
        ))}
      </div>

      {/* Tools CTA */}
      <div className="text-center mt-14">
        <Link
          href="/tools"
          className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-6 py-3 text-white font-medium hover:bg-blue-700 transition"
        >
          Use Free Exam Tools →
        </Link>
      </div>
    </section>
  );
};

export default Features;
