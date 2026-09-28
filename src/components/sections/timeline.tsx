"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const STAGES = [
  {
    n: "01",
    title: "Qualifiers",
    desc: "Compete in a 24-hour jeopardy-style CTF. The top 15 teams move on to the finals.",
    meta: "Online · 24 h",
  },
  {
    n: "02",
    title: "Finals",
    desc: "Attack and attempt to infiltrate the physical network set up by the organising team.",
    meta: "Offline · 24 h",
  },
];

const DATES = [
  {
    day: "24",
    mon: "Oct",
    time: "00:00",
    label: "Online CTF begins",
    phase: "Qualifiers",
  },
  {
    day: "24",
    mon: "Oct",
    time: "23:59",
    label: "Online CTF ends",
    phase: "Qualifiers",
  },
  {
    day: "27",
    mon: "Oct",
    time: "09:00",
    label: "Leaderboard finalised",
    phase: "Qualifiers",
  },
  {
    day: "29",
    mon: "Nov",
    time: "10:00",
    label: "Offline CTF begins",
    phase: "Finals",
  },
  {
    day: "30",
    mon: "Nov",
    time: "10:00",
    label: "Offline CTF ends",
    phase: "Finals",
  },
];

export function Timeline() {
  const root = useRef<HTMLElement | null>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // reveal each group on scroll
        gsap.from(".tl-head > *", {
          autoAlpha: 0,
          y: 20,
          duration: 0.7,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: { trigger: ".tl-head", start: "top 80%" },
        });
        gsap.from(".tl-stage", {
          autoAlpha: 0,
          y: 18,
          duration: 0.6,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: { trigger: ".tl-stages", start: "top 84%" },
        });
        gsap.from(".tl-date", {
          autoAlpha: 0,
          y: 12,
          duration: 0.5,
          stagger: 0.06,
          ease: "power3.out",
          scrollTrigger: { trigger: ".tl-dates", start: "top 88%" },
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
            <li key={s.n} className="tl-stage">
              <span className="tl-stage__idx">{s.n}</span>
              <h3 className="tl-stage__title">{s.title}</h3>
              <p className="tl-stage__desc">{s.desc}</p>
              <span className="tl-stage__meta">{s.meta}</span>
            </li>
          ))}
        </ol>

        <h3 className="tl-sub">Timeline</h3>
        <p className="tl-note">All times IST · 2026</p>

        <ol className="tl-dates">
          {DATES.map((d) => (
            <li
              key={`${d.day}-${d.mon}-${d.time}`}
              className="tl-date"
            >
              <span className="tl-date__stamp">
                <span className="tl-date__day">{d.day}</span>
                <span className="tl-date__mon">{d.mon}</span>
              </span>
              <span className="tl-date__time">{d.time}</span>
              <span className="tl-date__label">{d.label}</span>
              <span className="tl-date__phase">{d.phase}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
