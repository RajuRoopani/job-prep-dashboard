"use client";

import { useState } from "react";

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

interface CompanyLogoProps {
  name: string;
  logoUrl?: string | null;
  size?: number;
  className?: string;
  imgClassName?: string;
}

/**
 * Renders a company logo with a gradient-initials fallback.
 * Initials are always rendered as the base layer. If a logo URL is
 * provided and loads successfully, the image overlays on top.
 * No broken-image icons ever appear.
 */
export function CompanyLogo({
  name,
  logoUrl,
  size = 40,
  className,
  imgClassName,
}: CompanyLogoProps) {
  const [imgFailed, setImgFailed] = useState(false);

  const initials = name
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const gradient = pickGradient(name);
  const fontSize = Math.max(10, Math.round(size * 0.35));
  const showImage = !!logoUrl && !imgFailed;

  return (
    <div
      className={`relative overflow-hidden flex-shrink-0 ${className ?? ""}`}
      style={{ width: size, height: size }}
    >
      {/* Gradient initials — always rendered as base */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${gradient} flex items-center justify-center`}
      >
        <span
          className="text-white font-bold select-none leading-none"
          style={{ fontSize }}
        >
          {initials}
        </span>
      </div>

      {/* Image overlay — rendered on top when URL is available */}
      {showImage && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={logoUrl}
          alt={name}
          className={`absolute inset-0 w-full h-full bg-white ${imgClassName ?? "object-contain p-1"}`}
          onError={() => setImgFailed(true)}
        />
      )}
    </div>
  );
}
