import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-[var(--border)] mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-[var(--accent)] to-[#8B5CF6] flex items-center justify-center">
              <svg width="12" height="12" viewBox="0 0 18 18" fill="none">
                <path d="M9 3L13.5 12H4.5L9 3Z" fill="white" fillOpacity="0.9"/>
                <path d="M9 8V14" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            <span className="text-xs text-[var(--text-3)]">Ascend · Career Intelligence powered by Claude Opus</span>
          </div>

          <div className="flex items-center gap-5">
            <Link href="/" className="text-xs text-[var(--text-3)] hover:text-[var(--text-2)] transition-colors">Jobs</Link>
            <Link href="/companies" className="text-xs text-[var(--text-3)] hover:text-[var(--text-2)] transition-colors">Companies</Link>
            <Link href="/match" className="text-xs text-[var(--text-3)] hover:text-[var(--text-2)] transition-colors">Career Match</Link>
            <a href="/api/docs" target="_blank" rel="noopener noreferrer" className="text-xs text-[var(--text-3)] hover:text-[var(--text-2)] transition-colors">API</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
