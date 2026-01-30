type ResumeProps = {
  photo?: string | null;
};

export default function ModernCardResume({ photo }: ResumeProps) {
  return (
    <div className="resume-page modern-card-resume">
      {/* ===== HERO HEADER ===== */}
      <header className="hero">
        <div className="hero-left">
          <h1 contentEditable suppressContentEditableWarning className="name">
            YOUR NAME
          </h1>
          <h2 contentEditable suppressContentEditableWarning className="role">
            PROFESSIONAL TITLE
          </h2>

          <p contentEditable suppressContentEditableWarning className="tagline">
            Helping organizations grow through strategy, insight, and execution.
          </p>
        </div>

        <div className="hero-right">
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
      </header>

      {/* ===== BODY ===== */}
      <main className="resume-body">
        {/* LEFT COLUMN */}
        <section className="column">
          <div className="card">
            <h3 className="card-title">Education & Experience</h3>
            <p contentEditable suppressContentEditableWarning>
              • Graduated from University Name (Year)
              <br />
              • Started career at Organization Name
              <br />
              • Achieved professional certifications
            </p>
          </div>

          <div className="card">
            <h3 className="card-title">Achievements</h3>
            <p contentEditable suppressContentEditableWarning>
              • Led successful projects impacting business growth
              <br />
              • Conducted workshops and seminars
              <br />
              • Recognized for leadership and performance
            </p>
          </div>
        </section>

        {/* RIGHT COLUMN */}
        <section className="column">
          <div className="card">
            <h3 className="card-title">Working Approach</h3>
            <p contentEditable suppressContentEditableWarning>
              I believe in integrity, diligence, and client-centric problem
              solving. My approach focuses on understanding challenges deeply
              and designing practical, sustainable solutions.
            </p>
          </div>

          <div className="card">
            <h3 className="card-title">Outside the Office</h3>
            <p contentEditable suppressContentEditableWarning>
              When not working, I enjoy learning, mentoring, reading, and
              engaging in activities that improve creativity and balance.
            </p>
          </div>
        </section>
      </main>

      {/* ===== FOOTER ===== */}
      <footer className="resume-footer">
        <p contentEditable suppressContentEditableWarning>
          📧 email@example.com &nbsp; | &nbsp; 📞 9XXXXXXXXX &nbsp; | &nbsp;
          linkedin.com/in/username
        </p>
      </footer>

      {/* ===== STYLES ===== */}
      <style jsx>{`
        .resume-page {
          width: 210mm;
          min-height: 297mm;
          background: #f7f7f7;
          font-family: "Inter", Arial, sans-serif;
          color: #111;
          display: flex;
          flex-direction: column;
        }

        /* HERO */
        .hero {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 36px 40px;
          background: #ffffff;
        }

        .name {
          font-size: 30px;
          font-weight: 800;
          margin-bottom: 6px;
        }

        .role {
          font-size: 14px;
          font-weight: 600;
          color: #f5b400;
          letter-spacing: 1px;
          text-transform: uppercase;
        }

        .tagline {
          font-size: 13px;
          margin-top: 12px;
          max-width: 420px;
          line-height: 1.6;
          color: #444;
        }

        .photo-circle {
          width: 140px;
          height: 140px;
          border-radius: 50%;
          object-fit: cover;
          border: 4px solid #f5b400;
        }

        .photo-circle.placeholder {
          background: #f5b400;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: 600;
          color: #000;
        }

        /* BODY */
        .resume-body {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
          padding: 28px 40px;
          flex: 1;
        }

        .column {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .card {
          background: #ffffff;
          padding: 18px 20px;
          border-radius: 10px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
          font-size: 13px;
          line-height: 1.6;
        }

        .card-title {
          font-size: 14px;
          font-weight: 700;
          margin-bottom: 8px;
          color: #000;
          border-left: 4px solid #f5b400;
          padding-left: 8px;
        }

        /* FOOTER */
        .resume-footer {
          background: #ffffff;
          padding: 14px 40px;
          font-size: 12px;
          text-align: center;
          border-top: 1px solid #e5e7eb;
        }

        @media (max-width: 1024px) {
          .resume-page {
            width: 100%;
            min-height: auto;
          }

          .hero {
            flex-direction: column;
            text-align: center;
            gap: 16px;
          }

          .resume-body {
            grid-template-columns: 1fr;
            padding: 24px;
          }

          .photo-circle {
            width: 120px;
            height: 120px;
          }
        }
      `}</style>
    </div>
  );
}
