"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

import { content } from "@/content/site";

import statementImage from "@/assets/bg-layer-2.jpg";

gsap.registerPlugin(useGSAP, ScrollTrigger);

// the briefing runs four beats after the circle opens, so the hold is long
// enough that each beat still lands at roughly one word per scroll notch
const HOLD_VH = 340;

// beat on the timeline where the circle starts opening; the plate pan rides it
const OPEN_AT = 0.32;

// object-position X of the plant plate across the hold. The "CTF challenge"
// board sits on the left of the frame and the plant on the right, so the
// reveal travels left → right while the message lands.
const PAN_FROM = 15;
const PAN_TO = 55;

// overlay briefing, revealed in beats once the plant window is open:
// lede, the domain ledger, the finals warning, the close
const LEDE = [
  "Void CTF encompasses a two-part cybersecurity event.",
  "The online qualifier round will have a host of challenges in the domains of",
];
// the qualifier sentence runs on into the ledger, so its last row closes the
// comma list the lede opens, and the aria sentence can be reassembled verbatim
const DOMAINS = [
  "Web Exploitation",
  "Cryptography",
  "Reverse Engineering",
  "Binary Exploitation",
  "Forensics",
];
const ARSENAL = DOMAINS.map((act, i) => ({
  tag: String(i + 1).padStart(2, "0"),
  act,
}));
const ENEMY = {
  before:
    "The top 15 scoring teams in this round will advance to the in-person finale event, where all 15 teams will compete in a",
  redacted: "winner-take-all",
  after: "race to sabotage an actual physical network.",
};
const WELCOME =
  "Teams will have to work their way through the network to achieve the final objective by exploiting a myriad of different vulnerabilities — ranging from AD exploits to SCADA/ICS hacking.";
const HIGHLIGHT = new Set(["void", "ctf", "vulnerabilities", "scadaics"]);
const bareWord = (w: string) => w.replace(/[^a-z]/gi, "").toLowerCase();

// the full briefing as prose for assistive tech; the visual version is split
const MESSAGE = [
  LEDE[0],
  `${LEDE[1]} ${DOMAINS.join(", ")}.`,
  `${ENEMY.before} ${ENEMY.redacted} ${ENEMY.after}`,
  WELCOME,
].join(" ");

