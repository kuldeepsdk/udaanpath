interface Props {
  title: string;
  value: string;
  subtitle?: string;
}

export default function StatCard({ title, value, subtitle }: Props) {
  return (
    <div className="bg-white rounded-xl border p-5">
      <p className="text-sm text-slate-500">{title}</p>
      <p className="mt-2 text-3xl font-bold text-slate-900">{value}</p>
      {subtitle && (
        <p className="mt-1 text-xs text-slate-400">{subtitle}</p>
      )}
    </div>
  );
}
