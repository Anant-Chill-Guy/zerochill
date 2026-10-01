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
      { label: "Online / Qualifiers CTF", value: "24 – 25 Oct" },
      { label: "Mode", value: "Jeopardy" },
      { label: "Format", value: "24 Hours" },
      { label: "Offline CTF", value: "29 – 30 Nov" },
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

  footer: {
    // the mark's two words, set in the display face and drawn by TechText
    first: "Void",
    second: "CTF",
    // one flat line of links, no column headings: the address is written out as
    // the address, and Phone came out when the row went horizontal
    links: [
      { label: "About", href: "https://void-society.in/" },
      { label: "voidsociety@kiet.edu", href: "mailto:voidsociety@kiet.edu" },
      { label: "Rules", href: "#rules" },
      { label: "Write-ups", href: "#" },
    ],
    disclaimer:
      "Every system in the range is synthetic. Nothing here touches a live utility.",
    society: {
      label: "Void Society",
      url: "void-society.in",
      href: "https://void-society.in/",
    },
    credit: "Design & Develope by Team Void",
    cta: { label: "Register", href: "https://void-ctf.ctfd.io/register" },
  },
} as const;
