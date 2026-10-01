"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

import { content } from "@/content/site";

gsap.registerPlugin(useGSAP);

const VIDEO = "/media/preloader-facility.mp4";

// The clip is 10s of construction. Run it a little hot rather than trimming it,
// so the whole build still plays and only the pacing changes. 1 = original.
const SPEED = 1.35;

// No poster on purpose. The still we have is the fully assembled facility,
// while the clip opens on empty black, so using it as a poster would flash
// bright-then-black on every load. The container is already pure black, so
// leaving it bare is seamless.

// a clip that stalls, is refused, or gets blocked from autoplay must not strand
// the visitor behind the loader. Sits just past the clip's own 10s runtime.
const STALL_TIMEOUT_MS = 13000;

// once the intro has played, repeat loads inside this window skip straight to
// the page. The cookie is read pre-paint in layout.tsx to hide the loader
// before it can flash, so the name must stay in sync with that script.
const SEEN_COOKIE = "void-intro";
const SEEN_TTL_S = 600;

export function Preloader({
  onOpen,
  onDone,
}: {
  onOpen: () => void;
  onDone: () => void;
}) {
  const root = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [gone, setGone] = useState(false);

  useGSAP(
    () => {
      const el = root.current;
      const video = videoRef.current;
      if (!el) return;

      if (document.documentElement.dataset.intro === "seen") {
        video?.pause();
        onOpen();
        onDone();
        setGone(true);
        return;
      }

      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const plate = gsap.utils.selector(root)(".pre__plate")[0] as HTMLElement;

      let fired = false;
      const reveal = () => {
        if (fired) return;
        fired = true;
        document.cookie = `${SEEN_COOKIE}=1; max-age=${SEEN_TTL_S}; path=/; samesite=lax`;

        const tl = gsap.timeline({
          onComplete: () => {
            onDone();
            setGone(true);
          },
        });

        tl.add(() => onOpen(), 0);
        // push in on the way out so the mark hands off to the page rather than
        // simply switching off
        if (!reduce && plate) {
          tl.to(plate, { scale: 1.09, duration: 0.95, ease: "power2.in" }, 0);
        }
        tl.to(el, { autoAlpha: 0, duration: reduce ? 0.5 : 0.95, ease: "power2.inOut" }, 0);
      };

      // reduced motion never gets the clip. Hold the assembled still instead.
      if (reduce) {
        video?.pause();
        const hold = window.setTimeout(reveal, content.preloader.holdMs);
        return () => window.clearTimeout(hold);
      }

      // the clip is the whole animation, so the reveal is driven by it ending
      const onEnded = () => reveal();
      // a missing codec or a refused source would otherwise hang forever
      const onError = () => reveal();
      video?.addEventListener("ended", onEnded);
      video?.addEventListener("error", onError);

      if (video) video.playbackRate = SPEED;
      video?.play().catch(() => reveal());

      const guard = window.setTimeout(reveal, STALL_TIMEOUT_MS);

      return () => {
        window.clearTimeout(guard);
        video?.removeEventListener("ended", onEnded);
        video?.removeEventListener("error", onError);
      };
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
      <div className="pre__plate" aria-hidden="true">
        <video
          ref={videoRef}
          className="pre__video"
          muted
          playsInline
          preload="auto"
        >
          {/* the media query keeps reduced-motion visitors from downloading a
              4.75MB clip they will never be shown. With no source selected the
              element stays inert, and the hold-and-dissolve path runs instead. */}
          <source
            src={VIDEO}
            type="video/mp4"
            media="(prefers-reduced-motion: no-preference)"
          />
        </video>
      </div>
    </div>
  );
}
