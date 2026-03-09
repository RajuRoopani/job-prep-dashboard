import Link from "next/link";
import Image from "next/image";
import type { Job } from "@/lib/types";
import { LevelBadge } from "./LevelBadge";
import { RemotePill } from "./RemotePill";
import { timeAgo } from "@/lib/utils";

export function JobCard({ job }: { job: Job }) {
  return (
    <div className="card p-5 flex flex-col gap-4 group">
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-[var(--elevated)] border border-[var(--border)] flex items-center justify-center overflow-hidden flex-shrink-0">
          {job.company_logo_url ? (
            <Image
              src={job.company_logo_url}
              alt={job.company_name}
              width={40}
              height={40}
              className="object-contain p-1"
            />
          ) : (
            <span className="text-sm font-bold text-[var(--text-3)]">{job.company_name[0]}</span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[11px] font-medium text-[var(--text-3)] mb-0.5 font-mono uppercase tracking-wide">{job.company_name}</p>
          <h3 className="font-semibold text-[var(--text-1)] text-sm leading-snug line-clamp-2 group-hover:text-[var(--accent-light)] transition-colors">
            {job.title}
          </h3>
        </div>
      </div>

      {/* Badges */}
      <div className="flex flex-wrap gap-1.5">
        <LevelBadge level={job.level} />
        <RemotePill remote={job.remote} />
        {job.company_tier === "faang_plus" && (
          <span className="badge border text-[var(--amber)] bg-[var(--amber)]/10 border-[var(--amber)]/20">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--amber)]" /> FAANG+
          </span>
        )}
        {job.company_tier === "ai_startup" && (
          <span className="badge border text-[#C084FC] bg-[#8B5CF6]/10 border-[#8B5CF6]/20">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C084FC]" /> AI Startup
          </span>
        )}
      </div>

      {/* Location + time */}
      <div className="flex items-center justify-between text-[11px] text-[var(--text-3)]">
        <span className="flex items-center gap-1 truncate">
          <svg className="w-3 h-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="truncate font-mono">{job.location || "Remote"}</span>
        </span>
        <span className="flex-shrink-0 ml-2 font-mono">{timeAgo(job.fetched_at)}</span>
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-3 border-t border-[var(--border)]">
        <Link href={`/jobs/${job.id}`} className="btn-primary flex-1 text-xs py-2">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          Prep Plan
        </Link>
        <a
          href={job.url}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-ghost text-xs py-2 px-3"
        >
          Apply
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      </div>
    </div>
  );
}
