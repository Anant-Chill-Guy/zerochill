"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

import { content } from "@/content/site";

import ingressImage from "@/assets/bg-layer-2.png";

gsap.registerPlugin(useGSAP, ScrollTrigger);

// tiles are [x y w h] in the svg viewbox and clipped out of one image
const MOSAIC_TILES: ReadonlyArray<readonly [number, number, number, number]> = [
  [200, 0, 108, 80],
  [124, 92, 76, 112],
  [212, 92, 108, 112],
  [332, 114, 93, 68],
  [437, 92, 115, 112],
  [0, 216, 112, 112],
  [124, 228, 52, 100],
  [188, 216, 108, 112],
  [308, 216, 110, 112],
  [430, 216, 115, 112],
  [124, 340, 112, 113],
  [248, 340, 52, 48],
  [312, 346, 44, 40],
  [366, 340, 40, 48],
  [248, 396, 52, 57],
  [308, 396, 50, 57],
  [366, 396, 40, 57],
  [418, 363, 82, 75],
  [512, 348, 77, 100],
  [248, 461, 158, 42],
];

export function Ingress({ opened }: { opened: boolean }) {
  const root = useRef<HTMLElement | null>(null);

  // runs once on the tear
  useGSAP(
    () => {
      if (!opened) return;

      const q = gsap.utils.selector(root);
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (reduce) {
        gsap.set([q(".ingress__media"), q(".ingress__copy > *"), q(".ingress__readout")], {
          autoAlpha: 1,
          yPercent: 0,
          scale: 1,
        });
        return;
      }

      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .fromTo(
          q(".ingress__media"),
          { scale: 1.14, autoAlpha: 0 },
          { scale: 1, autoAlpha: 1, duration: 1.6 },
          0,
        )
        .fromTo(
          q(".ingress__copy > *"),
          { yPercent: 130, autoAlpha: 0 },
          { yPercent: 0, autoAlpha: 1, duration: 1, stagger: 0.09 },
          0.15,
        )
        .fromTo(
          q(".ingress__readout"),
          { autoAlpha: 0, y: 18 },
          { autoAlpha: 1, y: 0, duration: 0.7 },
          0.6,
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
        .to(q(".ingress__media"), { yPercent: 12 }, 0)
        .to(q(".ingress__copy"), { yPercent: -16 }, 0)
        .to(q(".ingress__readout"), { autoAlpha: 0 }, 0);
    },
    { scope: root },
  );

  return (
    <section ref={root} className="seq" aria-labelledby="ingress-headline">
      <div className="seq__stage">
        <div className="seq__inner ingress__grid">
          <div className="ingress__copy">
            <span className="seq__eyebrow">{content.ingress.eyebrow}</span>
            <h2 id="ingress-headline" className="ingress__headline">
              {content.ingress.headline}
            </h2>
            <p className="ingress__sub">{content.ingress.sub}</p>
          </div>

          <div className="ingress__media">
            <svg
              className="ingress__mosaic"
              viewBox="0 0 590 505"
              role="img"
              aria-label={content.ingress.mosaicAlt}
            >
              <defs>
                <clipPath id="ingress-mosaic-clip">
                  {MOSAIC_TILES.map(([x, y, w, h], i) => (
                    <rect key={i} x={x} y={y} width={w} height={h} />
                  ))}
                </clipPath>
              </defs>
              <image
                href={ingressImage.src}
                x="0"
                y="0"
                width="590"
                height="505"
                preserveAspectRatio="xMidYMid slice"
                clipPath="url(#ingress-mosaic-clip)"
              />
            </svg>
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
