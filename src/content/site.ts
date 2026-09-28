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
    headline: "THE CTF",
    sub: "Nobody has reached the bottom.",
    readout: [
      { label: "Layers", value: "6" },
      { label: "Window", value: "24 h" },
      { label: "Range", value: "Isolated" },
      { label: "Vaults", value: "42" },
    ],
    mosaicAlt:
      "A riverside nuclear plant at dusk, cut into a grid of windows.",
  },

  statement: {
    eyebrow: "01 / The plant",
    lines: [
      "Every plant is a ladder",
      "[o] from the internet down to the water.",
      "We drew this one the way they actually are.",
    ],
    circleCaption: "L4 · Enterprise",
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
    first: "VOID",
    second: "CTF",
    columns: [
      {
        title: "Range",
        links: [
          { label: "Root Protocol", href: "#root-protocol" },
          { label: "Leaderboard", href: "#leaderboard" },
          { label: "Rules", href: "#rules" },
        ],
      },
      {
        title: "Records",
        links: [
          { label: "Archive", href: "#" },
          { label: "Write-ups", href: "#" },
          { label: "Scoring", href: "#" },
        ],
      },
      {
        title: "Society",
        links: [
          { label: "About", href: "#" },
          { label: "Contact", href: "#" },
          { label: "Conduct", href: "#" },
        ],
      },
    ],
    disclaimer:
      "Every system in the range is synthetic. Nothing here touches a live utility.",
    legal: "Void Society",
    cta: { label: "Register", href: "#register" },
  },
} as const;
