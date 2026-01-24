export default function PosterBackground({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        width: "1536px",
        height: "1024px",
        position: "relative",
        backgroundImage: "url('/images/job_post_bg.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundColor: "#ffffff",
      }}
    >
      {children}
    </div>
  );
}
