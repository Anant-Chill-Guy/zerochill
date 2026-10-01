import Image from "next/image";

import { content } from "@/content/site";
import { TechText } from "@/components/tech-text";

// off-site links open in their own tab, matching the legal row below them
const isExternal = (href: string) => href.startsWith("http");

/* The mark runs flat dark brown on the cream sheet, pinned as a literal for the
   same reason as --hero-mark-ink: the deep palette remaps --color-iron-600 to
   its blue, and the footer sheet does not flip with it. The canvas takes the
   colour as a value, so it cannot ride a custom property. */
const MARK_INK = "#402719";

export function SiteFooter() {
  return (
    <footer className="ft">
      <div className="ft__sheet">
        <div className="ft__inner">
          {/* drawn rather than set: the letters are canvas sprites, so the
              lockup takes the display face off .ft__mark and lays itself out
              across whatever box that class hands it. The sweep is the reason
              the mark keeps moving when nobody is near it — the lens walks the
              word on its own and runs the frame and specks over each glyph. */}
          <div className="ft__mark" aria-hidden="true">
            <TechText
              text={`${content.footer.first} ${content.footer.second}`}
              fontWeight={400}
              fontSize={150}
              letterSpacing={-0.035}
              color={MARK_INK}
              accentColor={MARK_INK}
              reveal="letter"
              lineStyle="dashed"
              dashLength={4}
              dashGap={2}
              specks={15}
              reach={200}
              softness={0.7}
              strokeWidth={1.5}
              speed={1}
              selection
              labels
              draggable
              sweep
            />
          </div>

          <div className="ft__grid">
            <div className="ft__intro">
              <p className="ft__disclaimer">{content.footer.disclaimer}</p>
              <Image
                className="ft__logo"
                src="/media/logo.png"
                alt="Void Society"
                width={256}
                height={256}
              />
            </div>

            <nav className="ft__nav" aria-label="Void Society">
              <ul className="ft__links">
                {content.footer.links.map((link) => (
                  <li key={link.label}>
                    <a
                      className="ft__link"
                      href={link.href}
                      {...(isExternal(link.href)
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* the line out to the society's own site: a full-measure rule that
              is itself the link, rather than another item in the list above */}
          <a
            className="ft__society"
            href={content.footer.society.href}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="ft__society-name">{content.footer.society.label}</span>
            <span className="ft__society-url">
              {content.footer.society.url}
              <span aria-hidden="true"> →</span>
            </span>
          </a>

          <div className="ft__legal">
            <span className="ft__credit">{content.footer.credit}</span>
            <a
              href={content.footer.cta.href}
              className="btn btn--sm ft__cta"
              target="_blank"
              rel="noopener noreferrer"
            >
              {content.footer.cta.label}
              <span className="btn__arrow" aria-hidden="true">
                →
              </span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
