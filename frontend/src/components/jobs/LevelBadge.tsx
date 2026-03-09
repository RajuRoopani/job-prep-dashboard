const LEVEL_STYLES: Record<string, { label: string; color: string; glow: string }> = {
  "L3": { label: "L3 · Junior",    color: "text-[#10B981] bg-[#10B981]/10 border-[#10B981]/20", glow: "bg-[#10B981]" },
  "L4": { label: "L4 · Mid",       color: "text-[#60A5FA] bg-[#60A5FA]/10 border-[#60A5FA]/20", glow: "bg-[#60A5FA]" },
  "L5": { label: "L5 · Senior",    color: "text-[var(--accent-light)] bg-[var(--accent)]/10 border-[var(--accent)]/20", glow: "bg-[var(--accent-light)]" },
  "L6": { label: "L6 · Staff",     color: "text-[#C084FC] bg-[#8B5CF6]/10 border-[#8B5CF6]/20", glow: "bg-[#C084FC]" },
  "L7+": { label: "L7+ · Principal", color: "text-[#F59E0B] bg-[#F59E0B]/10 border-[#F59E0B]/20", glow: "bg-[#F59E0B]" },
};

export function LevelBadge({ level }: { level: string }) {
  const s = LEVEL_STYLES[level] ?? { label: level, color: "text-[var(--text-2)] bg-[var(--elevated)] border-[var(--border)]", glow: "bg-[var(--text-3)]" };
  return (
    <span className={`badge border ${s.color}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.glow}`} />
      {s.label}
    </span>
  );
}
