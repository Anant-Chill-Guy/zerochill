"use client";

import { useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { Preloader } from "@/components/preloader";
import { SiteNav } from "@/components/hero/site-nav";
import { Ingress } from "@/components/sequence/ingress";
import { Statement } from "@/components/sequence/statement";

gsap.registerPlugin(ScrollTrigger);

export function VoidLanding() {
  const [sealed, setSealed] = useState(true);
  const [opened, setOpened] = useState(false);

  useEffect(() => {
    if (!sealed) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.scrollTo(0, 0);
    return () => {
      document.body.style.overflow = prev;
    };
  }, [sealed]);

  return (
    <div className="relative">
      <noscript>
        <style>{`.pre{display:none !important}`}</style>
      </noscript>

      <Preloader
        onOpen={() => {
          setSealed(false);
          setOpened(true);
          // pins shift once the lock lifts so refresh before they are read
          requestAnimationFrame(() => ScrollTrigger.refresh());
        }}
        onDone={() => ScrollTrigger.refresh()}
      />

      {opened && <SiteNav />}

      <Ingress opened={opened} />
      <Statement />
    </div>
  );
}
