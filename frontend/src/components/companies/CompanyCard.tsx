import Link from "next/link";
import type { Company } from "@/lib/types";
import { CompanyLogo } from "@/components/ui/CompanyLogo";

export function CompanyCard({ company }: { company: Company }) {
  return (
    <Link
      href={`/companies/${company.slug}`}
      className="card p-4 hover:border-[var(--accent)]/40 transition-all group block"
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-lg bg-[var(--elevated)] border border-[var(--border)] overflow-hidden flex-shrink-0">
          <CompanyLogo
            name={company.name}
            logoUrl={company.logo_url}
            size={40}
            imgClassName="object-contain p-1"
            className="rounded-lg"
          />
        </div>
        <div>
          <p className="font-semibold text-[var(--text-1)] text-sm group-hover:text-[var(--accent-light)] transition-colors">
            {company.name}
          </p>
          <p className="text-xs text-[var(--text-3)] font-mono">{company.hq}</p>
        </div>
      </div>
      <p className="text-xs text-[var(--text-3)] line-clamp-2 mb-3">{company.about}</p>
      <div className="flex items-center justify-between">
        <span className={`badge border ${
          company.tier === "faang_plus"
            ? "text-[var(--amber)] bg-[var(--amber)]/10 border-[var(--amber)]/20"
            : "text-[#C084FC] bg-[#8B5CF6]/10 border-[#8B5CF6]/20"
        }`}>
          {company.tier === "faang_plus" ? "FAANG+" : "AI Startup"}
        </span>
        <span className="text-xs text-[var(--text-3)] font-mono">
          {company.open_roles} open {company.open_roles === 1 ? "role" : "roles"}
        </span>
      </div>
    </Link>
  );
}
