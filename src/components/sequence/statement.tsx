"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

import { content } from "@/content/site";

import statementImage from "@/assets/bg-layer-2.jpg";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const HOLD_VH = 260;

// layout offset survives transforms unlike a bounding rect
function offsetWithin(el: HTMLElement, ancestor: HTMLElement) {
  let x = 0;
  let y = 0;
  let node: HTMLElement | null = el;
  while (node && node !== ancestor) {
    x += node.offsetLeft;
    y += node.offsetTop;
    node = node.offsetParent as HTMLElement | null;
  }
  return { x, y };
}

export function Statement() {
  const root = useRef<HTMLElement | null>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const stage = q(".seq__stage")[0] as HTMLElement;
      const lines = q(".stmt__line") as HTMLElement[];
      const inners = q(".stmt__line-inner") as HTMLElement[];
      const slot = q(".stmt__slot")[0] as HTMLElement;
      const window_ = q(".stmt__circle")[0] as HTMLElement;
      const caption = q(".stmt__caption")[0] as HTMLElement;
      const veil = q(".stmt__veil")[0] as HTMLElement;

      if (!stage || !slot || !window_ || lines.length === 0) return;

      // static fallback for reduced motion
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      const metrics = () => {
        const w = stage.clientWidth;
        const h = stage.clientHeight;
        const { x, y } = offsetWithin(slot, stage);
        const size = slot.offsetWidth || 1;
        return {
          r0: size / 2,
          x0: x + size / 2,
          y0: y + size / 2,
          r1: Math.hypot(w, h) / 2,
          x1: w / 2,
          y1: h / 2,
        };
      };

      const clip = (r: number, x: number, y: number) =>
        `circle(${r.toFixed(2)}px at ${x.toFixed(2)}px ${y.toFixed(2)}px)`;

      const park = () => {
        const m = metrics();
        window_.style.clipPath = clip(m.r0, m.x0, m.y0);
      };

      if (reduce) {
        park();
        gsap.set(inners, { yPercent: 0, autoAlpha: 1 });
        gsap.set([caption, veil, window_], { autoAlpha: 1 });
        lines.forEach((l) => l.classList.add("is-lit"));
        return;
      }

      park();
      gsap.set(inners, { yPercent: 112 });
      gsap.set([caption, veil, window_], { autoAlpha: 0 });

      const thresholds = lines.map((_, i) => 0.04 + i * 0.085);

      const open = { v: 0 };

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: stage,
          start: "top top",
          end: `+=${HOLD_VH}%`,
          pin: stage,
          pinSpacing: true,
          scrub: 0.6,
          invalidateOnRefresh: true,
          onRefresh: park,
          onUpdate: (self) => {
            const p = self.progress;
            lines.forEach((line, i) => {
              line.classList.toggle("is-lit", p >= thresholds[i]);
            });
          },
        },
      });

      // lines rise then the window fades in on the same beat
      tl.to(inners, { yPercent: 0, duration: 0.1, stagger: 0.07 }, 0);
      tl.to(window_, { autoAlpha: 1, duration: 0.12 }, 0.12);

      tl.to(
        open,
        {
          v: 1,
          duration: 0.34,
          ease: "power2.inOut",
          onUpdate: () => {
            const m = metrics();
            const t = open.v;
            window_.style.clipPath = clip(
              m.r0 + (m.r1 - m.r0) * t,
              m.x0 + (m.x1 - m.x0) * t,
              m.y0 + (m.y1 - m.y0) * t,
            );
          },
        },
        0.32,
      );

      tl.to(veil, { autoAlpha: 1, duration: 0.18 }, 0.44);
      tl.to(caption, { autoAlpha: 1, duration: 0.06 }, 0.62);
      tl.to(inners, { autoAlpha: 0, duration: 0.08 }, 0.64);

      tl.to({}, { duration: 0.26 }, 0.68);
    },
    { scope: root },
  );

  // split on the author mark so copy stays editable without a code change
  const renderLine = (line: string, i: number) => {
    const parts = line.split("[o]");
    const isMedia = parts.length > 1;
    return (
      <span
        key={i}
        className={`stmt__line${isMedia ? " stmt__line--media" : ""}${
          i === 0 ? " stmt__line--accent" : ""
        }`}
      >
        <span className="stmt__line-inner">
          {parts[0]}
          {isMedia && <span className="stmt__slot" aria-hidden="true" />}
          {parts[1]}
        </span>
      </span>
    );
  };

  return (
    <section ref={root} className="seq" aria-labelledby="stmt-heading">
      <div className="seq__stage">
        <div className="seq__inner flex flex-col justify-center">
          <span className="seq__eyebrow">{content.statement.eyebrow}</span>
          <h2 id="stmt-heading" className="stmt__lines mt-6">
            {content.statement.lines.map(renderLine)}
          </h2>
        </div>

        <div className="stmt__circle">
          <div className="stmt__circle-void" aria-hidden="true" />
          <Image
            className="stmt__circle-media"
            src={statementImage}
            alt={content.statement.circleAlt}
            fill
            sizes="100vw"
            placeholder="blur"
          />
        </div>

        <div className="stmt__veil" aria-hidden="true" />

        <span className="stmt__caption">{content.statement.circleCaption}</span>
      </div>
    </section>
  );
}
