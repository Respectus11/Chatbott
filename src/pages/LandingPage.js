import React from "react";
import MerkuzeChatWidget from "../components/MerkuzeChatWidget";

function LandingPage() {
  let isAuthenticated = false;
  if (typeof window !== "undefined") {
    isAuthenticated = Boolean(localStorage.getItem("token"));
  }

  return (
    <div className="landing-page">
      <header className="lp-header">
        <div className="lp-brand">
          <div className="lp-logo">
            <span className="lp-logo-am">ም</span>
            <div className="lp-logo-text-block">
              <span className="lp-logo-text">
                ምርኩዜ <span className="lp-logo-sub">Merkuze</span>
              </span>
              <span className="lp-logo-hospital">
                ጥቁር አንበሳ ሆስፒታል · Tikur Anbessa Hospital
              </span>
            </div>
          </div>
          <p className="lp-brand-tagline">
            Your digital supporter at Tikur Anbessa (Black Lion) Hospital
          </p>
        </div>

        <nav className="lp-nav">
          <a href="#about">About Hospital</a>
          <a href="#merkuze">Why Merkuze</a>
          <a href="#capabilities">What it can do</a>
          <a href="#how-it-works">How it works</a>
        </nav>

        <div className="lp-nav-cta">
          <a href="/login" className="lp-btn lp-btn-ghost">
            Log in
          </a>
          <a href="/signup" className="lp-btn lp-btn-primary">
            Get started
          </a>
        </div>
      </header>

      <main>
        <section className="lp-hero" aria-labelledby="hero-title">
          <div className="lp-hero-main">
            <p className="lp-pill">
              ጥቁር አንበሳ ሆስፒታል • Addis Ababa • 24/7 digital help
            </p>

            <h1 id="hero-title" className="lp-hero-title">
              Modern care at Black Lion.{" "}
              <span className="lp-hero-highlight">Guided by Merkuze.</span>
            </h1>

            <p className="lp-hero-sub">
              Tikur Anbessa (Black Lion) is Ethiopia&apos;s largest referral and
              teaching hospital. Merkuze — ምርኩዜ, meaning &quot;supporter&quot;
              — is a hospital-trained chatbot that helps patients and caretakers
              find the right information, any time of day.
            </p>

            <div className="lp-hero-actions">
              {isAuthenticated ? (
                <a href="#merkuze" className="lp-btn lp-btn-primary lp-btn-lg">
                  Start chatting with Merkuze
                </a>
              ) : (
                <a href="/login" className="lp-btn lp-btn-primary lp-btn-lg">
                  Log in to chat with Merkuze
                </a>
              )}
              <a href="#capabilities" className="lp-btn lp-btn-ghost lp-btn-lg">
                See what it can do
              </a>
            </div>

            <div className="lp-hero-stats">
              <div className="lp-stat">
                <p className="lp-stat-label">Patients guided</p>
                <p className="lp-stat-value">24 / 7</p>
                <p className="lp-stat-sub">digital support</p>
              </div>
              <div className="lp-stat">
                <p className="lp-stat-label">Built for</p>
                <p className="lp-stat-value">Tikur Anbessa</p>
                <p className="lp-stat-sub">Black Lion Hospital</p>
              </div>
              <div className="lp-stat">
                <p className="lp-stat-label">Focus</p>
                <p className="lp-stat-value">Safer journeys</p>
                <p className="lp-stat-sub">from first question to follow‑up</p>
              </div>
            </div>
          </div>

          <aside className="lp-hero-panel" aria-label="Merkuze chat preview">
            <div className="lp-chat-header">
              <div className="lp-chat-avatar">ም</div>
              <div>
                <p className="lp-chat-name">Merkuze Bot</p>
                <p className="lp-chat-status">Online • 24/7 supporter</p>
              </div>
            </div>

            <div className="lp-chat-body">
              <div className="lp-chat-msg lp-chat-msg-user">
                <p>
                  I&apos;m coming to Tikur Anbessa tomorrow. Do I need to fast
                  before my blood test?
                </p>
              </div>
              <div className="lp-chat-msg lp-chat-msg-bot">
                <p>
                  Welcome. I can help you prepare for your visit. For most
                  fasting blood tests, you should not eat or drink anything
                  except water for 8–12 hours. Your doctor will confirm the
                  exact instructions for your test.
                </p>
              </div>
              <div className="lp-chat-msg lp-chat-msg-bot">
                <p>
                  I can also tell you which department to visit and which
                  documents to bring.
                </p>
              </div>
            </div>

            <div className="lp-chat-input">
              <span className="lp-chat-typing-dot" />
              <span className="lp-chat-typing-dot" />
              <span className="lp-chat-typing-dot" />
              <span className="lp-chat-typing-label">Merkuze is typing…</span>
            </div>
          </aside>
        </section>

        <section id="about" className="lp-section lp-section-alt">
          <div className="lp-section-inner">
            <h2>About Tikur Anbessa (Black Lion) Hospital</h2>
            <p className="lp-section-text">
              Tikur Anbessa Specialized Hospital is Ethiopia&apos;s largest
              public referral and teaching hospital in Addis Ababa. It serves
              hundreds of thousands of patients each year across internal
              medicine, pediatrics, surgery, oncology, emergency care, and more,
              while training the next generation of Ethiopian health
              professionals.
            </p>
            <p className="lp-section-text">
              Merkuze is built specifically around this context — to make it
              easier for patients and families to understand where to go, what
              to expect, and how to prepare.
            </p>
          </div>
        </section>

        <section id="merkuze" className="lp-section">
          <div className="lp-section-inner">
            <h2>Meet Merkuze — ምርኩዜ, your supporter</h2>
            <p className="lp-section-text">
              Merkuze combines hospital-approved information with AI to answer
              questions in a warm, clear way. The ም character in the logo holds
              a small robotic eye, symbolizing a digital helper watching out for
              you as you move through Black Lion.
            </p>
            <div className="lp-grid lp-grid-3" id="capabilities">
              <div className="lp-card">
                <h3>24/7 hospital assistant</h3>
                <p>
                  Ask about services, visiting hours, clinic locations, and how
                  care at Tikur Anbessa works — any time, from anywhere.
                </p>
              </div>
              <div className="lp-card">
                <h3>Appointment companion</h3>
                <p>
                  Get help understanding schedules, what your ticket means, and
                  how to prepare for your next visit.
                </p>
              </div>
              <div className="lp-card">
                <h3>Doctor &amp; department finder</h3>
                <p>
                  Describe your problem in everyday language and Merkuze guides
                  you toward the right specialty or department.
                </p>
              </div>
              <div className="lp-card">
                <h3>Pre‑visit checklist</h3>
                <p>
                  Learn whether you need to fast, which lab tests you have, and
                  which documents or cards to bring to the hospital.
                </p>
              </div>
              <div className="lp-card">
                <h3>FAQ &amp; health education</h3>
                <p>
                  Common questions answered in simple English — and supported by
                  educational content about chronic diseases, cancer, surgery
                  prep, and more.
                </p>
              </div>
              <div className="lp-card">
                <h3>Medication &amp; pharmacist connect</h3>
                <p>
                  Look up how to take your medicine, typical side effects, and
                  when your questions should be escalated to a live pharmacist.
                </p>
              </div>
              <div className="lp-card">
                <h3>Conversation history</h3>
                <p>
                  Your past chats are saved so you can revisit instructions
                  after your visit or continue where you left off.
                </p>
              </div>
              <div className="lp-card">
                <h3>Built for Ethiopia</h3>
                <p>
                  Centered on Ethiopian hospital pathways, local names for
                  services, and the real journey through Black Lion.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="how-it-works" className="lp-section lp-section-alt">
          <div className="lp-section-inner lp-how-grid">
            <div>
              <h2>How the AI chatbot works</h2>
              <p className="lp-section-text">
                Merkuze uses Retrieval‑Augmented Generation (RAG). Hospital
                documents, FAQs, and website content are turned into a knowledge
                base. For every question, Merkuze first retrieves the most
                relevant passages, then generates an answer grounded in that
                context.
              </p>
            </div>
            <ol className="lp-steps">
              <li>
                <strong>Ask in your own words.</strong> Patients type questions
                as they speak — in natural language.
              </li>
              <li>
                <strong>Retrieve.</strong> Merkuze looks up the most relevant
                information from the hospital&apos;s knowledge base.
              </li>
              <li>
                <strong>Respond.</strong> It generates a clear, safe answer
                using that context, with follow‑up suggestions.
              </li>
              <li>
                <strong>Learn.</strong> Admins can update content and documents
                so the bot always reflects the latest guidance.
              </li>
            </ol>
          </div>
        </section>
      </main>

      <footer className="lp-footer">
        <div className="lp-footer-inner">
          <div>
            <p className="lp-footer-title">Merkuze for Tikur Anbessa</p>
            <p className="lp-footer-text">
              A hospital-aware chatbot designed to support patients, families,
              and staff at Black Lion Hospital.
            </p>
          </div>
          <div className="lp-footer-links">
            <a href="/login">Log in</a>
            <a href="/signup">Create account</a>
          </div>
        </div>
      </footer>

      {isAuthenticated && <MerkuzeChatWidget />}
    </div>
  );
}

export default LandingPage;
