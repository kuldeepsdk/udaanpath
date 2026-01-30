// lib/resume-templates/templates.ts

export type ResumeLayout =
  | "classic"
  | "header-band"
  | "sidebar"
  | "modern-card";

export type ResumeTemplate = {
  id: string;
  name: string;
  description: string;
  features: string[];
  previewImage: string;
  layout: ResumeLayout;
  tags?: string[];
};

export const RESUME_TEMPLATES: ResumeTemplate[] = [
  {
    id: "101",
    name: "Classic Simple Resume",
    description:
      "Clean and simple resume format suitable for freshers and government jobs.",
    features: [
      "ATS friendly",
      "One page format",
      "Official resume style",
      "Easy to read",
    ],
    previewImage: "/resume-templates/classic-simple.png",
    layout: "classic",
    tags: ["Simple", "Fresher", "Govt Friendly"],
  },

  {
    id: "102",
    name: "Professional Header Resume",
    description:
      "Modern professional resume with bold header band and structured layout.",
    features: [
      "Modern header band",
      "Two column layout",
      "Photo support",
      "Corporate friendly",
    ],
    previewImage: "/resume-templates/header-band.png",
    layout: "header-band",
    tags: ["Professional", "Corporate", "Featured"],
  },

  {
    id: "103",
    name: "Creative Sidebar Resume",
    description:
      "Sidebar-based resume with strong visual hierarchy and skill focus.",
    features: [
      "Sidebar layout",
      "Skill focused",
      "Photo support",
      "Creative design",
    ],
    previewImage: "/resume-templates/sidebar.png",
    layout: "sidebar",
    tags: ["Creative", "Designer", "Modern"],
  },

  {
    id: "104",
    name: "Modern Card Resume",
    description:
      "Premium card-style resume designed for consultants and leadership roles.",
    features: [
      "Premium look",
      "Card-based sections",
      "Personal branding",
      "Consultant friendly",
    ],
    previewImage: "/resume-templates/modern-card.png",
    layout: "modern-card",
    tags: ["Premium", "Consultant", "Featured"],
  },
];
