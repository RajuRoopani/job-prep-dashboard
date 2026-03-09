"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { href: "/", label: "Jobs" },
  { href: "/companies", label: "Companies" },
  { href: "/research", label: "Research" },
  { href: "/match", label: "Career Match", highlight: true },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--bg)]/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Logo — Ascend */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[var(--accent)] to-[#8B5CF6] flex items-center justify-center shadow-[0_0_16px_rgba(99,102,241,0.4)] group-hover:shadow-[0_0_24px_rgba(99,102,241,0.6)] transition-all">
              {/* Ascend "A" with upward arrow */}
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M9 3L13.5 12H4.5L9 3Z" fill="white" fillOpacity="0.9"/>
                <path d="M9 3L13.5 12H4.5L9 3Z" stroke="white" strokeWidth="0.5" strokeLinejoin="round"/>
                <path d="M9 8V14" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-bold text-[var(--text-1)] tracking-tight text-sm">Ascend</span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[var(--accent)]/15 text-[var(--accent-light)] tracking-wide">AI</span>
            </div>
          </Link>

          {/* Nav */}
          <nav className="flex items-center gap-1">
            {NAV_LINKS.map(({ href, label, highlight }) => {
              const active = pathname === href;
              if (highlight) {
                return (
                  <Link
                    key={href}
                    href={href}
                    className={`ml-1 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all border ${
                      active
                        ? "bg-[var(--accent)] text-white border-[var(--accent)] shadow-[0_0_12px_rgba(99,102,241,0.4)]"
                        : "text-[var(--accent-light)] border-[var(--accent)]/30 hover:border-[var(--accent)]/60 hover:bg-[var(--accent)]/10"
                    }`}
                  >
                    ✦ {label}
                  </Link>
                );
              }
              return (
                <Link
                  key={href}
                  href={href}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    active
                      ? "text-[var(--text-1)] bg-[var(--elevated)]"
                      : "text-[var(--text-2)] hover:text-[var(--text-1)] hover:bg-[var(--elevated)]"
                  }`}
                >
                  {label}
                </Link>
              );
            })}

            <div className="flex items-center gap-1.5 ml-2 px-3 py-1.5 rounded-lg border border-[var(--border)]">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--green)] live-dot" />
              <span className="text-[11px] font-semibold text-[var(--text-3)]">Live</span>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
