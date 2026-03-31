"use client";

import { useState, useRef } from "react";
import { researchCompany, getCompanyJobsSafe } from "@/lib/api";
import { MarkdownRenderer } from "@/components/prep/MarkdownRenderer";
import { CompanyChat } from "@/components/research/CompanyChat";
import { ResearchJobListings } from "@/components/research/ResearchJobListings";
import { Group as PanelGroup, Panel, Separator as PanelResizeHandle } from "react-resizable-panels";
import Link from "next/link";
import type { CompanyDetail } from "@/lib/types";

const SUGGESTIONS = [
  "Stripe", "Airbnb", "Uber", "DoorDash", "Snowflake",
  "Databricks", "Figma", "Notion", "Vercel", "Cloudflare",
  "Palantir", "SpaceX", "Netflix", "Spotify", "Shopify",
  "Cloud Kitchens", "Instacart", "Lyft", "Pinterest", "Twilio",
];

export default function ResearchPage() {
  const [query, setQuery] = useState("");
  const [roleHint, setRoleHint] = useState("");
  const [result, setResult] = useState<{ company_key: string; company_name: string; content: string; cached: boolean } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [chatExpanded, setChatExpanded] = useState(false);
  const [jobs, setJobs] = useState<CompanyDetail["jobs"] | null | undefined>(undefined);
  const inputRef = useRef<HTMLInputElement>(null);

  async function search(name: string, hint?: string) {
    const companyName = name.trim();
    if (!companyName) return;
    setLoading(true);
    setError(null);
    setResult(null);
    setJobs(undefined);
    try {
      const data = await researchCompany(companyName, hint ?? roleHint);
      setResult(data);
      // Fire job lookup in background — does not block research display
      getCompanyJobsSafe(data.company_key).then((company) => {
        setJobs(company ? company.jobs : null);
      });
    } catch (e) {
      setError(String(e));
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    search(query);
  }

  return (
    <>
      {/* Hero */}
      <div className="relative overflow-hidden bg-[var(--bg)] pt-14 pb-20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_-20%,rgba(99,102,241,0.2),transparent)] pointer-events-none" />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--border)] bg-[var(--surface)] text-[11px] font-semibold text-[var(--text-2)] mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-light)]" />
            Any company — not just our 31 tracked
          </div>
          <h1 className="text-4xl font-extrabold text-[var(--text-1)] tracking-tight mb-3">
            Company Interview Research
          </h1>
          <p className="text-[var(--text-2)] text-lg font-medium leading-relaxed mb-10">
            Get AI-generated intel on any company's interview loop, tech stack,<br className="hidden sm:block" /> culture, compensation, and insider prep tips.
          </p>

          {/* Search form */}
          <form onSubmit={handleSubmit} className="max-w-xl mx-auto">
            <div className="card-static p-4 space-y-3">
              <div className="relative">
                <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-3)] pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Company name — e.g. Cloud Kitchens, Stripe, Databricks…"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="input pl-10 w-full text-sm"
                  autoFocus
                />
              </div>
              <div className="relative">
                <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-3)] pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <input
                  type="text"
                  placeholder="Role focus (optional) — e.g. Backend Engineer, ML Engineer…"
                  value={roleHint}
                  onChange={(e) => setRoleHint(e.target.value)}
                  className="input pl-10 w-full text-sm"
                />
              </div>
              <button
                type="submit"
                disabled={!query.trim() || loading}
                className="btn-primary w-full py-2.5 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Researching with Claude…
                  </span>
                ) : (
                  "Research Company ✨"
                )}
              </button>
            </div>
          </form>

          {/* Suggestion chips */}
          {!result && !loading && (
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => { setQuery(s); search(s); }}
                  className="text-xs px-3 py-1.5 rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--text-2)] hover:border-[var(--accent-light)] hover:text-[var(--accent-light)] transition-colors font-medium"
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 -mt-5 pb-16">
        {/* Error */}
        {error && (
          <div className="card p-5 border-[var(--rose)]/30 bg-[var(--rose)]/5">
            <p className="text-[var(--rose)] font-medium text-sm">{error}</p>
            <button onClick={() => search(query)} className="mt-2 text-xs text-[var(--text-3)] hover:text-[var(--text-2)] underline">
              Try again
            </button>
          </div>
        )}

        {/* Loading skeleton */}
        {loading && (
          <div className="card p-8 space-y-4">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-full bg-[var(--accent-light)]/20 flex items-center justify-center">
                <svg className="animate-spin w-4 h-4 text-[var(--accent-light)]" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-[var(--text-1)]">Researching {query}…</p>
                <p className="text-xs text-[var(--text-3)]">Gathering interview intel, culture info, TC ranges · ~30-60s</p>
              </div>
            </div>
            {[80, 60, 90, 50, 70, 40].map((w, i) => (
              <div key={i} className={`h-3 skeleton rounded-full`} style={{ width: `${w}%` }} />
            ))}
          </div>
        )}
      </div>

      {/* Result — full-width split panel outside narrow container */}
      {result && !loading && (
        <div className="px-4 sm:px-6 lg:px-8 pb-4" style={{ maxWidth: "calc(100vw - 2rem)", margin: "0 auto" }}>
          {/* Header bar */}
          <div className="card-static px-5 py-3.5 flex items-center justify-between gap-4 mb-4 max-w-3xl mx-auto">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[var(--elevated)] border border-[var(--border)] flex items-center justify-center text-base font-bold text-[var(--text-2)]">
                {result.company_name.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-bold text-[var(--text-1)] text-sm">{result.company_name}</p>
                <p className="text-[11px] text-[var(--text-3)] font-mono">
                  {result.cached ? "Cached result" : "Just generated"} · claude-sonnet-4-6
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => { setResult(null); setQuery(""); }}
                className="btn-ghost text-xs px-3 py-1.5"
              >
                New search
              </button>
              <button
                onClick={() => search(result.company_name)}
                className="btn-ghost text-xs px-3 py-1.5"
                title="Regenerate"
              >
                ↺ Refresh
              </button>
            </div>
          </div>

          {/* Full-screen chat mode */}
          {chatExpanded ? (
            <div style={{ height: "calc(100vh - 220px)", minHeight: 500, borderRadius: 12, overflow: "hidden", border: "1px solid var(--border)" }}>
              <CompanyChat
                companyKey={result.company_key}
                companyName={result.company_name}
                expanded={true}
                onToggleExpand={() => setChatExpanded(false)}
              />
            </div>
          ) : (
            /* Split panel: research left, chat right */
            <PanelGroup
              orientation="horizontal"
              style={{ height: "calc(100vh - 220px)", minHeight: 500, borderRadius: 12, overflow: "hidden", border: "1px solid var(--border)" }}
            >
              <Panel defaultSize={62} minSize={35}>
                <div style={{ height: "100%", overflowY: "auto", background: "var(--surface)" }}>
                  <div className="p-6 sm:p-8">
                    <MarkdownRenderer content={result.content} />
                  </div>
                  {/* Job openings */}
                  {jobs !== undefined && (
                    <ResearchJobListings jobs={jobs} companyName={result.company_name} />
                  )}
                  {/* CTA */}
                  <div className="card-static mx-6 mb-6 px-5 py-4 flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-[var(--text-1)]">Have a resume? Get personalized matches.</p>
                      <p className="text-xs text-[var(--text-3)]">Upload your resume to see which real open roles fit you best.</p>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <Link href="/companies" className="btn-ghost text-xs px-3 py-1.5">Browse</Link>
                      <Link href="/match" className="btn-primary text-xs px-3 py-1.5">Match ✨</Link>
                    </div>
                  </div>
                </div>
              </Panel>

              <PanelResizeHandle
                style={{
                  width: 5,
                  background: "var(--border)",
                  cursor: "col-resize",
                  transition: "background 0.15s",
                  flexShrink: 0,
                }}
              />

              <Panel defaultSize={38} minSize={28}>
                <CompanyChat
                  companyKey={result.company_key}
                  companyName={result.company_name}
                  expanded={false}
                  onToggleExpand={() => setChatExpanded(true)}
                />
              </Panel>
            </PanelGroup>
          )}
        </div>
      )}
    </>
  );
}
