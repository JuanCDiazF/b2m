import { useState, useMemo } from "react";

// --- Helpers ---
const STARS_DATA = Array.from({ length: 40 }, (_, i) => ({
  id: i,
  top: (Math.sin(i * 137.5) * 0.5 + 0.5) * 100,
  left: (Math.cos(i * 137.5) * 0.5 + 0.5) * 100,
  delay: (i * 0.15) % 6,
  d: 3 + (i * 0.17) % 4,
}));

function Stars() {
  return (
    <div className="stars">
      {STARS_DATA.map(s => (
        <div key={s.id} className="star" style={{
          top: `${s.top}%`, left: `${s.left}%`,
          "--delay": `${s.delay}s`, "--d": `${s.d}s`
        }} />
      ))}
    </div>
  );
}

function getDaysLived(dob) {
  return Math.floor((Date.now() - new Date(dob + "T12:00:00").getTime()) / 86400000);
}

function formatDate(dob) {
  return new Date(dob + "T12:00:00").toLocaleDateString("en-US", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });
}

// --- App ---
export default function Home() {
  const [screen, setScreen] = useState("welcome");
  const [dob, setDob] = useState("");
  const [story, setStory] = useState("");
  const [generation, setGeneration] = useState("");
  const [error, setError] = useState("");
  const today = new Date().toISOString().split("T")[0];

  async function generateStory() {
    if (!dob) { setError("Please enter your date of birth."); return; }
    setError("");
    setScreen("loading");

    try {
      const res = await fetch("/api/story", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dob }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.error || "Unknown error");
      }

      setStory(data.story);
      setGeneration(data.generation);
      setScreen("story");
    } catch (e) {
      setError(e.message || "Something went wrong. Please try again.");
      setScreen("input");
    }
  }

  const daysLived = dob ? getDaysLived(dob) : 0;
  const formattedDob = dob ? formatDate(dob) : "";
  const words = story.split(" ");
  const visibleStory = words.slice(0, Math.floor(words.length * 0.62)).join(" ") + "…";

  return (
    <>
      <div className="noise" />

      {screen !== "welcome" && screen !== "loading" && (
        <button className="back-btn" onClick={() => {
          setScreen("welcome"); setStory(""); setError(""); setGeneration("");
        }}>← BACK</button>
      )}

      {/* ── WELCOME ── */}
      {screen === "welcome" && (
        <div className="screen fade-in">
          <Stars />
          <div className="orb orb-1" />
          <div className="orb orb-2" />
          <div className="orb orb-3" />
          <div className="logo-mark">B2M · BACK TO ME</div>
          <h1 className="welcome-hook">
            Do you want to see your story<br />in the world?
          </h1>
          <p className="welcome-sub">Every life has a timeline the world remembers.</p>
          <button className="btn-primary" onClick={() => setScreen("input")}>
            BEGIN YOUR STORY
          </button>
        </div>
      )}

      {/* ── INPUT ── */}
      {screen === "input" && (
        <div className="screen slide-up">
          <Stars />
          <div className="orb orb-1" />
          <p className="screen-title">YOUR ORIGIN</p>
          <h2 className="screen-heading">When did your<br />story begin?</h2>
          <p className="screen-desc">The exact moment the world changed.</p>
          <div className="date-input-wrap">
            <label className="date-label">DATE OF BIRTH</label>
            <input
              type="date"
              className="date-input"
              value={dob}
              max={today}
              onChange={e => { setDob(e.target.value); setError(""); }}
            />
          </div>
          {error && <p className="error-msg">{error}</p>}
          <button className="btn-primary" onClick={generateStory} style={{ marginTop: 16 }}>
            RECONSTRUCT MY TIMELINE
          </button>
        </div>
      )}

      {/* ── LOADING ── */}
      {screen === "loading" && (
        <div className="screen fade-in">
          <div className="loader-ring" />
          <p className="loading-text">Reconstructing your timeline…</p>
          <p className="loading-sub">TRAVELING BACK IN TIME</p>
        </div>
      )}

      {/* ── STORY ── */}
      {screen === "story" && (
        <div className="fade-in">
          {/* Hero */}
          <div className="story-hero">
            <Stars />
            <div className="orb orb-1" />
            <div className="orb orb-2" />
            <p className="story-date-tag">B2M · BACK TO ME · {formattedDob.toUpperCase()}</p>
            <h1 className="story-headline">Your day,<br />in the world.</h1>
          </div>

          {/* Body */}
          <div className="story-body">

            {/* Stats */}
            <div className="story-section" style={{ animationDelay: "0.1s", display: "flex", gap: 40 }}>
              <div>
                <p className="section-label">DAYS LIVED</p>
                <p className="section-stat">{daysLived.toLocaleString()}</p>
                <p className="section-stat-label">days of your story</p>
              </div>
              <div>
                <p className="section-label">YOUR ERA</p>
                <p className="section-stat" style={{ fontSize: "clamp(18px,5vw,26px)", lineHeight: 1.3, paddingTop: 8 }}>
                  {generation}
                </p>
                <p className="section-stat-label">generational identity</p>
              </div>
            </div>

            {/* Narrative (partial) */}
            <div className="story-section" style={{ animationDelay: "0.3s" }}>
              <p className="section-label">YOUR NARRATIVE</p>
              <p className="narrative-text">{visibleStory}</p>
            </div>

            {/* Paywall */}
            <div className="paywall">
              <p className="paywall-mystery">
                "Your story has more layers<br />we haven't revealed yet…"
              </p>
              <p className="paywall-sub">
                Unlock your full life narrative — the complete story of your world,
                your generation, and where your timeline leads next.
              </p>
              <button className="btn-unlock">UNLOCK FULL STORY</button>
              <p className="unlock-price">$2.99 · One time · Yours forever</p>
            </div>

            {/* Share card */}
            <div className="share-section">
              <p className="section-label" style={{ marginBottom: 20 }}>SHARE YOUR STORY</p>
              <div className="share-card">
                <p className="share-card-title">B2M · BACK TO ME</p>
                <p className="share-card-text">
                  "I've lived {daysLived.toLocaleString()} days.<br />
                  I arrived as a {generation}.<br />
                  The world has never been the same."
                </p>
              </div>
              <button className="btn-share">SHARE MY TIMELINE</button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
