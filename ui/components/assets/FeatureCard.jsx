import { Card } from "@/ui/components/tags/card";

export const FeatureCard = ({ Icon, title, desc, delay }) => {
  return (
    <Card
      className="glass-card p-6 shadow-soft hover:shadow-lg border-0 transition-all duration-300 animate-fade-in hover:-translate-y-1"
      style={{ animationDelay: `${delay}ms` }}
    >
      <Icon className="w-10 h-10 text-blue-600 mb-4 animate-bounce-slow" />

      <h3 className="text-xl font-semibold text-slate-900 mb-2">
        {title}
      </h3>

      <p className="text-slate-600 text-sm leading-relaxed">
        {desc}
      </p>
    </Card>
  );
};
