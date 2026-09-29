"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const LINKS = [
  { label: "Root Protocol", href: "#root-protocol" },
  { label: "Leaderboard", href: "#leaderboard" },
  { label: "Rules", href: "#rules" },
];

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
        <a href="#" className="nav-brand-link">
          <span className="nav-brand">
            VOID
            <Image
              className="nav-brand__logo"
              src="/media/logo-for-nav.png"
              alt=""
              aria-hidden="true"
              width={128}
              height={128}
            />
            <span className="nav-brand__mark">SOCIETY</span>
          </span>
        </a>

        <nav className="hidden items-center gap-9 md:flex" aria-label="Primary">
          {LINKS.map((l) => (
            <a key={l.label} href={l.href} className="nav-link">
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a href="https://void-ctf.ctfd.io/" className="btn btn--ghost btn--sm hidden md:inline-flex">
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
                onClick={() => setOpen(false)}
              >
                {l.label}
              </a>
            ))}
            <a
              href="https://void-ctf.ctfd.io/"
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
