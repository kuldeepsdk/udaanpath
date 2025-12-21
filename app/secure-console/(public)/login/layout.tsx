export const metadata = {
  robots: "noindex, nofollow",
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-slate-100 min-h-screen flex items-center justify-center">
      {children}
    </div>
  );
}
