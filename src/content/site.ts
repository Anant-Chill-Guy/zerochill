export type SequenceContent = typeof content;

export const content = {
  wordmark: {
    first: "VOID",
    second: "CTF",
  },

  preloader: {
    status: "Brief sealed",
    a11y: "Loading VOID CTF",
    holdMs: 900,
  },

  ingress: {
    eyebrow: "",
    headline: "CTF",
    sub: "Nobody has reached the bottom.",
    readout: [
      { label: "Online / Qualifiers CTF", value: "24-25 Oct" },
      { label: "Mode", value: "Jeopardy" },
      { label: "Format", value: "24 Hours" },
      { label: "Offline CTF", value: "29-30 Nov" },
      { label: "Mode", value: "Attack Defense" },
      { label: "Format", value: "24 Hours Offline" },
    ],
    tagline: "Organized by the KIET Cyber Security Center of Excellence",
    mosaicAlt:
      "A riverside nuclear plant at dusk, cut into a grid of windows.",
  },

  statement: {
    lines: [
      "Deep in the desert, a rogue nation-state is trying to weaponize the power of the sun.",
      "[o] Your mission, should you choose to accept it, is to sabotage",
      "their facility and destroy their infrastructure.",
    ],
    circleAlt:
      "A desert nuclear plant with cooling towers on the horizon, a dirt track leading toward it, and a weathered wooden sign reading \"CTF challenge 10 km away.\"",
  },

  globe: {
    eyebrow: "02 / Field",
    headline: "Forty-one countries, one grid.",
    body: "The range runs on the stack every water utility already runs on. The globe is where the entrants are.",
    turns: 0.62,
    // lat lng centroids
    nodes: [
      [52.1, 4.3], [48.9, 2.3], [51.5, -0.1], [40.4, -3.7], [41.9, 12.5],
      [37.98, 23.7], [30.0, 31.2], [1.35, 103.8], [-6.2, 106.8], [35.7, 139.7],
      [37.6, 127.0], [-33.9, 151.2], [19.1, 72.9], [25.2, 55.3], [-26.2, 28.0],
      [-23.5, -46.6], [38.9, -77.0], [45.5, -73.6], [37.8, -122.4], [43.7, -79.4],
      [-33.4, -70.7], [64.1, -21.9], [59.3, 18.1], [55.8, 37.6], [50.1, 8.7],
    ],
  },

  sponsor: {
    title: "Sponsors",
    intro:
      "The teams and companies keeping the range running. VOID CTF is free to enter because of them.",
    partners: [
      {
        category: "Certification partner",
        name: "APIsec University",
        tagline: "Free API security training.",
        blurb:
          "APIsec University offers free API security training for AppSec and DevSecOps professionals.",
        href: "https://au.apisec.ai/",
        url: "au.apisec.ai",
        logo: { src: "/media/sponsor-apisec-university.png", w: 696, h: 256 },
        plate: "#ffffff",
        brand: "#bbd7df",
      },
      {
        category: "Certification partner",
        name: "HackerDNA",
        tagline: "Learn ethical hacking by actually doing it.",
        blurb:
          "Browser-based labs and challenges across web, Linux privilege escalation, cryptography, forensics and reverse engineering.",
        href: "https://hackerdna.com/",
        url: "hackerdna.com",
        logo: { src: "/media/sponsor-hackerdna.svg", w: 175, h: 50 },
        plate: "#020617",
        brand: "#22c55e",
      },
      {
        category: "Community partner",
        name: "Hackitise Labs",
        tagline: "Offensive Operations Certification.",
        blurb:
          "A hands-on, proctored certification in three tiers, Spark, Forge and Ghost, with lab work run against an isolated live range.",
        href: "https://cert.hackitiselabs.in/",
        url: "cert.hackitiselabs.in",
        logo: { src: "/media/sponsor-hackitise-white.png", w: 984, h: 223 },
        plate: "#0a0a0a",
        brand: "#ff5a1f",
      },
      {
        category: "Community partner",
        name: "Cyndia",
        tagline: "Let's Cyberize India.",
        blurb:
          "A cybersecurity community behind the Cyber Unfolded blog and The Files Lab, an anonymous file-sharing service.",
        href: "https://cyndia.in/",
        url: "cyndia.in",
        logo: { src: "/media/sponsor-cyndia-white.svg", w: 2640, h: 765 },
        plate: "#0a0a0a",
        brand: "#fe1e55",
      },
      {
        category: "Domain partner",
        name: ".xyz",
        tagline: "For every website, everywhere.",
        blurb:
          "The .xyz domain is used by builders, startups and creators to put their work online.",
        href: "https://gen.xyz/",
        url: "gen.xyz",
        logo: { src: "/media/sponsor-xyz-white.svg", w: 85, h: 50 },
        // the sponsor's own colours, used only inside its plate
        plate: "#000000",
        brand: "#fff532",
      },
    ],
    pitch: {
      title: "Sponsor the range",
      body: "VOID CTF runs a 24-hour online qualifier and a 24-hour attack-defense final on a physical network. Sponsors put their name in front of the teams who play both.",
      cta: {
        label: "Email voidsociety@kiet.edu",
        href: "mailto:voidsociety@kiet.edu?subject=Sponsoring%20VOID%20CTF",
      },
    },
  },

  footer: {
    // the mark's two words, set in the display face and drawn by TechText
    first: "Void",
    second: "CTF",
    // one flat line of links, no column headings: the address is written out as
    // the address, and Phone came out when the row went horizontal
    links: [
      { label: "About", href: "https://void-society.in/" },
      { label: "voidsociety@kiet.edu", href: "mailto:voidsociety@kiet.edu" },
      // root-relative so the links still land from /sponsor
      { label: "Rules", href: "/#rules" },
      { label: "Sponsors", href: "/sponsor" },
    ],
    disclaimer:
      "Every system in the range is synthetic. Nothing here touches a live utility.",
    society: {
      label: "Void Society",
      url: "void-society.in",
      href: "https://void-society.in/",
    },
    credit: "Designed and built by Team Void",
    cta: { label: "Register", href: "https://void-ctf.ctfd.io/" },
  },
} as const;
