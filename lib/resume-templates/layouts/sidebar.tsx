type ResumeProps = {
  photo?: string | null;
};

export default function SidebarResume({ photo }: ResumeProps) {
  return (
    <div className="resume-page sidebar-resume">
      {/* ===== LEFT SIDEBAR ===== */}
      <aside className="sidebar">
        <div className="photo">
          {photo ? (
            <img
              src={photo}
              alt="Profile"
              className="photo-circle"
            />
          ) : (
            <div className="photo-circle placeholder">
              Upload Photo
            </div>
          )}
        </div>

        <section>
          <h4>SUMMARY</h4>
          <p contentEditable suppressContentEditableWarning>
            Highly motivated professional with strong problem-solving skills
            and experience in team-driven environments.
          </p>
        </section>

        <section>
          <h4>CORE SKILLS</h4>
          <ul contentEditable suppressContentEditableWarning>
            <li>Communication</li>
            <li>Leadership</li>
            <li>Client Management</li>
            <li>Negotiation</li>
          </ul>
        </section>
      </aside>

      {/* ===== MAIN CONTENT ===== */}
      <main className="content">
        <header>
          <h1 contentEditable suppressContentEditableWarning>
            YOUR NAME
          </h1>
          <h2 contentEditable suppressContentEditableWarning>
            PROFESSIONAL TITLE
          </h2>
        </header>

        <section>
          <h3>WORK EXPERIENCE</h3>
          <p contentEditable suppressContentEditableWarning>
            <strong>Job Title</strong> – Company Name
            <br />
            Jan 2020 – Present
            <br />
            Describe your responsibilities and achievements here.
          </p>
        </section>

        <section>
          <h3>EDUCATION</h3>
          <p contentEditable suppressContentEditableWarning>
            Bachelor’s Degree – University Name (Year)
          </p>
        </section>
      </main>

      {/* ===== STYLES ===== */}
      <style jsx>{`
        .resume-page {
          width: 210mm;
          min-height: 297mm;
          display: grid;
          grid-template-columns: 32% 68%;
          font-family: "Inter", Arial, sans-serif;
          background: #ffffff;
          color: #000;
        }

        /* SIDEBAR */
        .sidebar {
          background: #0f4c5c;
          color: #ffffff;
          padding: 24px;
        }

        .photo {
          display: flex;
          justify-content: center;
          margin-bottom: 20px;
        }

        .photo-circle {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          object-fit: cover;
          border: 3px solid #ffffff;
        }

        .photo-circle.placeholder {
          background: rgba(255, 255, 255, 0.25);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          color: #ffffff;
        }

        .sidebar h4 {
          font-size: 12px;
          letter-spacing: 1px;
          margin-bottom: 6px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.5);
          padding-bottom: 2px;
        }

        .sidebar p,
        .sidebar li {
          font-size: 12px;
          line-height: 1.5;
        }

        .sidebar ul {
          padding-left: 16px;
          list-style: disc;
        }

        /* MAIN CONTENT */
        .content {
          padding: 32px;
        }

        .content h1 {
          font-size: 28px;
          font-weight: 700;
        }

        .content h2 {
          font-size: 14px;
          color: #555;
          margin-bottom: 20px;
          letter-spacing: 1px;
          text-transform: uppercase;
        }

        .content h3 {
          font-size: 13px;
          font-weight: 700;
          border-bottom: 1px solid #ddd;
          margin-bottom: 8px;
          padding-bottom: 2px;
        }

        .content p {
          font-size: 13px;
          line-height: 1.6;
        }

        @media (max-width: 1024px) {
          .resume-page {
            width: 100%;
            min-height: auto;
            grid-template-columns: 1fr;
          }

          .content {
            padding: 24px;
          }
        }
      `}</style>
    </div>
  );
}
