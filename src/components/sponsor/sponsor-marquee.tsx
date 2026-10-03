import type { CSSProperties } from "react";
import Image from "next/image";

import { content } from "@/content/site";

const { partners } = content.sponsor;

// copies of the sponsor set in each half of the marquee, enough that one half
// is wider than a large screen
const REPEAT = 4;

/* The run is two identical halves; the track slides one half's width and
   loops, so the seam never shows. Only the first copy is announced. */
export function SponsorMarquee({ className = "" }: { className?: string }) {
  return (
    // the outer box is the caller's to style; the fade mask lives on the inner
    // one so it never eats a frame or background drawn on the outer
    <div className={className}>
      <div className="sp-marquee">
        <div className="sp-marquee__track">
          {[0, 1].map((half) => (
            <ul
              key={half}
              className="sp-marquee__run"
              aria-label={half ? undefined : "Sponsors"}
              aria-hidden={half ? true : undefined}
            >
              {Array.from({ length: REPEAT }, () => partners)
                .flat()
                .map((p, i) => (
                  <li
                    key={`${p.name}-${i}`}
                    className="sp-marquee__chip"
                    style={{ "--sp-plate": p.plate } as CSSProperties}
                  >
                    <a
                      href={p.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      tabIndex={half || i >= partners.length ? -1 : undefined}
                    >
                      <Image
                        className="sp-marquee__logo"
                        src={p.logo.src}
                        width={p.logo.w}
                        height={p.logo.h}
                        alt={half || i >= partners.length ? "" : p.name}
                        unoptimized
                      />
                    </a>
                  </li>
                ))}
            </ul>
          ))}
        </div>
      </div>
    </div>
  );
}