const splitWords = (text: string) =>
  text.split(" ").map((w, i) => (
    <span key={i} className="stmt__word">
      <span
        className={`stmt__word-in${
          HIGHLIGHT.has(bareWord(w)) ? " stmt__word-in--hot" : ""
        }`}
      >
        {w}
      </span>
    </span>
  ));

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
      const veil = q(".stmt__veil")[0] as HTMLElement;
      const message = q(".stmt__message")[0] as HTMLElement;
      const bar = q(".stmt__message-bar")[0] as HTMLElement;
      const media = q(".stmt__circle-media")[0] as HTMLElement;
      const words = q(".stmt__word-in") as HTMLElement[];
      const ledeWords = q(".stmt__lede .stmt__word-in") as HTMLElement[];
      const arms = q(".stmt__arm") as HTMLElement[];
      const enemy = q(".stmt__enemy")[0] as HTMLElement;
      const redact = q(".stmt__redact-bar")[0] as HTMLElement;
      const welcomeWords = q(".stmt__welcome .stmt__word-in") as HTMLElement[];

      if (!stage || !slot || !window_ || !media || lines.length === 0) return;

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
        gsap.set([veil, window_, message], { autoAlpha: 1 });
        gsap.set(words, { autoAlpha: 1, scale: 1 });
        gsap.set(bar, { autoAlpha: 1, scaleX: 1 });
        gsap.set([...arms, enemy], { autoAlpha: 1 });
        gsap.set(redact, { scaleX: 0 });
        lines.forEach((l) => l.classList.add("is-lit"));
        return;
      }

      park();
      gsap.set(inners, { yPercent: 112 });
      gsap.set([veil, window_, message], { autoAlpha: 0 });
      // words shrunk to a point; they pop out one after another on scroll
      gsap.set(words, { autoAlpha: 0, scale: 0.4 });
      gsap.set(bar, { autoAlpha: 0, scaleX: 0.6 });
      gsap.set(arms, { autoAlpha: 0, x: -18 });
      gsap.set(enemy, { autoAlpha: 0, y: 10 });
      gsap.set(redact, { scaleX: 1 });

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
        OPEN_AT,
      );

      tl.to(veil, { autoAlpha: 1, duration: 0.18 }, 0.44);
      // clear the statement lines so the plant reads clean under the bubble
      tl.to(inners, { autoAlpha: 0, duration: 0.1 }, 0.5);

      // kinetic type: accent rule pops in, then the lede pops out word by
      // word like bubbles, one after another as you keep scrolling
      tl.to(message, { autoAlpha: 1, duration: 0.05 }, 0.56);
      tl.to(
        bar,
        {
          autoAlpha: 1,
          scaleX: 1,
          transformOrigin: "left center",
          ease: "back.out(2)",
          duration: 0.1,
        },
        0.58,
      );
      tl.to(
        ledeWords,
        {
          scale: 1,
          autoAlpha: 1,
          ease: "back.out(2.4)",
          duration: 0.14,
          stagger: 0.035,
        },
        0.62,
      );

      // the arsenal checks in one category at a time
      tl.to(
        arms,
        { autoAlpha: 1, x: 0, ease: "power3.out", duration: 0.14, stagger: 0.06 },
        1.12,
      );

      // the warning settles, then its redaction tape peels off the secret
      tl.to(enemy, { autoAlpha: 1, y: 0, ease: "power2.out", duration: 0.12 }, 1.56);
      tl.to(
        redact,
        { scaleX: 0, transformOrigin: "right center", ease: "power3.inOut", duration: 0.14 },
        1.68,
      );

      // sign-off lands last and hardest
      tl.to(
        welcomeWords,
        {
          scale: 1,
          autoAlpha: 1,
          ease: "back.out(3)",
          duration: 0.16,
          stagger: 0.05,
        },
        1.84,
      );

      // The plate travels left → right from the beat the circle opens, so the
      // frame is still moving while the message lands. object-position (not a
      // transform) keeps the pan inside the cover crop, so no edge is exposed.
      const pan = { v: 0 };
      tl.to(
        pan,
        {
          v: 1,
          duration: tl.duration() - OPEN_AT,
          onUpdate: () => {
            media.style.objectPosition = `${
              PAN_FROM + (PAN_TO - PAN_FROM) * pan.v
            }% 50%`;
          },
        },
        OPEN_AT,
      );
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
    <section id="about" ref={root} className="seq" aria-labelledby="stmt-heading">
      <div className="seq__stage">
        <div className="seq__inner flex flex-col justify-center">
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

        <div className="stmt__message">
          <p className="sr-only">{MESSAGE}</p>
          <div aria-hidden="true">
            <span className="stmt__message-bar" />
            <p className="stmt__lede">
              {LEDE.map((line, i) => (
                <span key={i} className="stmt__lede-line">
                  {splitWords(line)}
                </span>
              ))}
            </p>

            <ul className="stmt__arsenal">
              {ARSENAL.map(({ tag, act }) => (
                <li key={tag} className="stmt__arm">
                  <span className="stmt__arm-tag">{tag}</span>
                  <span className="stmt__arm-act">{act}</span>
                </li>
              ))}
            </ul>

            <p className="stmt__enemy">
              {ENEMY.before}{" "}
              <span className="stmt__redact">
                {ENEMY.redacted}
                <span className="stmt__redact-bar" />
              </span>{" "}
              {ENEMY.after}
            </p>

            <p className="stmt__welcome">{splitWords(WELCOME)}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
