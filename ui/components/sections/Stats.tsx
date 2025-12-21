"use client";

import { Users, FileText, GraduationCap, Zap } from "lucide-react";
import { Card } from "@/ui/components/tags/card";
import { useEffect, useRef, useState } from "react";
import { useCountUp } from "@/hooks/useCountUp";

/* SAME DATA */
const statsData = [
  { icon: Users, value: 10000, suffix: "+", label: "Active Users" },
  { icon: FileText, value: 1000, suffix: "+", label: "Job Listings" },
  { icon: GraduationCap, value: 50, suffix: "+", label: "Free Courses" },
  { icon: Zap, value: 24, suffix: "/7", label: "Updates" },
];

/* 🔹 Child component (hook-safe) */
function StatCard({
  icon: Icon,
  value,
  suffix,
  label,
  trigger,
  delay,
}: {
  icon: any;
  value: number;
  suffix: string;
  label: string;
  trigger: boolean;
  delay: number;
}) {
  const count = useCountUp(trigger ? value : 0, 2000);

  return (
    <Card
      className="glass-card p-6 text-center hover:scale-[1.06] transition duration-300 border-0 shadow-soft animate-fade-in"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Icon */}
      <Icon className="w-10 h-10 mx-auto mb-4 text-blue-600 animate-bounce-slow" />

      {/* Number */}
      <div className="text-4xl font-bold text-slate-900 mb-1 tracking-tight">
        {count.toLocaleString()}
        <span className="text-blue-600">{suffix}</span>
      </div>

      {/* Label */}
      <div className="text-sm text-slate-600 font-medium">
        {label}
      </div>
    </Card>
  );
}

const Stats = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [trigger, setTrigger] = useState(false);

  /* SAME IntersectionObserver logic */
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setTrigger(true);
      },
      { threshold: 0.3 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} className="py-20 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-6">
        {statsData.map((stat, index) => (
          <StatCard
            key={index}
            icon={stat.icon}
            value={stat.value}
            suffix={stat.suffix}
            label={stat.label}
            trigger={trigger}
            delay={index * 100}
          />
        ))}
      </div>
    </section>
  );
};

export default Stats;
