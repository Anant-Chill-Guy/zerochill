"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

import { BlackHoleHeroSection } from "@/components/black-hole-hero-section";
import { DesertBackdrop } from "@/components/desert-backdrop";
import { FlowField } from "@/components/hero/flow-field";
import { NAV, STRATA, TEAMS, type Team } from "@/components/hero/ics-strata";
import logo from "@/assets/logo.png";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const BANDS = STRATA.length;
const DESCENT_VH = BANDS * 1.05;

const prefersReduced = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function IcsHero() {
  const root = useRef<HTMLDivElement | null>(null);
  const [team, setTeam] = useState<Team | null>(null);
  const [phase, setPhase] = useState<"gate" | "descent">("gate");

  const pending = useRef<Team | null>(null);
  // kept in refs so they outlive the effect that builds them
  const commitRef = useRef<((t: Team) => void) | null>(null);
  const gateRef = useRef<(() => void) | null>(null);

  useGSAP(
    (_ctx, contextSafe) => {
      const safe = contextSafe!;
      const q = gsap.utils.selector(root);
      const reduce = prefersReduced();

      const tints = q(".ics-tint");
      const bands = q(".ics-band");
      const cards = q(".ics-card") as HTMLElement[];
      const seam = q(".ics-seam")[0];

      const setGatePose = () => {
        gsap.set(bands, { autoAlpha: 0, y: 44 });
        gsap.set(tints, { autoAlpha: 0 });
        gsap.set(cards, { autoAlpha: 0, y: 40 });
        gsap.set(q(".ics-lockup__inner > *"), { autoAlpha: 0, y: 20 });
        gsap.set(q(".ics-hud"), { autoAlpha: 0 });
        gsap.set(q(".ics-rail__fill"), { scaleY: 0.04 });
        gsap.set(q(".ics-strata"), { y: 0 });
      };

      const enterGate = safe(() => {
        setGatePose();

        if (reduce) {
          gsap.set(
            [bands, cards, q(".ics-lockup__inner > *"), q(".ics-rail")],
            { autoAlpha: 1, y: 0 },
          );
          gsap.set(tints, { autoAlpha: 0.42 });
          gsap.set(seam, { scaleY: 1, autoAlpha: 0.8 });
          return;
        }

        gsap
          .timeline({ defaults: { ease: "power3.out" } })
          .to(tints, { autoAlpha: 0.42, duration: 1.1, stagger: 0.08 }, 0.1)
          .to(seam, { scaleY: 1, autoAlpha: 1, duration: 0.9, ease: "power2.inOut" }, 0.2)
          .to(bands, { autoAlpha: 1, y: 0, duration: 1, stagger: 0.07 }, 0.35)
          .to(q(".ics-rail"), { autoAlpha: 1, duration: 0.6 }, 0.8)
          .to(q(".ics-lockup__inner > *"), { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.08 }, 0.7)
          .to(cards, { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.1 }, 0.95);
      });

      gateRef.current = enterGate;

      commitRef.current = safe((next: Team) => {
        const other = next === "red" ? "blue" : "red";
        const winner = q(`.ics-card--${next}`);

        document.body.style.overflow = "";
        window.scrollTo(0, 0);

        if (reduce) {
          gsap.set(tints, { autoAlpha: 0 });
          gsap.set(seam, { autoAlpha: 0 });
          gsap.set(q(".ics-lockup"), { autoAlpha: 0 });
          gsap.set(cards, { autoAlpha: 0 });
          gsap.set(bands, { autoAlpha: 1, y: 0 });
          gsap.set(q(".ics-hud"), { autoAlpha: 1 });
          gsap.set(q(".ics-rail"), { autoAlpha: 1 });
          pending.current = null;
          setTeam(next);
          setPhase("descent");
          return;
        }

        gsap
          .timeline({
            defaults: { ease: "power3.inOut" },
            onComplete: () => {
              pending.current = null;
              setTeam(next);
              setPhase("descent");
            },
          })
          .to(q(`.ics-card--${other}`), { y: 46, autoAlpha: 0, duration: 0.5 })
          .to(winner, { scale: 0.97, duration: 0.4 }, 0)
          .to(seam, { xPercent: next === "red" ? -46 : 46, autoAlpha: 0, duration: 0.7 }, 0.1)
          .to(q(".ics-tint--red"), { autoAlpha: next === "red" ? 0.5 : 0, duration: 0.8 }, 0.15)
          .to(q(".ics-tint--blue"), { autoAlpha: next === "blue" ? 0.5 : 0, duration: 0.8 }, 0.15)
          .to(q(".ics-lockup"), { autoAlpha: 0, y: -26, duration: 0.55 }, 0.25)
          .to(winner, { autoAlpha: 0, duration: 0.35 }, 0.55)
          .to(q(".ics-rail__fill"), { scaleY: 0.04, duration: 0.6 }, 0.4)
          .to(q(".ics-hud"), { autoAlpha: 1, duration: 0.5 }, 0.6);
      });

      // seam leans toward the cursor before a side is chosen
      const onMove = (e: PointerEvent) => {
        if (pending.current) return;
        const nx = e.clientX / window.innerWidth - 0.5;
        gsap.to(seam, {
          xPercent: nx * 14,
          duration: 0.9,
          ease: "power3.out",
          overwrite: "auto",
        });
      };

      const onEnter = (e: Event) => {
        const t = (e.currentTarget as HTMLElement).dataset.team as Team;
        gsap.to(q(`.ics-tint--${t}`), { autoAlpha: 0.75, duration: 0.4, overwrite: "auto" });
        gsap.to(q(`.ics-tint--${t === "red" ? "blue" : "red"}`), {
          autoAlpha: 0.1,
          duration: 0.4,
          overwrite: "auto",
        });
        gsap.to(seam, {
          xPercent: t === "red" ? -7 : 7,
          duration: 0.55,
          ease: "power3.out",
          overwrite: "auto",
        });
      };

      const onLeave = (e: Event) => {
        const t = (e.currentTarget as HTMLElement).dataset.team as Team;
        gsap.to(q(`.ics-tint--${t}`), { autoAlpha: 0.42, duration: 0.5, overwrite: "auto" });
        gsap.to(q(`.ics-tint--${t === "red" ? "blue" : "red"}`), {
          autoAlpha: 0.42,
          duration: 0.5,
          overwrite: "auto",
        });
      };

      const onClick = (e: Event) => {
        const t = (e.currentTarget as HTMLElement).dataset.team as Team;
        if (pending.current) return;
        pending.current = t;
        commitRef.current?.(t);
      };

      cards.forEach((card) => {
        card.addEventListener("pointerenter", onEnter);
        card.addEventListener("pointerleave", onLeave);
        card.addEventListener("click", onClick);
      });
      window.addEventListener("pointermove", onMove, { passive: true });

      enterGate();

      return () => {
        window.removeEventListener("pointermove", onMove);
        cards.forEach((card) => {
          card.removeEventListener("pointerenter", onEnter);
          card.removeEventListener("pointerleave", onLeave);
          card.removeEventListener("click", onClick);
        });
        commitRef.current = null;
        gateRef.current = null;
      };
    },
    { scope: root },
  );

  // lock scroll until a side is chosen
  useEffect(() => {
    if (phase === "gate") document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [phase]);

  useGSAP(
    () => {
      if (phase !== "descent") return;

      const q = gsap.utils.selector(root);
      const bands = q(".ics-band");
      const fill = q(".ics-rail__fill")[0];
      const stage = q(".ics-stage")[0];
      const column = q(".ics-strata")[0];
      const zone = root.current?.querySelector<HTMLElement>(".ics-hud__zone");
      const depth = root.current?.querySelector<HTMLElement>(".ics-hud__depth");
      const railLabel = root.current?.querySelector<HTMLElement>(".ics-rail__label");

      if (railLabel && team) railLabel.textContent = TEAMS[team].rail;

      const readBand = (p: number) => {
        const i = Math.min(BANDS - 1, Math.max(0, Math.round(p * (BANDS - 1))));
        const s = STRATA[i];
        if (zone) zone.textContent = `${s.level === "—" ? "OPEN" : s.level} · ${s.zone}`;
        if (depth) depth.textContent = `${s.depth} m`;
      };

      if (prefersReduced()) {
        // no pin just readable top to bottom
        readBand(0);
        return;
      }

      const unit = 1 / (BANDS - 1);
      const trigger = {
        trigger: root.current,
        start: "top top",
        end: `+=${DESCENT_VH * 100}%`,
        pin: stage,
        pinSpacing: true,
        scrub: 0.7,
        invalidateOnRefresh: true,
        snap: {
          snapTo: (v: number) => {
            const s = 1 / (BANDS - 1);
            return Math.round(v / s) * s;
          },
          duration: 0.28,
          delay: 0.04,
          ease: "power1.inOut" as const,
        },
        onUpdate: (self: ScrollTrigger) => readBand(self.progress),
      };

      const tl = gsap.timeline({ scrollTrigger: trigger });

      tl.to(
        column,
        { y: () => -(column.scrollHeight - stage.clientHeight), ease: "none" },
        0,
      );

      bands.forEach((band, i) => {
        const at = i * unit;
        tl.fromTo(
          band,
          { autoAlpha: 0.3 },
          { autoAlpha: 1, ease: "power1.inOut", duration: unit * 0.45 },
          Math.max(0, at - unit * 0.28),
        );
        if (fill) {
          // clamp so the deepest band does not push the rail past full
          tl.fromTo(
            fill,
            { scaleY: Math.min(1, i * unit) },
            { scaleY: Math.min(1, (i + 1) * unit), ease: "none" },
            at,
          );
        }
      });

      tl.to(q(".ics-hud__chip"), { autoAlpha: 0, y: -12, duration: 0.03 }, 0.015);

      readBand(0);
    },
    { scope: root, dependencies: [phase], revertOnUpdate: true },
  );

  return (
    <div
      ref={root}
      className="ics-hero"
      data-team={team ?? undefined}
      data-phase={phase}
    >
      <div className="ics-stage">
        <div className="ics-stage__backdrop" aria-hidden="true">
          <DesertBackdrop />
        </div>
        <div className="ics-stage__dim" aria-hidden="true" />
        <FlowField team={team} />

        <header className="absolute inset-x-0 top-0 z-20">
          <div className="mx-auto flex w-full max-w-[1440px] items-center justify-between gap-6 px-6 py-5 lg:px-10">
            <a href="#" className="flex items-center gap-3">
              <Image
                src={logo}
                alt=""
                width={30}
                height={30}
                priority
                className="h-[30px] w-[30px] select-none"
              />
              <span className="font-slab text-[0.95rem] font-semibold uppercase tracking-[0.1em] text-sand-200">
                VOID SOCIETY
              </span>
            </a>
            <nav className="hidden items-center gap-9 md:flex">
              {NAV.map((item) => (
                <a
                  key={item}
                  href="#"
                  className="font-slab text-[1rem] font-medium uppercase tracking-[0.02em] text-sand-300 transition-colors hover:text-ember-300"
                >
                  {item}
                </a>
              ))}
            </nav>
            <span className="font-mono hidden text-[0.625rem] uppercase tracking-[0.24em] text-sand-500 lg:inline">
              24 hours · isolated range
            </span>
          </div>
          <div className="h-px w-full bg-gradient-to-r from-transparent via-ember-700/50 to-transparent" />
        </header>

        <div className="ics-rail opacity-0" aria-hidden="true">
          <div className="ics-rail__fill" />
          <span className="ics-rail__label" />
        </div>

        <div className="ics-strata">
          {STRATA.map((s, i) => {
            const last = i === BANDS - 1;
            return (
              <section
                key={s.level}
                className={`ics-band${last ? " ics-band--final" : ""}`}
              >
                <span className="ics-band__depth">
                  {s.level === "—" ? "ABOVE GRID" : `${s.level} · ${s.depth} M`}
                </span>
                <div className="ics-band__meta">
                  <span className="ics-band__level">{s.level}</span>
                  <span>{s.zone}</span>
                </div>
                <div className="ics-band__body">
                  <h2 className="ics-band__headline">{s.headline}</h2>
                  <p className="ics-band__truth">{s.truth}</p>
                  <div className="ics-band__regs">
                    {s.registers.map((r) => (
                      <span key={r}>{r}</span>
                    ))}
                  </div>
                  {last && team && (
                    <div className="ics-cta">
                      <p className="font-mono text-[0.625rem] uppercase tracking-[0.22em] text-sand-500">
                        {TEAMS[team].side} · {TEAMS[team].rail}
                      </p>
                      <div className="ics-cta__row">
                        <a href="#" className="btn btn--primary">
                          Enter the range
                        </a>
                        <a href="#" className="btn btn--ghost">
                          Read the brief
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </section>
            );
          })}
        </div>

        <div className="ics-tint ics-tint--red" aria-hidden="true" />
        <div className="ics-tint ics-tint--blue" aria-hidden="true" />
        <div className="ics-seam" aria-hidden="true">
          <span className="ics-seam__bloom" />
        </div>

        <div className="ics-lockup">
          <div className="ics-lockup__inner">
            <span className="ics-lockup__status">
              <span className="dot-live h-[5px] w-[5px] rounded-full" />
              Registration open
            </span>

            <h1 className="sr-only">
              VOID CTF — a 24-hour offensive and defensive security competition
              on industrial control systems
            </h1>

            <div className="ics-mark" aria-hidden="true">
              <span className="ics-mark__letter">V</span>
              <div className="ics-mark__o">
                <BlackHoleHeroSection
                  className="ics-mark__hole"
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
                  hotColor="#FFF0D6"
                  midColor="#FF8A2B"
                  coolColor="#8E3A0B"
                  glow={1.1}
                  exposure={1}
                  vignette={0.22}
                  steps={260}
                  resolution={0.7}
                  maxDpr={1.5}
                />
              </div>
              <span className="ics-mark__letter">I</span>
              <span className="ics-mark__letter">D</span>
              <span className="ics-mark__ctf">CTF</span>
            </div>

            <p className="ics-lockup__sub">
              A water-treatment plant, drawn as it actually runs: six layers
              from the unmetered internet down to the process. One network,
              forty-two vaults, two teams who want opposite things from it.
            </p>
          </div>
        </div>

        <div className="ics-gate">
          <div className="ics-gate__inner">
            {(["red", "blue"] as Team[]).map((t) => (
              <button
                key={t}
                type="button"
                data-team={t}
                className={`ics-card ics-card--${t}`}
              >
                <span className="ics-card__role">
                  {TEAMS[t].side}
                  <span className="ics-card__side">{TEAMS[t].role}</span>
                </span>
                <span className="ics-card__headline">{TEAMS[t].headline}</span>
                <span className="ics-card__body">{TEAMS[t].body}</span>
                <span className="ics-card__meta">
                  {TEAMS[t].meta.map((m) => (
                    <span key={m}>{m}</span>
                  ))}
                </span>
                <span className="ics-card__note">{TEAMS[t].note}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="ics-hud opacity-0" aria-hidden="true">
          <span className="ics-hud__chip">
            <span className="ics-hud__dot" />
            {team ? `${TEAMS[team].side} · ${TEAMS[team].role}` : ""}
          </span>
          <span className="ics-hud__readout">
            <span className="ics-hud__zone">L4 · Enterprise</span>
            <span className="ics-hud__depth">12 m</span>
          </span>
        </div>

        {team && (
          <button
            type="button"
            className="ics-hud__switch"
            onClick={() => {
              setTeam(null);
              setPhase("gate");
              requestAnimationFrame(() => gateRef.current?.());
            }}
          >
            ← switch side
          </button>
        )}

        <div className="film-grain pointer-events-none absolute inset-0 z-30 opacity-[0.13]" />
      </div>
    </div>
  );
}
