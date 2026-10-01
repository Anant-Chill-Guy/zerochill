// visit log, kept in Upstash Redis over its REST API so no client library is
// needed. Vercel's Upstash integration names the env vars either way, so both
// spellings are read. With neither set, recording is a no-op and the stats are
// empty — the site never breaks over its own analytics.

const URL_ENV = process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL;
const TOKEN_ENV =
  process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN;

// how many individual visits the log keeps; the counters are unbounded
const LOG_LIMIT = 500;

export type Visit = {
  at: string;
  ip: string;
  country: string;
  city: string;
  path: string;
  referrer: string;
  ua: string;
};

export type VisitStats = {
  configured: boolean;
  total: number;
  unique: number;
  today: number;
  recent: Visit[];
};

type Command = (string | number)[];

async function pipeline(commands: Command[]): Promise<unknown[] | null> {
  if (!URL_ENV || !TOKEN_ENV) return null;
  const res = await fetch(`${URL_ENV}/pipeline`, {
    method: "POST",
    headers: { Authorization: `Bearer ${TOKEN_ENV}` },
    body: JSON.stringify(commands),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`visit store responded ${res.status}`);
  const replies = (await res.json()) as { result?: unknown; error?: string }[];
  return replies.map((reply) => reply.result);
}

const dayKey = (date: Date) => `bee:day:${date.toISOString().slice(0, 10)}`;

export async function recordVisit(visit: Visit): Promise<void> {
  await pipeline([
    ["INCR", "bee:total"],
    ["SADD", "bee:ips", visit.ip],
    ["INCR", dayKey(new Date(visit.at))],
    ["LPUSH", "bee:log", JSON.stringify(visit)],
    ["LTRIM", "bee:log", 0, LOG_LIMIT - 1],
  ]);
}

export async function getVisitStats(): Promise<VisitStats> {
  const replies = await pipeline([
    ["GET", "bee:total"],
    ["SCARD", "bee:ips"],
    ["GET", dayKey(new Date())],
    ["LRANGE", "bee:log", 0, LOG_LIMIT - 1],
  ]);
  if (!replies) {
    return { configured: false, total: 0, unique: 0, today: 0, recent: [] };
  }
  const [total, unique, today, log] = replies;
  return {
    configured: true,
    total: Number(total ?? 0),
    unique: Number(unique ?? 0),
    today: Number(today ?? 0),
    recent: ((log as string[] | null) ?? []).map((row) => JSON.parse(row) as Visit),
  };
}
