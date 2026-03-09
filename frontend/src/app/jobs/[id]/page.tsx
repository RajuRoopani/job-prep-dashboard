import { notFound } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import { getJob } from "@/lib/api";
import { LevelBadge } from "@/components/jobs/LevelBadge";
import { RemotePill } from "@/components/jobs/RemotePill";
import { PrepAccordion } from "@/components/prep/PrepAccordion";
import { CompanyLogo } from "@/components/ui/CompanyLogo";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function JobDetailPage({ params }: Props) {
  const { id } = await params;
  const jobId = Number(id);
  if (isNaN(jobId)) return notFound();

  let job;
  try {
    job = await getJob(jobId);
  } catch {
    return notFound();
  }

  return (
    <>
      {/* Hero strip */}
      <div className="relative overflow-hidden bg-[var(--bg)] pt-10 pb-14">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_40%_at_20%_-10%,rgba(99,102,241,0.15),transparent)] pointer-events-none" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="mb-6 text-xs flex items-center gap-2 text-[var(--text-3)]">
            <Link href="/" className="hover:text-[var(--text-2)] transition-colors">Jobs</Link>
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
            <Link href={`/companies/${job.company_slug}`} className="hover:text-[var(--text-2)] transition-colors">
              {job.company_name}
            </Link>
          </nav>

          <div className="flex items-start gap-5">
            <div className="w-16 h-16 rounded-2xl bg-[var(--elevated)] border border-[var(--border)] overflow-hidden flex-shrink-0">
              <CompanyLogo
                name={job.company_name}
                logoUrl={job.company_logo_url}
                size={64}
                imgClassName="object-contain p-2"
                className="rounded-2xl"
              />
            </div>
            <div className="flex-1">
              <p className="text-[var(--text-3)] text-xs mb-1 font-mono uppercase tracking-wide">{job.company_name}</p>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-1)] tracking-tight mb-3">{job.title}</h1>
              <div className="flex flex-wrap items-center gap-2">
                <LevelBadge level={job.level} />
                <RemotePill remote={job.remote} />
                {job.location && (
                  <span className="badge border border-[var(--border)] text-[var(--text-2)] bg-[var(--elevated)]">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                    {job.location}
                  </span>
                )}
                {job.department && (
                  <span className="badge border border-[var(--border)] text-[var(--text-2)] bg-[var(--elevated)]">{job.department}</span>
                )}
              </div>
            </div>
            <a
              href={job.url}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex btn-primary items-center gap-2 px-5 py-2.5"
            >
              Apply Now
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-5 pb-16 space-y-5">
        {/* Mobile apply */}
        <a
          href={job.url}
          target="_blank"
          rel="noopener noreferrer"
          className="sm:hidden w-full btn-primary justify-center py-3"
        >
          Apply Now →
        </a>

        {/* AI Prep */}
        <Suspense fallback={<div className="card p-8 text-center text-[var(--text-3)] text-sm">Loading prep panel…</div>}>
          <PrepAccordion jobId={jobId} />
        </Suspense>

        {/* Job Description */}
        {job.description && (
          <div className="card p-6">
            <h2 className="text-[10px] font-bold text-[var(--text-3)] uppercase tracking-widest mb-4 flex items-center gap-2 font-mono">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Job Description
            </h2>
            <div
              className="job-description text-sm text-[var(--text-2)] leading-relaxed"
              dangerouslySetInnerHTML={{ __html: job.description }}
            />
          </div>
        )}
      </div>
    </>
  );
}
