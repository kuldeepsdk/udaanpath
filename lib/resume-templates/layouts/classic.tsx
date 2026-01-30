type ResumeProps = {
  photo?: string | null;
};

export default function ClassicResume(_: ResumeProps) {
  return (
    <div className="resume-page classic-resume">
      {/* ===== HEADER ===== */}
      <header className="resume-header">
        <h1
          contentEditable
          suppressContentEditableWarning
          className="name"
        >
          YOUR NAME
        </h1>
        <p
          contentEditable
          suppressContentEditableWarning
          className="contact"
        >
          Mobile: 9XXXXXXXXX | Email: your@email.com | City, State
        </p>
      </header>

      {/* ===== BODY ===== */}
      <main className="resume-body">
        {/* SUMMARY */}
        <section className="resume-section">
          <h2 className="section-title">PROFILE SUMMARY</h2>
          <p
            contentEditable
            suppressContentEditableWarning
            className="text"
          >
            Motivated and disciplined candidate seeking an opportunity to apply
            skills effectively while growing professionally and contributing to
            organizational success.
          </p>
        </section>

        {/* EDUCATION */}
        <section className="resume-section">
          <h2 className="section-title">EDUCATION</h2>
          <p
            contentEditable
            suppressContentEditableWarning
            className="text"
          >
            Bachelor’s Degree – University / Board Name (Year)
            <br />
            Marks / CGPA: XX
          </p>
        </section>

        {/* EXPERIENCE */}
        <section className="resume-section">
          <h2 className="section-title">EXPERIENCE</h2>
          <p
            contentEditable
            suppressContentEditableWarning
            className="text"
          >
            Job Title – Organization Name
            <br />
            Duration (From – To)
            <br />
            • Describe responsibilities and achievements clearly
            <br />
            • Use bullet-style points for clarity
          </p>
        </section>

        {/* SKILLS */}
        <section className="resume-section">
          <h2 className="section-title">SKILLS</h2>
          <p
            contentEditable
            suppressContentEditableWarning
            className="text"
          >
            Communication, Teamwork, MS Office, Problem Solving, Time Management
          </p>
        </section>

        {/* PERSONAL DETAILS */}
        <section className="resume-section">
          <h2 className="section-title">PERSONAL DETAILS</h2>
          <p
            contentEditable
            suppressContentEditableWarning
            className="text"
          >
            Date of Birth: DD/MM/YYYY
            <br />
            Gender: ___
            <br />
            Category: ___
            <br />
            Nationality: Indian
          </p>
        </section>

        {/* DECLARATION */}
        <section className="resume-section">
          <h2 className="section-title">DECLARATION</h2>
          <p
            contentEditable
            suppressContentEditableWarning
            className="text"
          >
            I hereby declare that the above information is true and correct to
            the best of my knowledge and belief.
          </p>

          <div className="declaration-footer">
            <span contentEditable suppressContentEditableWarning>
              Place:
            </span>
            <span contentEditable suppressContentEditableWarning>
              Date:
            </span>
            <span contentEditable suppressContentEditableWarning>
              Signature
            </span>
          </div>
        </section>
      </main>

      {/* ===== STYLES ===== */}
      <style jsx>{`
        .resume-page {
          width: 210mm;
          min-height: 297mm;
          background: #ffffff;
          font-family: "Times New Roman", serif;
          color: #000;
        }

        .classic-resume {
          padding: 32px 40px;
        }

        .resume-header {
          text-align: center;
          border-bottom: 2px solid #000;
          padding-bottom: 10px;
          margin-bottom: 18px;
        }

        .name {
          font-size: 26px;
          font-weight: bold;
          letter-spacing: 1px;
        }

        .contact {
          font-size: 12px;
          margin-top: 4px;
        }

        .resume-body {
          font-size: 13px;
        }

        .resume-section {
          margin-bottom: 14px;
        }

        .section-title {
          font-size: 13px;
          font-weight: bold;
          border-bottom: 1px solid #000;
          padding-bottom: 2px;
          margin-bottom: 6px;
        }

        .text {
          line-height: 1.5;
        }

        .declaration-footer {
          display: flex;
          justify-content: space-between;
          margin-top: 18px;
          font-size: 12px;
        }

        @media (max-width: 1024px) {
          .resume-page {
            width: 100%;
            min-height: auto;
          }

          .classic-resume {
            padding: 24px;
          }
        }
      `}</style>
    </div>
  );
}
