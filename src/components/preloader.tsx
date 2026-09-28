"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

import { content } from "@/content/site";

gsap.registerPlugin(useGSAP);

export function Preloader({
  onOpen,
  onDone,
}: {
  onOpen: () => void;
  onDone: () => void;
}) {
  const root = useRef<HTMLDivElement | null>(null);
  const [gone, setGone] = useState(false);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const up = q(".pre__half--up")[0];
      const down = q(".pre__half--down")[0];
      const print = q(".pre__print");
      const chars = q(".pre__ch");
      const status = q(".pre__status")[0];

      const finish = () => {
        onDone();
        setGone(true);
      };

      // both clipped copies of a letter share data-i so they move as one
      const perColumn = (_: number, el: Element) =>
        Number((el as HTMLElement).dataset.i) * 0.075;

      // reduced motion gets the seal the hold and a plain dissolve
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.set(print, { yPercent: 0 });
        gsap.set(chars, { yPercent: 0, scale: 1, autoAlpha: 1 });
        gsap.to(root.current, {
          autoAlpha: 0,
          duration: 0.45,
          delay: content.preloader.holdMs / 1000,
          onStart: onOpen,
          onComplete: finish,
        });
        return;
      }

      const tl = gsap.timeline({ onComplete: finish });

      // letters bubble up into the mark then overshoot as they land
      tl.fromTo(
        chars,
        { yPercent: 220, scale: 0.62, autoAlpha: 0 },
        {
          yPercent: 0,
          scale: 1,
          autoAlpha: 1,
          duration: 0.95,
          ease: "back.out(1.7)",
          stagger: perColumn,
        },
      )
        .fromTo(
          status,
          { autoAlpha: 0 },
          { autoAlpha: 1, duration: 0.5 },
          "-=0.35",
        )
        .to({}, { duration: content.preloader.holdMs / 1000 })
        .to(status, { autoAlpha: 0, duration: 0.28 }, "<");

      // the two halves start a few frames apart so the seam gives way along its length
      tl.addLabel("tear")
        .add(onOpen)
        .to(up, { yPercent: -101, duration: 1.15, ease: "power4.inOut" }, "tear")
        .to(
          down,
          { yPercent: 101, duration: 1.15, ease: "power4.inOut" },
          "tear+=0.07",
        );
    },
    { scope: root },
  );

  if (gone) return null;

  return (
    <div
      ref={root}
      className="pre"
      role="status"
      aria-live="polite"
      aria-label={content.preloader.a11y}
    >
      <div className="pre__half pre__half--up" aria-hidden="true">
        <Mark />
      </div>
      <div className="pre__half pre__half--down" aria-hidden="true">
        <Mark />
      </div>
      <span className="pre__status">{content.preloader.status}</span>
    </div>
  );
}

function Mark() {
  const { first, second } = content.wordmark;

  const letters = (word: string, base: number) =>
    [...word].map((ch, i) => (
      <span key={base + i} className="pre__ch" data-i={base + i}>
        {ch}
      </span>
    ));

  return (
    <span className="pre__print">
      <span className="pre__word">{letters(first, 0)}</span>
      <span className="pre__word pre__print-second">
        {letters(second, first.length)}
      </span>
    </span>
  );
}
