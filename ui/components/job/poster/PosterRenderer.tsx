"use client";

import JobPosterJob from "@/ui/components/job/poster/templates/JobPosterJob";
import JobPosterAdmit from "@/ui/components/job/poster/templates/JobPosterAdmit";
import JobPosterResult from "@/ui/components/job/poster/templates/JobPosterResult";

export default function PosterRenderer({ job }: { job: any }) {
  switch (job.category) {
    case "job":
      return <JobPosterJob job={job} />;
    case "admit_card":
      return <JobPosterAdmit job={job} />;
    case "result":
      return <JobPosterResult job={job} />;
    default:
      return <JobPosterJob job={job} />;
  }
}
