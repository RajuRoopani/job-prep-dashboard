"use client";

import { useState, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { analyzeResume } from "@/lib/api";
import type { ResumeProfile, JobMatch } from "@/lib/types";
import { LevelBadge } from "@/components/jobs/LevelBadge";
import { RemotePill } from "@/components/jobs/RemotePill";

const RESUME_STORAGE_KEY = "ascend_resume_text";
const PROFILE_STORAGE_KEY = "ascend_resume_profile";

function ScoreRing({ score }: { score: number }) {
  const color = score >= 85 ? "var(--green)" : score >= 65 ? "var(--accent-light)" : "var(--amber)";
  const r = 20;
  const circ = 2 * Math.PI * r;
  const progress = (score / 100) * circ;
  return (
    <div className="relative w-14 h-14 flex items-center justify-center flex-shrink-0">
      <svg className="absolute inset-0 -rotate-90" width="56" height="56">
        <circle cx="28" cy="28" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="4" />
        <circle
          cx="28" cy="28" r={r} fill="none"
          stroke={color} strokeWidth="4"
          strokeDasharray={`${progress} ${circ}`}
          strokeLinecap="round"
          style={{ transition: "stroke-dasharray 0.8s ease" }}
        />
      </svg>
      <span className="text-sm font-bold" style={{ color, fontFamily: "var(--font-mono)" }}>{score}</span>
    </div>
  );
}

function ProfileCard({ profile }: { profile: ResumeProfile }) {
  return (
    <div className="card p-6 space-y-5">
      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[var(--accent)] to-[#8B5CF6] flex items-center justify-center flex-shrink-0 shadow-[0_0_20px_rgba(99,102,241,0.3)]">
          <span className="text-xl font-bold text-white">{(profile.name || "A")[0].toUpperCase()}</span>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-[var(--text-1)] text-base">{profile.name}</h3>
          <p className="text-[var(--text-2)] text-sm mt-0.5">{profile.current_role}</p>
          <div className="flex items-center gap-2 mt-2">
            <LevelBadge level={profile.level} />
            <span className="text-[11px] text-[var(--text-3)]" style={{ fontFamily: "var(--font-mono)" }}>
              {profile.years_experience} yrs exp
            </span>
          </div>
        </div>
      </div>

      {/* Headline */}
      {profile.headline && (
        <p className="text-sm text-[var(--text-2)] leading-relaxed border-l-2 border-[var(--accent)]/40 pl-3 italic">
          {profile.headline}
        </p>
      )}

      {/* Skills */}
      {profile.skills.length > 0 && (
        <div>
          <p className="text-[10px] font-bold text-[var(--text-3)] uppercase tracking-widest mb-2" style={{ fontFamily: "var(--font-mono)" }}>Top Skills</p>
          <div className="flex flex-wrap gap-1.5">
            {profile.skills.slice(0, 12).map((s) => (
              <span key={s} className="text-[11px] px-2 py-0.5 rounded-md bg-[var(--accent)]/10 text-[var(--accent-light)] border border-[var(--accent)]/20" style={{ fontFamily: "var(--font-mono)" }}>
                {s}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Strengths */}
      {profile.strengths.length > 0 && (
        <div>
          <p className="text-[10px] font-bold text-[var(--text-3)] uppercase tracking-widest mb-2" style={{ fontFamily: "var(--font-mono)" }}>Strengths</p>
          <ul className="space-y-1">
            {profile.strengths.map((s) => (
              <li key={s} className="flex items-start gap-2 text-sm text-[var(--text-2)]">
                <span className="text-[var(--green)] mt-0.5 flex-shrink-0">✓</span>
                {s}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Education + companies */}
      {(profile.education || profile.previous_companies.length > 0) && (
        <div className="pt-4 border-t border-[var(--border)] space-y-2">
          {profile.education && (
            <p className="text-xs text-[var(--text-3)]">🎓 {profile.education}</p>
          )}
          {profile.previous_companies.length > 0 && (
            <p className="text-xs text-[var(--text-3)]">
              🏢 {profile.previous_companies.slice(0, 4).join(", ")}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

function MatchCard({ match }: { match: JobMatch }) {
  return (
    <div className="card p-5 flex gap-4 group">
      <ScoreRing score={match.match_score} />

      <div className="flex-1 min-w-0">
        {/* Header */}
        <div className="flex items-start gap-2 mb-2">
          <div className="w-8 h-8 rounded-lg bg-[var(--elevated)] border border-[var(--border)] flex items-center justify-center overflow-hidden flex-shrink-0">
            {match.company_logo_url ? (
              <Image src={match.company_logo_url} alt={match.company_name} width={32} height={32} className="object-contain p-0.5" />
            ) : (
              <span className="text-xs font-bold text-[var(--text-3)]">{match.company_name[0]}</span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[11px] text-[var(--text-3)] font-semibold" style={{ fontFamily: "var(--font-mono)" }}>{match.company_name}</p>
            <h4 className="text-sm font-semibold text-[var(--text-1)] truncate group-hover:text-[var(--accent-light)] transition-colors">
              {match.title}
            </h4>
          </div>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          <LevelBadge level={match.level} />
          <RemotePill remote={match.remote} />
          {match.company_tier === "faang_plus" && (
            <span className="badge border text-[var(--amber)] bg-[var(--amber)]/10 border-[var(--amber)]/20">FAANG+</span>
          )}
        </div>

        {/* Match reasons */}
        {match.match_reasons.length > 0 && (
          <ul className="space-y-0.5 mb-2">
            {match.match_reasons.slice(0, 2).map((r) => (
              <li key={r} className="flex items-start gap-1.5 text-[11px] text-[var(--text-2)]">
                <span className="text-[var(--green)] mt-0.5 flex-shrink-0">✓</span>
                {r}
              </li>
            ))}
          </ul>
        )}

        {/* Skill gaps */}
        {match.skill_gaps.length > 0 && (
          <ul className="space-y-0.5 mb-3">
            {match.skill_gaps.slice(0, 1).map((g) => (
              <li key={g} className="flex items-start gap-1.5 text-[11px] text-[var(--amber)]/80">
                <span className="mt-0.5 flex-shrink-0">△</span>
                {g}
              </li>
            ))}
          </ul>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-3 border-t border-[var(--border)]">
          <Link
            href={`/jobs/${match.job_id}?personalized=1`}
            className="btn-primary text-xs py-1.5 px-3 flex-1 justify-center"
          >
            ✦ Personalized Prep
          </Link>
          <a href={match.url} target="_blank" rel="noopener noreferrer" className="btn-ghost text-xs py-1.5 px-3">
            Apply
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}

const SAMPLE_RESUME = `John Smith
Senior Software Engineer | john@example.com | github.com/jsmith

EXPERIENCE
Senior Software Engineer — Stripe (2021–Present)
• Built distributed payment processing systems handling $50B+ annual volume
• Led team of 5 engineers, mentored 2 junior engineers
• Designed and shipped real-time fraud detection ML pipeline (reduced fraud 40%)
• Stack: Go, Kubernetes, PostgreSQL, Redis, Apache Kafka

Software Engineer — Lyft (2019–2021)
• Built microservices for rider/driver matching algorithm (Python, gRPC)
• Reduced P99 latency by 60% through caching layer redesign

Software Engineer Intern — Google (Summer 2018)
• Contributed to Google Search infrastructure (C++, distributed systems)

EDUCATION
BS Computer Science — UC Berkeley (2019) | GPA 3.8

SKILLS
Go, Python, TypeScript, Kubernetes, PostgreSQL, Redis, Kafka, gRPC,
Distributed Systems, System Design, ML Infrastructure, React`;

export default function MatchPage() {
  const [resumeText, setResumeText] = useState("");
  const [stage, setStage] = useState<"upload" | "analyzing" | "results">("upload");
  const [profile, setProfile] = useState<ResumeProfile | null>(null);
  const [matches, setMatches] = useState<JobMatch[]>([]);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const analyze = useCallback(async (text: string) => {
    setStage("analyzing");
    setError(null);
    try {
      const result = await analyzeResume(text);
      setProfile(result.profile);
      setMatches(result.matches);
      // Persist for personalized prep
      if (typeof window !== "undefined") {
        localStorage.setItem(RESUME_STORAGE_KEY, text);
        localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(result.profile));
      }
      setStage("results");
    } catch (e) {
      setError(String(e));
      setStage("upload");
    }
  }, []);

  const handleFile = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      setResumeText(text);
    };
    reader.readAsText(file);
  }, []);

  const scoreColor = (score: number) =>
    score >= 85 ? "text-[var(--green)]" : score >= 65 ? "text-[var(--accent-light)]" : "text-[var(--amber)]";

  return (
    <>
      {/* Hero */}
      <div className="relative overflow-hidden bg-[var(--bg)] pt-14 pb-20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-30%,rgba(99,102,241,0.25),transparent)] pointer-events-none" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--accent)]/30 bg-[var(--accent)]/5 text-[11px] font-semibold text-[var(--accent-light)] mb-6" style={{ fontFamily: "var(--font-mono)" }}>
            ✦ Career Intelligence · Powered by Claude Opus
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-[1.1] mb-5">
            <span className="gradient-text">Your AI Career Advisor.</span>
            <br />
            <span className="text-[var(--text-1)]">Personalized to your resume.</span>
          </h1>
          <p className="text-[var(--text-2)] text-lg leading-relaxed max-w-2xl mx-auto">
            Paste your resume and Ascend AI will analyze your background, match you with the best-fit roles at top AI companies and FAANG+, and generate a deeply personalized prep plan to land top-of-band.
          </p>
        </div>
      </div>

      {/* Main */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 pb-20">

        {/* Upload stage */}
        {stage === "upload" && (
          <div className="max-w-2xl mx-auto">
            <div className="card p-8 space-y-6">
              <div>
                <label className="block text-sm font-semibold text-[var(--text-1)] mb-1">
                  Paste your resume
                </label>
                <p className="text-xs text-[var(--text-3)] mb-3">Plain text, markdown, or copy-paste from PDF. Your resume stays private — never stored on our servers.</p>
                <textarea
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  placeholder="Paste your full resume here — work experience, skills, education..."
                  className="input resize-none h-64 leading-relaxed text-[13px]"
                  style={{ fontFamily: "var(--font-mono)" }}
                />
              </div>

              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-[var(--border)]" />
                <span className="text-[11px] text-[var(--text-3)]">or</span>
                <div className="flex-1 h-px bg-[var(--border)]" />
              </div>

              {/* File upload */}
              <button
                onClick={() => fileRef.current?.click()}
                className="w-full flex items-center justify-center gap-3 py-4 rounded-xl border-2 border-dashed border-[var(--border)] hover:border-[var(--accent)]/40 hover:bg-[var(--accent)]/5 transition-all text-[var(--text-2)] hover:text-[var(--text-1)] group"
              >
                <svg className="w-5 h-5 text-[var(--text-3)] group-hover:text-[var(--accent-light)] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className="text-sm">Upload resume file (.txt, .md, .pdf)</span>
                <input
                  ref={fileRef}
                  type="file"
                  accept=".txt,.md,.pdf"
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                />
              </button>

              {error && (
                <div className="p-4 rounded-xl bg-[var(--rose)]/10 border border-[var(--rose)]/20">
                  <p className="text-sm text-[var(--rose)]">{error}</p>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => analyze(resumeText)}
                  disabled={resumeText.trim().length < 100}
                  className="btn-primary flex-1 py-3 text-sm disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  Analyze with Ascend AI
                </button>
                <button
                  onClick={() => { setResumeText(SAMPLE_RESUME); }}
                  className="btn-ghost py-3 text-sm px-4"
                >
                  Try sample resume
                </button>
              </div>
            </div>

            {/* How it works */}
            <div className="grid grid-cols-3 gap-4 mt-6">
              {[
                { step: "01", title: "Parse", desc: "AI extracts your skills, level, and experience profile" },
                { step: "02", title: "Match", desc: "Score every role at FAANG+ and AI startups against your profile" },
                { step: "03", title: "Prep", desc: "Get a personalized end-to-end interview prep plan per role" },
              ].map(({ step, title, desc }) => (
                <div key={step} className="card-static p-4 text-center">
                  <div className="text-[10px] font-bold text-[var(--accent-light)] mb-2" style={{ fontFamily: "var(--font-mono)" }}>{step}</div>
                  <p className="text-sm font-bold text-[var(--text-1)] mb-1">{title}</p>
                  <p className="text-[11px] text-[var(--text-3)] leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Analyzing */}
        {stage === "analyzing" && (
          <div className="flex flex-col items-center justify-center py-28 gap-6">
            <div className="relative">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[var(--accent)] to-[#8B5CF6] flex items-center justify-center shadow-[0_0_40px_rgba(99,102,241,0.4)]">
                <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              </div>
            </div>
            <div className="text-center max-w-sm">
              <h2 className="text-xl font-bold text-[var(--text-1)] mb-2">Ascend AI is analyzing your resume</h2>
              <p className="text-sm text-[var(--text-2)]">Parsing your background, matching against 400+ active roles, and computing your personalized fit scores…</p>
              <p className="text-xs text-[var(--text-3)] mt-2" style={{ fontFamily: "var(--font-mono)" }}>~15–30 seconds</p>
            </div>
          </div>
        )}

        {/* Results */}
        {stage === "results" && profile && (
          <div className="space-y-8">
            {/* Top bar */}
            <div className="card-static px-5 py-4 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-sm font-bold text-[var(--text-1)]">
                  Found <span className="text-[var(--accent-light)]">{matches.length}</span> matched roles for {profile.name}
                </h2>
                <p className="text-xs text-[var(--text-3)] mt-0.5">Sorted by match score · Click "Personalized Prep" on any role to get a tailored interview plan</p>
              </div>
              <button
                onClick={() => { setStage("upload"); setResumeText(""); setProfile(null); setMatches([]); }}
                className="btn-ghost text-xs py-1.5 px-3 flex-shrink-0"
              >
                ↑ Upload new resume
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6 items-start">
              {/* Profile sidebar */}
              <div className="lg:sticky lg:top-[calc(3.5rem+1.5rem)]">
                <p className="text-[10px] font-bold text-[var(--text-3)] uppercase tracking-widest mb-3" style={{ fontFamily: "var(--font-mono)" }}>Your Profile</p>
                <ProfileCard profile={profile} />

                {/* Score legend */}
                <div className="card-static p-4 mt-4 space-y-2">
                  <p className="text-[10px] font-bold text-[var(--text-3)] uppercase tracking-widest" style={{ fontFamily: "var(--font-mono)" }}>Score Guide</p>
                  {[
                    { range: "85–100", label: "Excellent fit", color: "var(--green)" },
                    { range: "65–84", label: "Strong match", color: "var(--accent-light)" },
                    { range: "40–64", label: "Growth opportunity", color: "var(--amber)" },
                  ].map((g) => (
                    <div key={g.range} className="flex items-center gap-2">
                      <span className="text-xs font-bold" style={{ color: g.color, fontFamily: "var(--font-mono)", width: "3rem" }}>{g.range}</span>
                      <span className="text-xs text-[var(--text-3)]">{g.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Matches grid */}
              <div className="space-y-3">
                <p className="text-[10px] font-bold text-[var(--text-3)] uppercase tracking-widest" style={{ fontFamily: "var(--font-mono)" }}>
                  Top {matches.length} Matches
                </p>
                {matches.map((m) => (
                  <MatchCard key={m.job_id} match={m} />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
