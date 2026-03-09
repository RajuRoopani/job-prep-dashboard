"use client";

import { useState, useEffect, useMemo } from "react";
import { getCompanies } from "@/lib/api";
import type { Company, CompaniesResponse } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";

function CompanyCard({ company }: { company: Company }) {
  return (
    <Link
      href={`/companies/${company.slug}`}
      className="card p-5 flex flex-col gap-3.5 group"
    >
      <div className="flex items-start gap-3">
        <div className="w-11 h-11 rounded-xl bg-[var(--elevated)] border border-[var(--border)] flex items-center justify-center overflow-hidden flex-shrink-0">
          {company.logo_url ? (
            <Image src={company.logo_url} alt={company.name} width={44} height={44} className="object-contain p-1" />
          ) : (
            <span className="text-base font-bold text-[var(--text-3)]">{company.name[0]}</span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <p className="font-semibold text-[var(--text-1)] text-sm group-hover:text-[var(--accent-light)] transition-colors truncate">
              {company.name}
            </p>
          </div>
          <p className="text-[11px] text-[var(--text-3)] truncate font-mono">{company.hq}</p>
        </div>
        <span className={`badge border flex-shrink-0 ${
          company.tier === "faang_plus"
            ? "text-[var(--amber)] bg-[var(--amber)]/10 border-[var(--amber)]/20"
            : "text-[#C084FC] bg-[#8B5CF6]/10 border-[#8B5CF6]/20"
        }`}>
          {company.tier === "faang_plus" ? "FAANG+" : "AI"}
        </span>
      </div>

      <p className="text-[12px] text-[var(--text-3)] leading-relaxed line-clamp-2">{company.about}</p>

      <div className="flex items-center justify-between pt-2 border-t border-[var(--border)]">
        <span className="text-[11px] text-[var(--text-3)] font-mono">{company.size} employees</span>
        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md font-mono ${
          company.open_roles > 0
            ? "bg-[var(--green)]/10 text-[var(--green)]"
            : "bg-[var(--elevated)] text-[var(--text-3)]"
        }`}>
          {company.open_roles > 0 ? `${company.open_roles} open` : "No roles"}
        </span>
      </div>
    </Link>
  );
}

function TierGrid({ title, icon, companies }: { title: string; icon: string; companies: Company[] }) {
  if (companies.length === 0) return null;
  const openRoles = companies.reduce((s, c) => s + c.open_roles, 0);
  return (
    <section>
      <div className="flex items-center gap-3 mb-5">
        <span className="text-xl">{icon}</span>
        <div>
          <h2 className="text-base font-bold text-[var(--text-1)]">{title}</h2>
          <p className="text-xs text-[var(--text-3)] font-mono">{companies.length} companies · {openRoles} open roles</p>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {companies.map((c) => <CompanyCard key={c.id} company={c} />)}
      </div>
    </section>
  );
}

function SkeletonCard() {
  return (
    <div className="card p-5 space-y-3.5">
      <div className="flex gap-3">
        <div className="w-11 h-11 rounded-xl skeleton flex-shrink-0" />
        <div className="flex-1 space-y-2 pt-1">
          <div className="h-4 skeleton rounded-full w-3/4" />
          <div className="h-3 skeleton rounded-full w-1/2" />
        </div>
      </div>
      <div className="h-3 skeleton rounded-full" />
      <div className="h-3 skeleton rounded-full w-5/6" />
    </div>
  );
}

export default function CompaniesPage() {
  const [data, setData] = useState<CompaniesResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    getCompanies()
      .then(setData)
      .catch((e) => setError(String(e)))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    if (!data) return null;
    const q = search.toLowerCase();
    if (!q) return data;
    const match = (c: Company) =>
      c.name.toLowerCase().includes(q) ||
      c.hq.toLowerCase().includes(q) ||
      c.about.toLowerCase().includes(q);
    return { faang_plus: data.faang_plus.filter(match), ai_startup: data.ai_startup.filter(match) };
  }, [data, search]);

  const totalCompanies = (filtered?.faang_plus.length ?? 0) + (filtered?.ai_startup.length ?? 0);
  const totalRoles = [...(filtered?.faang_plus ?? []), ...(filtered?.ai_startup ?? [])].reduce((s, c) => s + c.open_roles, 0);

  return (
    <>
      {/* Hero */}
      <div className="relative overflow-hidden bg-[var(--bg)] pt-14 pb-20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(139,92,246,0.2),transparent)] pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--border)] bg-[var(--surface)] text-[11px] font-medium text-[var(--text-2)] mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--green)]" />
              31 companies tracked
            </div>
            <h1 className="text-4xl font-extrabold text-[var(--text-1)] tracking-tight mb-3">
              Company Directory
            </h1>
            <p className="text-[var(--text-2)] text-lg">
              FAANG++, big tech, and leading AI startups. Interview loops, TC ranges, and live job counts.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-5 pb-16">
        {/* Search + stats bar */}
        <div className="card-static px-5 py-4 mb-8 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="relative flex-1 w-full sm:max-w-xs">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--text-3)] pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search companies..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input pl-9"
            />
          </div>
          {!loading && data && (
            <p className="text-sm text-[var(--text-2)] font-mono">
              <span className="font-bold text-[var(--text-1)]">{totalCompanies}</span>
              <span className="text-[var(--text-3)]"> companies · </span>
              <span className="font-bold text-[var(--text-1)]">{totalRoles}</span>
              <span className="text-[var(--text-3)]"> open SWE roles</span>
            </p>
          )}
        </div>

        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        )}

        {error && (
          <div className="card p-8 text-center">
            <p className="text-[var(--rose)] font-medium mb-1">Failed to load companies</p>
            <p className="text-[var(--text-3)] text-sm">{error}</p>
          </div>
        )}

        {filtered && (
          <div className="space-y-12">
            <TierGrid title="FAANG++ & Big Tech" icon="🏆" companies={filtered.faang_plus} />
            <TierGrid title="Leading AI Startups" icon="🚀" companies={filtered.ai_startup} />
            {totalCompanies === 0 && (
              <div className="card py-16 text-center">
                <p className="text-[var(--text-3)]">No companies match "{search}"</p>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
