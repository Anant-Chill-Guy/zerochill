"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const PHASES = [
  {
    n: "01",
    title: "Recon",
    desc: "Trace ASTAROTH's telemetry across the offline physical network.",
    tags: ["OSINT", "Network", "Recon"],
  },
  {
    n: "02",
    title: "Breach",
    desc: "Turn one exposed edge service into a foothold on the network.",
    tags: ["Web", "Pwn"],
  },
  {
    n: "03",
    title: "Pivot",
    desc: "Cross the corporate security boundary toward the control zone.",
    tags: ["Network", "AD", "Crypto"],
  },
  {
    n: "04",
    title: "Escalate",
    desc: "Defeat the process controls and take the operator seat.",
    tags: ["Reversing", "Pwn"],
  },
  {
    n: "05",
    title: "Capture",
    desc: "Reach centrifuge control before Site-9 hits critical enrichment.",
    tags: ["ICS", "Forensics"],
  },
];

type Pt = { x: number; y: number };

const round = (n: number) => Math.round(n * 100) / 100;

// cubic weave through every node with mirrored control points at each station
function weave(pts: Pt[], amp: number): string {
  let d = `M ${round(pts[0].x)} ${round(pts[0].y)}`;
  for (let i = 1; i < pts.length; i++) {
    const a = pts[i - 1];
    const b = pts[i];
    const side = (i - 1) % 2 === 0 ? amp : -amp;
    const k = (b.y - a.y) * 0.5;
    d +=
      ` C ${round(a.x + side)} ${round(a.y + k)}` +
      `, ${round(b.x + side)} ${round(b.y - k)}` +
      `, ${round(b.x)} ${round(b.y)}`;
  }
  return d;
}

