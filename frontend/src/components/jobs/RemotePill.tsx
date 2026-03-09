export function RemotePill({ remote }: { remote: boolean }) {
  if (!remote) return null;
  return (
    <span className="badge border text-[#10B981] bg-[#10B981]/10 border-[#10B981]/20">
      <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
      Remote
    </span>
  );
}
