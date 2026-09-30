"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

// full-bleed hero backdrop: the industrial aerials crossfade one into the next,
// the outgoing frame fading out as the incoming frame fades in.
const SLIDES = [
  "/media/hero-slide-1.jpg",
  "/media/hero-slide-2.jpg",
  "/media/hero-slide-3.jpg",
  "/media/hero-slide-4.jpg",
  "/media/hero-slide-5.jpg",
  "/media/hero-slide-6.jpg",
  "/media/hero-slide-7.jpg",
];

const HOLD_MS = 5000;
const FADE_MS = 1400;

export function HeroSlides() {
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

  return (
    <div
      className="absolute inset-0"
      style={{ backgroundColor: "var(--color-iron-950)" }}
    >
      {SLIDES.map((src, i) => (
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
