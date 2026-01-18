import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Online Tools for Govt Exam Forms | UdaanPath",
  description:
    "Resize photo, crop image, compress PDF, signature resize & more tools for government exam forms. 100% free & online.",
};

export default function ToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="max-w-7xl mx-auto px-4 py-6">
      {children}
    </section>
  );
}
