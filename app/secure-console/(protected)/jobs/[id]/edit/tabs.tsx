"use client";

import { useState } from "react";
import BasicJobForm from "./tabs/basic";
import JobDatesTab from "./tabs/dates";
import JobVacancyTab from "./tabs/vacancy";
import JobLinksTab from "./tabs/links";

const TABS = [
  { key: "basic", label: "Basic Info" },
  { key: "dates", label: "Important Dates" },
  { key: "vacancy", label: "Vacancy Breakup" },
  { key: "links", label: "Important Links" },
];

export default function JobEditTabs({
  jobId,
  job,
  dates,
  vacancy,
  links,
}: any) {
  const [active, setActive] = useState("basic");

  return (
    <div className="bg-white border rounded-xl shadow-sm">
      {/* Tabs */}
      <div className="flex border-b">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setActive(t.key)}
            className={`px-4 py-3 text-sm font-medium border-b-2 ${
              active === t.key
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-500"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="p-6">
        {active === "basic" && (
          <BasicJobForm jobId={jobId} job={job} />
        )}
        {active === "dates" && (
          <JobDatesTab jobId={jobId} dates={dates} />
        )}
        {active === "vacancy" && (
          <JobVacancyTab jobId={jobId} vacancy={vacancy} />
        )}
        {active === "links" && (
          <JobLinksTab jobId={jobId} links={links} />
        )}
      </div>
    </div>
  );
}
