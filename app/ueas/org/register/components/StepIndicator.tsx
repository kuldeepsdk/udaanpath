// app\ueas\org\register\components\StepIndicator.tsx
interface Props {
  current: number;
}

const steps = [
  "Organization",
  "Admin Details",
  "Security",
  "Review",
];

export default function StepIndicator({ current }: Props) {
  return (
    <div className="flex items-center justify-between mb-10">
      {steps.map((step, idx) => {
        const stepNo = idx + 1;
        const active = stepNo <= current;

        return (
          <div key={step} className="flex-1 flex items-center">
            <div
              className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-semibold
              ${active ? "bg-blue-600 text-white" : "bg-slate-200 text-slate-600"}`}
            >
              {stepNo}
            </div>

            <span
              className={`ml-3 text-sm font-medium ${
                active ? "text-slate-900" : "text-slate-400"
              }`}
            >
              {step}
            </span>

            {idx < steps.length - 1 && (
              <div className="flex-1 h-[2px] mx-4 bg-slate-200" />
            )}
          </div>
        );
      })}
    </div>
  );
}