export function Operation() {
  const root = useRef<HTMLElement | null>(null);
  const listRef = useRef<HTMLOListElement | null>(null);
  const routeRef = useRef<SVGPathElement | null>(null);
  const inkRef = useRef<SVGPathElement | null>(null);
  const headRef = useRef<SVGCircleElement | null>(null);

  useGSAP(
    () => {
      const list = listRef.current;
      const route = routeRef.current;
      const ink = inkRef.current;
      const head = headRef.current;
      const svg = route?.ownerSVGElement;
      if (!list || !route || !ink || !head || !svg) return;

      const phases = gsap.utils.toArray<HTMLElement>(".op-phase", list);
      const nodes = gsap.utils.toArray<HTMLElement>(".op-phase__node", list);
      if (nodes.length < 2 || phases.length !== nodes.length) return;

      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".op-aside > *", {
          autoAlpha: 0,
          y: 18,
          duration: 0.7,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: { trigger: ".op-aside", start: "top 82%" },
        });
      });

      let length = 1;
      let stops: number[] = [];
      let tl: gsap.core.Timeline | null = null;
      let syncId = 0;
      let disposed = false;
      const playhead = { p: 0 };

      const lengthAtY = (y: number) => {
        let lo = 0;
        let hi = length;
        for (let i = 0; i < 20; i++) {
          const mid = (lo + hi) / 2;
          if (route.getPointAtLength(mid).y < y) lo = mid;
          else hi = mid;
        }
        return (lo + hi) / 2;
      };

      const paint = (p: number, showHead = true) => {
        ink.setAttribute("stroke-dashoffset", `${length * (1 - p)}`);
        const tip = route.getPointAtLength(gsap.utils.clamp(0, length, p * length));
        head.setAttribute("cx", `${round(tip.x)}`);
        head.setAttribute("cy", `${round(tip.y)}`);
        head.style.opacity = showHead
          ? `${gsap.utils.clamp(0, 1, p * 14)}`
          : "0";
        phases.forEach((el, i) => el.classList.toggle("is-lit", p >= stops[i]));
      };

      const build = () => {
        const box = list.getBoundingClientRect();
        const amp =
          parseFloat(getComputedStyle(list).getPropertyValue("--op-wave")) || 16;
        const pts: Pt[] = nodes.map((node) => {
          const phase = node.parentElement;
          // layout offsets not a bounding rect the rows carry gsap transforms
          return {
            x: round(node.offsetLeft + node.offsetWidth / 2),
            y: round(
              (phase?.offsetTop ?? 0) + node.offsetTop + node.offsetHeight / 2,
            ),
          };
        });

        const d = weave(pts, amp);
        svg.setAttribute("viewBox", `0 0 ${round(box.width)} ${round(box.height)}`);
        route.setAttribute("d", d);
        ink.setAttribute("d", d);

        length = Math.max(1, route.getTotalLength());
        // undrawn by default so nothing flashes the full weave before paint
        ink.setAttribute("stroke-dasharray", `${length}`);
        ink.setAttribute("stroke-dashoffset", `${length}`);
        stops = pts.map((pt) => lengthAtY(pt.y) / length);
      };

      const rebuild = () => {
        const was = tl?.scrollTrigger?.progress ?? 0;
        tl?.scrollTrigger?.kill();
        tl?.kill();
        tl = null;
        build();

        if (reduced) {
          paint(1, false);
          return;
        }

        tl = gsap.timeline({
          scrollTrigger: {
            trigger: list,
            start: "top 78%",
            end: "bottom 62%",
            scrub: 0.6,
          },
        });
        // playhead is the single source of progress everything else reads it
        tl.to(
          playhead,
          { p: 1, duration: 1, ease: "none", onUpdate: () => paint(playhead.p) },
          0,
        );
        phases.forEach((el, i) => {
          tl!.fromTo(
            el,
            { autoAlpha: 0, y: 12 },
            { autoAlpha: 1, y: 0, ease: "none", duration: 0.14 },
            gsap.utils.clamp(0, 0.84, stops[i] - 0.12),
          );
        });
        if (was) tl.progress(was);

        cancelAnimationFrame(syncId);
        syncId = requestAnimationFrame(() => {
          if (!disposed && tl) paint(tl.progress(), true);
        });
      };

      rebuild();

      const ro = new ResizeObserver(() => rebuild());
      ro.observe(list);
      if (document.fonts) {
        document.fonts.ready
          .then(() => {
            if (!disposed) rebuild();
          })
          .catch(() => {});
      }

      return () => {
        disposed = true;
        cancelAnimationFrame(syncId);
        ro.disconnect();
        tl?.scrollTrigger?.kill();
        tl?.kill();
        mm.revert();
      };
    },
    { scope: root },
  );

  return (
    <section id="root-protocol" ref={root} className="op-section">
      <div className="op-grid">
        <aside className="op-aside">
          <h2 className="op-title">The Operation</h2>
          <p className="op-intro">
            Operation Neptune&apos;s Spear. The ASTAROTH syndicate holds Site-9
            and runs its control logic on an offline physical network. Your cell
            is on the wire: follow the trail, take a foothold, cross the
            boundary, and reach centrifuge control before critical enrichment.
          </p>
          <p className="op-roles">
            Ops Control watches every route. <b>Rival cells will deceive you.</b>{" "}
            Trust nothing.
          </p>
        </aside>

        <ol className="op-list" ref={listRef}>
          <svg
            className="op-trace"
            aria-hidden="true"
            preserveAspectRatio="none"
          >
            <path className="op-trace__route" ref={routeRef} />
            <path className="op-trace__ink" ref={inkRef} />
            <circle className="op-trace__head" ref={headRef} r="2.6" />
          </svg>
          {PHASES.map((p) => (
            <li key={p.n} className="op-phase">
              <span className="op-phase__node" aria-hidden="true" />
              <span className="op-phase__idx">{p.n}</span>
              <div className="op-phase__body">
                <h3 className="op-phase__title">{p.title}</h3>
                <p className="op-phase__desc">{p.desc}</p>
                <ul className="op-tags">
                  {p.tags.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
