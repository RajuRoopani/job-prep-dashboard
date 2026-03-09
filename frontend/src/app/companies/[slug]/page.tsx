import { notFound } from "next/navigation";
import Link from "next/link";
import { getCompany } from "@/lib/api";
import { CompanyLogo } from "@/components/ui/CompanyLogo";
import { LevelBadge } from "@/components/jobs/LevelBadge";
import { RemotePill } from "@/components/jobs/RemotePill";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function CompanyPage({ params }: Props) {
  const { slug } = await params;
  let company;
  try {
    company = await getCompany(slug);
  } catch {
    return notFound();
  }

  return (
    <>
      {/* Hero */}
      <div className="relative overflow-hidden bg-[var(--bg)] pt-10 pb-16">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_30%_-10%,rgba(139,92,246,0.15),transparent)] pointer-events-none" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="mb-6 text-xs flex items-center gap-2 text-[var(--text-3)]">
            <Link href="/companies" className="hover:text-[var(--text-2)] transition-colors">Companies</Link>
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-[var(--text-2)]">{company.name}</span>
          </nav>

          <div className="flex items-start gap-5">
            <div className="w-16 h-16 rounded-2xl bg-[var(--elevated)] border border-[var(--border)] overflow-hidden flex-shrink-0">
              <CompanyLogo
                name={company.name}
                logoUrl={company.logo_url}
                size={64}
                imgClassName="object-contain p-2"
                className="rounded-2xl"
              />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-extrabold text-[var(--text-1)] tracking-tight">{company.name}</h1>
                <span className={`badge border ${
                  company.tier === "faang_plus"
                    ? "text-[var(--amber)] bg-[var(--amber)]/10 border-[var(--amber)]/20"
                    : "text-[#C084FC] bg-[#8B5CF6]/10 border-[#8B5CF6]/20"
                }`}>
                  {company.tier === "faang_plus" ? "FAANG+" : "AI Startup"}
                </span>
              </div>
              <div className="flex items-center gap-3 text-[var(--text-3)] text-xs font-mono">
                <span>📍 {company.hq}</span>
                <span>·</span>
                <span>👥 {company.size}</span>
                <span>·</span>
                <span className={company.open_roles > 0 ? "text-[var(--green)] font-semibold" : ""}>
                  {company.open_roles} open {company.open_roles === 1 ? "role" : "roles"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-5 pb-16 space-y-5">
        {/* About */}
        <div className="card p-6">
          <h2 className="text-[10px] font-bold text-[var(--text-3)] uppercase tracking-widest mb-3 font-mono">About</h2>
          <p className="text-[var(--text-2)] leading-relaxed text-sm">{company.about}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {company.loop_desc && (
            <div className="card p-6">
              <h2 className="text-[10px] font-bold text-[var(--text-3)] uppercase tracking-widest mb-3 flex items-center gap-2 font-mono">
                <span>🔄</span> Interview Loop
              </h2>
              <p className="text-sm text-[var(--text-2)] leading-relaxed">{company.loop_desc}</p>
            </div>
          )}

          {company.comp_range && (
            <div className="card p-6">
              <h2 className="text-[10px] font-bold text-[var(--text-3)] uppercase tracking-widest mb-3 flex items-center gap-2 font-mono">
                <span>💰</span> Total Compensation
              </h2>
              <div className="space-y-2">
                {company.comp_range.split("|").map((range, i) => (
                  <div key={i} className="flex items-center gap-2 p-2.5 rounded-xl bg-[var(--elevated)]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-light)] flex-shrink-0" />
                    <p className="text-sm text-[var(--text-2)] font-mono">{range.trim()}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Open roles */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-[10px] font-bold text-[var(--text-3)] uppercase tracking-widest flex items-center gap-2 font-mono">
              <span>💼</span> Open SWE Roles ({company.open_roles})
            </h2>
            {company.open_roles > 0 && (
              <Link href={`/?company=${company.id}`} className="text-xs text-[var(--accent-light)] hover:text-[var(--text-1)] font-medium transition-colors">
                View all →
              </Link>
            )}
          </div>

          {company.jobs.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-[var(--text-3)] text-sm">No open SWE roles right now</p>
              <p className="text-[var(--text-3)] text-xs mt-1 font-mono">Jobs refresh every 6 hours</p>
            </div>
          ) : (
            <div className="space-y-1.5">
              {company.jobs.map((job) => (
                <div key={job.id} className="flex items-center gap-3 p-3.5 rounded-xl hover:bg-[var(--elevated)] transition-colors group">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <LevelBadge level={job.level} />
                    <span className="text-sm font-medium text-[var(--text-1)] truncate group-hover:text-[var(--accent-light)] transition-colors">
                      {job.title}
                    </span>
                    <RemotePill remote={job.remote} />
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Link href={`/jobs/${job.id}`} className="btn-primary text-xs py-1.5 px-3">
                      Prep ✨
                    </Link>
                    <a href={job.url} target="_blank" rel="noopener noreferrer" className="btn-ghost text-xs py-1.5 px-3">
                      Apply
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
