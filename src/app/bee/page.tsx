import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getVisitStats } from "@/lib/visits";

import { isSignedIn } from "./auth";
import { SignInForm } from "./sign-in-form";

// unlisted visitor log at plain /bee. It asks for BEE_KEY once, then a cookie
// scoped to /bee keeps the browser signed in. With BEE_KEY unset the route
// answers 404, as if it did not exist.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "bee",
  robots: { index: false, follow: false },
};

export default async function BeePage() {
  if (!process.env.BEE_KEY) notFound();

  if (!(await isSignedIn())) {
    return (
      <main className="mx-auto w-full max-w-6xl px-4 py-10 font-mono text-sm text-ink-300">
        <h1 className="text-2xl text-bone">Visitors</h1>
        <SignInForm />
      </main>
    );
  }

  const stats = await getVisitStats();

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10 font-mono text-sm text-ink-300">
      <h1 className="text-2xl text-bone">Visitors</h1>

      {!stats.configured && (
        <p className="mt-4 text-amber">
          Visit store not configured: set UPSTASH_REDIS_REST_URL and
          UPSTASH_REDIS_REST_TOKEN.
        </p>
      )}

      <dl className="mt-6 grid grid-cols-3 gap-4">
        {[
          ["Total visits", stats.total],
          ["Unique IPs", stats.unique],
          ["Today (UTC)", stats.today],
        ].map(([label, value]) => (
          <div key={label} className="border border-ink-300/20 p-4">
            <dt className="text-xs uppercase tracking-wider">{label}</dt>
            <dd className="mt-2 text-2xl text-bone">{value}</dd>
          </div>
        ))}
      </dl>

      <h2 className="mt-10 text-lg text-bone">
        Recent visits ({stats.recent.length})
      </h2>
      <div className="mt-3 overflow-x-auto">
        <table className="w-full border-collapse text-left text-xs">
          <thead>
            <tr className="border-b border-ink-300/20">
              <th className="py-2 pr-4">Time (UTC)</th>
              <th className="py-2 pr-4">IP</th>
              <th className="py-2 pr-4">Location</th>
              <th className="py-2 pr-4">Path</th>
              <th className="py-2 pr-4">Referrer</th>
              <th className="py-2">User agent</th>
            </tr>
          </thead>
          <tbody>
            {stats.recent.map((visit, index) => (
              <tr key={`${visit.at}-${index}`} className="border-b border-ink-300/10 align-top">
                <td className="whitespace-nowrap py-2 pr-4">
                  {visit.at.replace("T", " ").slice(0, 19)}
                </td>
                <td className="whitespace-nowrap py-2 pr-4 text-bone">{visit.ip}</td>
                <td className="whitespace-nowrap py-2 pr-4">
                  {[visit.city, visit.country].filter(Boolean).join(", ") || "-"}
                </td>
                <td className="py-2 pr-4">{visit.path}</td>
                <td className="max-w-48 truncate py-2 pr-4">{visit.referrer || "-"}</td>
                <td className="max-w-72 truncate py-2" title={visit.ua}>
                  {visit.ua}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
