export type Team = "red" | "blue";

export interface Stratum {
  level: string;
  zone: string;
  headline: string;
  truth: string;
  registers: string[];
  // 0-1 glow weight per team
  affinity: Record<Team, number>;
  depth: number;
}

export const STRATA: Stratum[] = [
  {
    level: "—",
    zone: "The unmetered",
    headline: "Outside the model.",
    truth:
      "No owner, no log, no reason to exist. This is where every intrusion starts and where none of them are recorded.",
    registers: ["0.0.0.0/0", "NO CACHE", "TTL 61"],
    affinity: { red: 1, blue: 0.18 },
    depth: 0,
  },
  {
    level: "L4",
    zone: "Enterprise",
    headline: "The loud half.",
    truth:
      "Patched on a schedule, logged on every click, defended by everyone at once. This is the only layer where the fight is already on.",
    registers: ["TCP/443", "CVSS 9.8", "EPSS 0.91"],
    affinity: { red: 0.3, blue: 0.62 },
    depth: 12,
  },
  {
    level: "L3",
    zone: "Industrial DMZ",
    headline: "Where IT meets OT.",
    truth:
      "Historian, jump host, vendor remote access. The most trusted segment on the plant, and the one almost nobody is watching.",
    registers: ["4x0001", "0xF0 03 2A", "VNC 5900"],
    affinity: { red: 0.96, blue: 1 },
    depth: 48,
  },
  {
    level: "L2",
    zone: "Control network",
    headline: "Hands on the process.",
    truth:
      "HMI and engineering workstation. One shared logon, thirty seats, and no reliable answer to who is actually holding the keyboard.",
    registers: ["OPC UA", "LOGIN: engineer", "PLC-04"],
    affinity: { red: 0.9, blue: 0.9 },
    depth: 96,
  },
  {
    level: "L1",
    zone: "Field devices",
    headline: "No auth. Ever.",
    truth:
      "Modbus. No authentication, no encryption, no concept of either. Reachable from the segment directly above it, every time.",
    registers: ["UNIT 1", "FC 03 READ", "REG 40001"],
    affinity: { red: 0.96, blue: 0.84 },
    depth: 140,
  },
  {
    level: "L0",
    zone: "Physical process",
    headline: "The part that cannot be undone.",
    truth:
      "Chlorination, pressure, flow. A snapshot is not an incident — the water is the incident.",
    registers: ["pH 7.2", "PSI 61.4", "FLOW 1.9k"],
    affinity: { red: 1, blue: 1 },
    depth: 182,
  },
];

export interface TeamBrief {
  id: Team;
  side: string;
  role: string;
  headline: string;
  body: string;
  meta: string[];
  note: string;
  rail: string;
}

export const TEAMS: Record<Team, TeamBrief> = {
  red: {
    id: "red",
    side: "Team Red",
    role: "Offensive",
    headline: "Find the path in.",
    body:
      "The plant is hardened where it is loud and soft where it counts. Enumerate, pivot, cross the DMZ, reach the process. Every vault on the way is a checkpoint.",
    meta: ["42 vaults", "Offensive track", "Isolated range"],
    note: "You get the intrusion. They get the alarm.",
    rail: "Intrusion path",
  },
  blue: {
    id: "blue",
    side: "Team Blue",
    role: "Defensive",
    headline: "Hold what they came for.",
    body:
      "Same range, same forty-two vaults, mirrored. You are watching the exact chain they are walking and you have to see it before the process moves. Patch it, pivot it, contain it.",
    meta: ["42 vaults", "Defensive track", "Isolated range"],
    note: "You get the alarm. They get the outage.",
    rail: "Detection coverage",
  },
};

export const NAV = ["Rules", "Scope", "Leaderboard"];
