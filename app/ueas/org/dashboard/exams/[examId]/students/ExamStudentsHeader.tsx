"use client";

export default function ExamStudentsHeader({
  search,
  inviteStatus,
  credentialsStatus,
  examStatus,
  onSearchChange,
  onInviteStatusChange,
  onCredentialsStatusChange,
  onExamStatusChange,
  onReset,
}: any) {
  return (
    <div className="bg-white border rounded-xl p-4 grid grid-cols-1 md:grid-cols-6 gap-3">

      <input
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Search name / roll / email"
        className="border rounded px-3 py-2 text-sm col-span-2"
      />

      <select
        value={inviteStatus}
        onChange={(e) => onInviteStatusChange(e.target.value)}
        className="border rounded px-3 py-2 text-sm"
      >
        <option value="">Invite Status</option>
        <option value="sent">Sent</option>
        <option value="pending">Pending</option>
        <option value="processing">Processing</option>
        <option value="failed">Failed</option>
      </select>

      <select
        value={credentialsStatus}
        onChange={(e) => onCredentialsStatusChange(e.target.value)}
        className="border rounded px-3 py-2 text-sm"
      >
        <option value="">Credentials</option>
        <option value="sent">Sent</option>
        <option value="pending">Pending</option>
        <option value="processing">Processing</option>
        <option value="failed">Failed</option>
      </select>

      <select
        value={examStatus}
        onChange={(e) => onExamStatusChange(e.target.value)}
        className="border rounded px-3 py-2 text-sm"
      >
        <option value="">Exam Status</option>
        <option value="not_started">Not Started</option>
        <option value="started">Started</option>
        <option value="completed">Completed</option>
        <option value="suspended">Suspended</option>
      </select>

      <button
        onClick={onReset}
        className="bg-slate-100 hover:bg-slate-200 rounded px-3 py-2 text-sm"
      >
        Reset
      </button>
    </div>
  );
}
