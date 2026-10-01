"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

/**
 * The ink pairing a frame supports. The plate rotates through three families —
 * sunlit aerials that need brown type on a pale halo, night shots that need
 * bone on near-black, and the overhead satellite plates, which are busy mid-
 * toned brown throughout and take the bone with a brown halo so the type sits
 * in the frame's own colour instead of a cold dark one.
 */
export type HeroTone = "sand" | "night" | "overhead";

// full-bleed hero backdrop: the industrial aerials crossfade one into the next,
// the outgoing frame fading out as the incoming frame fades in. The tone rides
// with the frame, so the lockup never has to guess what is behind it.
const SLIDES: ReadonlyArray<{ src: string; tone: HeroTone }> = [
  { src: "/media/hero-slide-1.jpg", tone: "overhead" },
  { src: "/media/hero-slide-2.jpg", tone: "overhead" },
  { src: "/media/hero-slide-3.jpg", tone: "sand" },
  { src: "/media/hero-slide-4.jpg", tone: "night" },
  { src: "/media/hero-slide-5.jpg", tone: "night" },
  { src: "/media/hero-slide-6.jpg", tone: "night" },
  { src: "/media/hero-slide-7.jpg", tone: "sand" },
];

const HOLD_MS = 5000;
const FADE_MS = 1400;

export function HeroSlides({
  onToneChange,
}: {
  /** the ink pairing the lockup should wear for the frame now on screen */
  onToneChange?: (tone: HeroTone) => void;
}) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (SLIDES.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(
      () => setIndex((i) => (i + 1) % SLIDES.length),
      HOLD_MS,
    );
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    onToneChange?.(SLIDES[index].tone);
  }, [index, onToneChange]);

  return (
    <div
      className="absolute inset-0"
      style={{ backgroundColor: "var(--color-iron-950)" }}
    >
      {SLIDES.map(({ src }, i) => (
        <Image
          key={src}
          src={src}
          alt=""
          fill
          priority={i === 0}
          sizes="100vw"
          className="object-cover transition-opacity ease-in-out motion-reduce:transition-none"
          style={{ opacity: i === index ? 1 : 0, transitionDuration: `${FADE_MS}ms` }}
        />
      ))}
    </div>
  );
}
