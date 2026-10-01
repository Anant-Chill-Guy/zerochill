"use client";

import { useRef, useState, type MouseEvent } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

type NavLink = {
  label: string;
  href: string;
  /* A pinned section holds the viewport for its whole scroll length, so an
     anchor to its top stops on the first frame of the sequence. "end" scrolls
     to the pin's release instead, where the section is fully revealed — the
     frame the briefing is actually read at. */
  align?: "end";
  /* off-site destinations open in their own tab, the way the footer's legal
     link and the register button already do */
  external?: boolean;
};

const LINKS: NavLink[] = [
  { label: "Overview", href: "#about", align: "end" },
  { label: "About Us", href: "https://void-society.in/", external: true },
  { label: "Rules", href: "#rules" },
  { label: "Timeline", href: "#root-protocol" },
];

const externalAttrs = (l: NavLink) =>
  l.external ? { target: "_blank", rel: "noopener noreferrer" } : {};

// scrolls so the target's bottom meets the viewport bottom — for a pinned
// section that is exactly where ScrollTrigger releases the pin. Everything
// else keeps native anchor behaviour.
function jumpTo(e: MouseEvent<HTMLAnchorElement>, link: NavLink) {
  if (link.align !== "end") return;
  const el = document.querySelector<HTMLElement>(link.href);
  if (!el) return;
  e.preventDefault();
  const { bottom } = el.getBoundingClientRect();
  window.scrollTo(0, Math.max(0, bottom + window.scrollY - window.innerHeight));
}

export function SiteNav() {
  const root = useRef<HTMLElement | null>(null);
  const [open, setOpen] = useState(false);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(root.current, {
          y: -16,
          autoAlpha: 0,
          duration: 0.8,
          ease: "power3.out",
          delay: 0.1,
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <header ref={root} className="nav-shell absolute inset-x-0 top-0 z-40">
      <div className="mx-auto flex w-full max-w-[1440px] items-center justify-between gap-6 px-6 py-4 lg:px-10">
        <a
          href="https://void-society.in/"
          target="_blank"
          rel="noopener noreferrer"
          className="nav-brand-link"
          aria-label="Void Society website"
        >
          <span className="nav-brand">
            VOID
            <Image
              className="nav-brand__logo"
              src="/media/logo.png"
              alt=""
              aria-hidden="true"
              width={256}
              height={256}
              priority
            />
            <span className="nav-brand__mark">SOCIETY</span>
          </span>
        </a>

        <nav className="hidden items-center gap-9 md:flex" aria-label="Primary">
          {LINKS.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="nav-link"
              {...externalAttrs(l)}
              onClick={(e) => jumpTo(e, l)}
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href="https://void-ctf.ctfd.io/"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn--ghost btn--sm hidden md:inline-flex"
          >
            Register
          </a>
          <button
            type="button"
            className="nav-toggle md:hidden"
            aria-expanded={open}
            aria-controls="nav-drawer"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            <span className="nav-toggle__bars" aria-hidden="true" />
          </button>
        </div>
      </div>

      {open && (
        <div id="nav-drawer" className="nav-drawer md:hidden">
          <nav
            className="mx-auto flex w-full max-w-[1440px] flex-col gap-1 px-6 py-4"
            aria-label="Primary"
          >
            {LINKS.map((l) => (
              <a
                key={l.label}
                href={l.href}
                className="nav-link py-3"
                {...externalAttrs(l)}
                onClick={(e) => {
                  setOpen(false);
                  jumpTo(e, l);
                }}
              >
                {l.label}
              </a>
            ))}
            <a
              href="https://void-ctf.ctfd.io/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn--ghost btn--sm mt-3 self-start"
              onClick={() => setOpen(false)}
            >
              Register
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
