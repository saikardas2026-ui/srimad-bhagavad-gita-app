interface Props { onHome: () => void; fadeIn: boolean; }

export function About({ onHome, fadeIn }: Props) {
  return (
    <div className={`screen simple-content-screen ${fadeIn ? "visible" : ""}`}>
      <div className="reader-topbar">
        <button className="topbar-home-btn" onClick={onHome}>
          <i className="fa-solid fa-house" /><span>হোম</span>
        </button>
        <div className="topbar-title"><span className="topbar-om">ॐ</span> পরিচিতি</div>
        <div className="topbar-spacer" />
      </div>

      <div className="sc-scroll">
        <div className="sc-inner">

          {/* Header */}
          <div className="sc-header">
            <div className="sc-om">ॐ</div>
            <h2 className="sc-heading">পরিচিতি</h2>
            <div className="sc-heading-under" />
            <p className="sc-subtext">Srimad Bhagavad Gita — Eternal Wisdom, Modern Medium</p>
          </div>

          {/* Main content card */}
          <div className="about-content-card">
            <div className="about-content-icon">
              <i className="fa-solid fa-book-open-reader" />
            </div>

            <p className="about-content-para">
              This <strong>Srimad Bhagavad Gita</strong> application has been thoughtfully
              envisioned, developed, and is solely owned by{" "}
              <strong>Saikar Das</strong>. It was created with the noble purpose of bringing
              the eternal teachings and divine wisdom of Lord Krishna to everyone in a simple,
              accessible way.
            </p>

            <div className="about-content-divider" />

            <p className="about-content-para">
              Our core mission is to utilize modern technology to deliver the pure, unaltered
              essence of the Gita to every heart. All rights to this application's design,
              concept, and structural implementation belong exclusively to the owner.
            </p>

            <div className="about-content-divider" />

            <p className="about-content-para">
              Enrich your daily life and elevate your spiritual consciousness by reading the
              Gita every day.
            </p>
          </div>

          {/* Metadata card */}
          <div className="about-meta-card">
            <div className="about-meta-row">
              <span className="about-meta-icon"><i className="fa-solid fa-user-pen" /></span>
              <span className="about-meta-label">Developer &amp; Owner</span>
              <span className="about-meta-value">Saikar Das</span>
            </div>
            <div className="about-meta-divider" />
            <div className="about-meta-row">
              <span className="about-meta-icon"><i className="fa-solid fa-code-branch" /></span>
              <span className="about-meta-label">Version</span>
              <span className="about-meta-value">1.0.0</span>
            </div>
            <div className="about-meta-divider" />
            <div className="about-meta-row">
              <span className="about-meta-icon"><i className="fa-solid fa-envelope" /></span>
              <span className="about-meta-label">Contact</span>
              <a className="about-meta-link" href="mailto:supportgitaapp@gmail.com">
                supportgitaapp@gmail.com
              </a>
            </div>
          </div>

          {/* Footer */}
          <div className="about-footer-note">
            <i className="fa-solid fa-om" />
            <span>Hare Krishna — May the Gita illuminate every heart.</span>
          </div>

        </div>
      </div>

      <div className="admob-placeholder">
        <span className="admob-label"><i className="fa-solid fa-rectangle-ad" /> Advertisement</span>
      </div>
    </div>
  );
}
