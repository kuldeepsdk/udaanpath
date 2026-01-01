export default function ExamInfoCard({
  exam,
  organization,
}: {
  exam: any;
  organization: any;
}) {
  return (
    <div className="bg-white border rounded-xl p-6 text-center space-y-3">

      {organization.logo && (
        <img
          src={organization.logo}
          alt={organization.name}
          className="h-12 mx-auto"
        />
      )}

      <h1 className="text-xl font-bold text-slate-900">
        {exam.name}
      </h1>

      <p className="text-sm text-slate-600">
        Conducted by <b>{organization.name}</b>
      </p>

      <p className="text-sm text-slate-500">
        {new Date(exam.exam_date).toLocaleDateString()} ·{" "}
        {exam.start_time} – {exam.end_time}
      </p>
    </div>
  );
}
