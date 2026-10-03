"use client";

import { useRef, type CSSProperties } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

import { content } from "@/content/site";
import { DuneField } from "@/components/sponsor/dune-field";

gsap.registerPlugin(ScrollTrigger);

const { sponsor } = content;

export function SponsorPage() {
  const root = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // the one orchestrated moment: the title rises out of its mask, the
        // spectrum draws in under it, then the intro settles
        gsap
          .timeline({ defaults: { ease: "power3.out" } })
          .from(".sp-title__inner", { yPercent: 105, duration: 1 })
          .from(
            ".sp-hero .spectrum > span",
            { scaleX: 0, transformOrigin: "left center", duration: 0.5, stagger: 0.08 },
            "-=0.55",
          )
          .from(".sp-intro", { autoAlpha: 0, y: 14, duration: 0.6 }, "-=0.3");

        gsap.from(".sp-item", {
          autoAlpha: 0,
          y: 26,
          duration: 0.75,
          stagger: 0.12,
          ease: "power3.out",
          clearProps: "transform",
          scrollTrigger: { trigger: ".sp-list", start: "top 84%" },
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <div ref={root}>
      <section className="sp-hero">
        <DuneField />
        <div className="sp-hero__inner">
          <h1 className="sp-title">
            <span className="sp-title__inner">{sponsor.title}</span>
          </h1>
          <div className="spectrum sp-hero__spectrum" aria-hidden="true">
            <span />
            <span />
            <span />
            <span />
          </div>
          <p className="sp-intro">{sponsor.intro}</p>
        </div>
      </section>

      <section className="sp-section" aria-label="Our sponsors">
        <ul className="sp-inner sp-list">
          {sponsor.partners.map((p) => (
            <li key={p.name} className="sp-item">
              <h2 className="sp-cat">{p.category}</h2>
              <a
                className="sp-plate"
                style={
                  { "--sp-plate": p.plate, "--sp-brand": p.brand } as CSSProperties
                }
                href={p.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="sp-plate__rule" aria-hidden="true" />
                <span className="sp-plate__logo-box">
                  <Image
                    className="sp-plate__logo"
                    src={p.logo.src}
                    width={p.logo.w}
                    height={p.logo.h}
                    alt={`${p.name} logo`}
                    unoptimized
                  />
                </span>
                <span className="sp-plate__body">
                  <span className="sp-plate__name">{p.name}</span>
                  <span className="sp-plate__tagline">{p.tagline}</span>
                  <span className="sp-plate__blurb">{p.blurb}</span>
                  <span className="sp-plate__link">
                    {p.url}
                    <span aria-hidden="true"> ↗</span>
                  </span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section className="sp-pitch">
        <div className="sp-inner sp-pitch__inner">
          <h2 className="sp-pitch__title">{sponsor.pitch.title}</h2>
          <div>
            <p className="sp-pitch__body">{sponsor.pitch.body}</p>
            <a className="btn btn--primary sp-pitch__cta" href={sponsor.pitch.cta.href}>
              {sponsor.pitch.cta.label}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
