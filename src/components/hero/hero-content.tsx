"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

import { BlackHoleHeroSection } from "@/components/black-hole-hero-section";

export function HeroContent() {
  const root = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // rise everything in on load
        const tl = gsap.timeline({
          defaults: { ease: "power3.out" },
          delay: 0.15,
        });
        tl.from(".wordmark", {
          y: 28,
          autoAlpha: 0,
          filter: "blur(12px)",
          duration: 1.0,
        })
          .from(".hero-tag", { y: 12, autoAlpha: 0, duration: 0.6 }, "-=0.45")
          .from(".hero-line", { y: 16, autoAlpha: 0, duration: 0.7 }, "-=0.35")
          .from(".hero-brief", { y: 14, autoAlpha: 0, duration: 0.7 }, "-=0.5");
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <div
      ref={root}
      className="relative z-20 flex flex-1 flex-col items-center justify-center px-6 pb-28 pt-24 text-center lg:px-10"
    >
      <h1 className="sr-only">VOID CTF</h1>

      <div className="wordmark" aria-hidden="true">
        <span className="wordmark__letter">V</span>
        <div className="wordmark__o">
          <BlackHoleHeroSection
            className="wordmark__hole"
            focus={[0.5, 0.5]}
            fov={28}
            elevation={-3}
            roll={-18}
            distance={24}
            diskInner={3}
            diskOuter={15}
            brightness={1.05}
            spinSpeed={0.05}
            doppler={0.25}
            hotColor="#FFF6E6"
            midColor="#F9B637"
            coolColor="#E73F1E"
            glow={1.1}
            exposure={1}
            vignette={0.22}
            steps={260}
            resolution={0.7}
            maxDpr={1.5}
          />
        </div>
        <span className="wordmark__letter">I</span>
        <span className="wordmark__letter">D</span>
        <span className="hero-tag">CTF</span>
      </div>

      <p className="hero-line mt-9">
        Attack. Defend. <b>Survive.</b>
      </p>

      <p className="hero-brief mt-5">
        An adversarial security operation inside an isolated industrial
        facility. The network is fortified. The systems are isolated.
      </p>
    </div>
  );
}
