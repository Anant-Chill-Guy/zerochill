"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

import { content } from "@/content/site";
import { useTheme } from "@/components/use-theme";
import { BlackHoleHeroSection } from "@/components/black-hole-hero-section";
import AeroShards from "@/components/AeroShards";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export function Ingress({ opened }: { opened: boolean }) {
  const root = useRef<HTMLElement | null>(null);
  const { theme } = useTheme();

  // the WebGL field is coloured from the active palette so it retints with the toggle
  const field =
    theme === "deep"
      ? { background: "#021526", shard: "#03346e", accent: "#6eacda" }
      : { background: "#0b0604", shard: "#b8461c", accent: "#f9b637" };

  // the black-hole disc runs a hotter, more saturated orange in deep mode so it
  // pops against the blue; default mode keeps the component's normal orange
  const hole =
    theme === "deep"
      ? { hot: "#ffe7c2", mid: "#ff6a00", cool: "#b2340a" }
      : { hot: "#fff3de", mid: "#ff9838", cool: "#8e3a0b" };

  // runs once on the tear
  useGSAP(
    () => {
      if (!opened) return;

      const q = gsap.utils.selector(root);
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (reduce) {
        gsap.set(
          [
            q(".ingress__eyebrow"),
            q(".ingress__wm-item"),
            q(".ingress__hero-copy > *"),
            q(".ingress__readout"),
          ],
          { autoAlpha: 1, yPercent: 0, scale: 1 },
        );
        return;
      }

      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .fromTo(
          q(".ingress__eyebrow"),
          { yPercent: 120, autoAlpha: 0 },
          { yPercent: 0, autoAlpha: 1, duration: 0.8 },
          0,
        )
        // the wordmark builds letter by letter, the black-hole O drops in with them
        .fromTo(
          q(".ingress__wm-item"),
          { yPercent: 145, autoAlpha: 0, scale: 0.86 },
          {
            yPercent: 0,
            autoAlpha: 1,
            scale: 1,
            duration: 1.1,
            stagger: 0.09,
            ease: "back.out(1.5)",
          },
          0.12,
        )
        .fromTo(
          q(".ingress__hero-copy > *"),
          { yPercent: 120, autoAlpha: 0 },
          { yPercent: 0, autoAlpha: 1, duration: 0.9, stagger: 0.1 },
          0.55,
        )
        .fromTo(
          q(".ingress__readout"),
          { autoAlpha: 0, y: 18 },
          { autoAlpha: 1, y: 0, duration: 0.7 },
          0.75,
        );
    },
    { scope: root, dependencies: [opened], revertOnUpdate: true },
  );

  // parallax drift built independently of the intro
  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduce) return;

      gsap
        .timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        })
        .to(q(".ingress__wordmark"), { yPercent: -14, scale: 1.04 }, 0)
        .to(q(".ingress__hero-copy"), { yPercent: 22, autoAlpha: 0.4 }, 0)
        .to(q(".ingress__readout"), { autoAlpha: 0 }, 0);
    },
    { scope: root },
  );

  return (
    <section ref={root} className="seq" aria-labelledby="ingress-headline">
      <div className="seq__stage">
        <div className="ingress__bg" aria-hidden="true">
          <AeroShards
            backgroundColor={field.background}
            shardColor={field.shard}
            accentColor={field.accent}
            placement="full"
            flow="stream"
            material="pearl"
            detail="balanced"
            effect="none"
            scale={1}
            spread={1}
            depth={1}
            speed={1}
            spin={1}
            interaction="repel"
            density={1.5}
            shardSize={1.1}
            stretch={1}
            turbulence={1}
            glow={1}
            edgeSoftness={2}
            bloom={0.5}
            grain={0.05}
            chromaticAberration={0.0075}
            transitionDuration={1}
            interactionRadius={1.5}
            interactionStrength={0.5}
            rippleIntensity={1}
            holdToGather
            paused={false}
          />
        </div>

        <div className="seq__inner ingress__hero">
          <span className="seq__eyebrow ingress__eyebrow">
            {content.ingress.eyebrow}
          </span>

          <div className="ingress__wordmark" aria-hidden="true">
            <span className="ingress__wm-letter ingress__wm-item">V</span>
            <span className="ingress__wm-hole ingress__wm-item">
              <BlackHoleHeroSection
                distance={10.5}
                fov={46}
                elevation={-6}
                roll={-6}
                focus={[0.5, 0.5]}
                diskInner={3}
                diskOuter={13}
                diskThickness={0.3}
                doppler={0.32}
                brightness={1.1}
                glow={1}
                vignette={0.12}
                resolution={0.66}
                steps={260}
                maxDpr={1.5}
                hotColor={hole.hot}
                midColor={hole.mid}
                coolColor={hole.cool}
              />
            </span>
            <span className="ingress__wm-letter ingress__wm-item">I</span>
            <span className="ingress__wm-letter ingress__wm-item">D</span>
          </div>

          <div className="ingress__hero-copy">
            <h2 id="ingress-headline" className="ingress__headline">
              {content.ingress.headline}
            </h2>
            <p className="ingress__sub">{content.ingress.sub}</p>
          </div>
        </div>

        <dl className="ingress__readout">
          {content.ingress.readout.map((cell) => (
            <div key={cell.label}>
              <dt className="ingress__cell-label">{cell.label}</dt>
              <dd className="ingress__cell-value">{cell.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
