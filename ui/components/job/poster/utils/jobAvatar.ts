export function getJobAvatar(job: any): string {
  // Normalize helpers
  const title = (job.title || "").toLowerCase();
  const category = (job.category || "").toLowerCase();
  const type = (job.type || "").toLowerCase();

  /* ========================
     PRIORITY 1: JOB TYPE
  ======================== */
  if (type.includes("result")) return "/illustrations/result.png";
  if (type.includes("admit")) return "/illustrations/admit-card.png";

  if (title.includes("result")) return "/illustrations/result.png";
  if (title.includes("admit")) return "/illustrations/admit-card.png";

  /* ========================
     PRIORITY 2: CATEGORY / DEPARTMENT
  ======================== */
  if (category.includes("bank") || title.includes("bank") || title.includes("ibps") || title.includes("sbi"))
    return "/illustrations/banking.png";

  if (category.includes("rail") || title.includes("rrb"))
    return "/illustrations/railway.png";

  if (category.includes("police") || title.includes("constable"))
    return "/illustrations/police.png";

  if (category.includes("army") || title.includes("army") || title.includes("navy") || title.includes("air force"))
    return "/illustrations/army.png";

  if (category.includes("teacher") || title.includes("teacher") || title.includes("lecturer"))
    return "/illustrations/teacher.png";

  if (category.includes("engineer") || title.includes("engineer") || title.includes("je"))
    return "/illustrations/engineering.png";

  if (category.includes("clerk") || title.includes("clerk"))
    return "/illustrations/clerk.png";

  /* ========================
     FALLBACK
  ======================== */
  return "/illustrations/students.png";
}
