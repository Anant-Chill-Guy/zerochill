"use client";

import { useRef, type CSSProperties } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

import { content } from "@/content/site";
import { DuneField } from "@/components/sponsor/dune-field";

const { sponsor } = content;

// one group per category, in the order categories first appear
const groups = sponsor.partners.reduce<
  { category: string; partners: (typeof sponsor.partners)[number][] }[]
>((acc, p) => {
  const group = acc.find((g) => g.category === p.category);
  if (group) group.partners.push(p);
  else acc.push({ category: p.category, partners: [p] });
  return acc;
}, []);

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
          .from(".sp-intro", { autoAlpha: 0, y: 14, duration: 0.6 }, "-=0.3")
          .from(
            ".sp-item",
            { autoAlpha: 0, y: 18, duration: 0.6, stagger: 0.08, clearProps: "transform" },
            "-=0.35",
          );
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

          <div className="sp-list" role="list" aria-label="Our sponsors">
            {groups.map((g) => (
              <section
                key={g.category}
                className="sp-group"
                role="listitem"
                style={{ "--sp-count": g.partners.length } as CSSProperties}
              >
                <h2 className="sp-cat">
                  {g.category}
                  {g.partners.length > 1 ? "s" : ""}
                </h2>
                <ul className="sp-group__logos">
                  {g.partners.map((p) => (
                    <li key={p.name} className="sp-item">
                      <a
                        className="sp-logo"
                        href={p.href}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <span className="sp-logo__box">
                          <Image
                            className="sp-logo__img"
                            src={p.logo.src}
                            width={p.logo.w}
                            height={p.logo.h}
                            alt={p.name}
                            unoptimized
                          />
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </div>
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
