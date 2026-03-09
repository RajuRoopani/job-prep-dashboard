"use client";

import { useState } from "react";
import Image from "next/image";

const GRADIENTS = [
  "from-violet-500 to-indigo-600",
  "from-indigo-500 to-blue-600",
  "from-blue-500 to-cyan-600",
  "from-emerald-500 to-teal-600",
  "from-orange-500 to-amber-600",
  "from-pink-500 to-rose-600",
  "from-purple-500 to-fuchsia-600",
  "from-cyan-500 to-sky-600",
  "from-rose-500 to-pink-600",
  "from-teal-500 to-emerald-600",
];

function pickGradient(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return GRADIENTS[Math.abs(hash) % GRADIENTS.length];
}

function Initials({ name, size, className }: { name: string; size: number; className?: string }) {
  const initials = name
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const gradient = pickGradient(name);
  return (
    <div
      className={`bg-gradient-to-br ${gradient} flex items-center justify-center flex-shrink-0 ${className ?? ""}`}
      style={{ width: size, height: size }}
    >
      <span
        className="text-white font-bold select-none"
        style={{ fontSize: Math.max(10, Math.round(size * 0.35)) }}
      >
        {initials}
      </span>
    </div>
  );
}

interface CompanyLogoProps {
  name: string;
  logoUrl?: string | null;
  size?: number;
  className?: string;
  imgClassName?: string;
}

export function CompanyLogo({
  name,
  logoUrl,
  size = 40,
  className,
  imgClassName,
}: CompanyLogoProps) {
  const [failed, setFailed] = useState(false);

  if (!logoUrl || failed) {
    return <Initials name={name} size={size} className={className} />;
  }

  return (
    <Image
      src={logoUrl}
      alt={name}
      width={size}
      height={size}
      className={imgClassName ?? "object-contain"}
      onError={() => setFailed(true)}
      unoptimized
    />
  );
}
