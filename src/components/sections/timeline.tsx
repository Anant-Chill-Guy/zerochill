"use client";

import { useRef, type CSSProperties } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

// Portrait art is shared by both stages: it is the same card at the same
// shape, so the two mobile cards come out one size and neither reads as a
// narrower strip than the other.
const PORTRAIT = { src: "/media/stage-card-tall.webp", w: 1200, h: 1853 };

// Each stage carries its own pair, in the dimensions of the file: the art owns
// its frame and its own ratio, so the card takes the box straight from the
// image and never crops.
const ART = {
  qualifier: {
    wide: { src: "/media/stage-card-wide-qualifier.webp", w: 1082, h: 633 },
    tall: PORTRAIT,
  },
  finals: {
    wide: { src: "/media/stage-card-wide.webp", w: 1500, h: 1086 },
    tall: PORTRAIT,
  },
};

const STAGES = [
  {
    n: "01",
    title: "Qualifiers",
    desc: "Compete in a 24-hour jeopardy-style CTF. The top 15 teams move on to the finals.",
    meta: "Online · 24 h",
    art: ART.qualifier,
  },
  {
    n: "02",
    title: "Finals",
    desc: "Attack and attempt to infiltrate the physical network set up by the organising team.",
    meta: "Offline · 24 h",
    art: ART.finals,
  },
];

export function Timeline() {
  const root = useRef<HTMLElement | null>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".tl-head > *", {
          autoAlpha: 0,
          y: 20,
          duration: 0.7,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: { trigger: ".tl-head", start: "top 80%" },
        });
        gsap.from(".tl-card", {
          autoAlpha: 0,
          y: 26,
          duration: 0.75,
          stagger: 0.12,
          ease: "power3.out",
          // drop the inline transform once it lands, otherwise it outranks the
          // hover lift in the stylesheet
          clearProps: "transform",
          scrollTrigger: { trigger: ".tl-stages", start: "top 84%" },
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section id="timeline" ref={root} className="tl-section">
      <div className="tl-inner">
        <div className="tl-head">
          <h2 className="tl-title">How it works</h2>
          <p className="tl-intro">
            The qualifier runs online. The finals run on the physical network
            built by the organising team.
          </p>
        </div>

        <ol className="tl-stages">
          {STAGES.map((s) => (
            <li
              key={s.n}
              className="tl-card"
              // the portrait art's ratio, so the mobile card can be sized
              // against a height budget instead of a shared width
              style={{ "--tl-ratio": s.art.tall.w / s.art.tall.h } as CSSProperties}
            >
              <div className="tl-card__art">
                {/* Both orientations are in the DOM; the inactive one is
                    display:none, which keeps its lazy load from ever firing. */}
                <Image
                  className="tl-card__img tl-card__img--wide"
                  src={s.art.wide.src}
                  width={s.art.wide.w}
                  height={s.art.wide.h}
                  alt=""
                  loading="lazy"
                  sizes="(max-width: 999px) 0px, (min-width: 1520px) 652px, 45vw"
                />
                <Image
                  className="tl-card__img tl-card__img--tall"
                  src={s.art.tall.src}
                  width={s.art.tall.w}
                  height={s.art.tall.h}
                  alt=""
                  loading="lazy"
                  // the card fills the column on a phone; the height budget
                  // may pull it in on a short or very tall viewport
                  sizes="(max-width: 999px) 92vw, 0px"
                />
              </div>

              <div className="tl-card__panel">
                <div className="tl-card__row">
                  <h3 className="tl-card__title">{s.title}</h3>
                  <p className="tl-card__meta">
                    <span className="tl-card__idx">{s.n}</span>
                    <span>{s.meta}</span>
                  </p>
                </div>
                <p className="tl-card__desc">{s.desc}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
