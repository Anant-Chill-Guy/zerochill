"use server";

import { createHash, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// the cookie holds a hash of BEE_KEY, never the key itself, so reading the
// cookie off a machine does not hand over the key
const COOKIE = "bee";
const MAX_AGE_S = 60 * 60 * 24 * 30;

const digest = (value: string) => createHash("sha256").update(value).digest();
const token = (key: string) => digest(`bee:${key}`).toString("hex");

function matches(given: string, expected: string): boolean {
  return timingSafeEqual(digest(given), digest(expected));
}

export async function isSignedIn(): Promise<boolean> {
  const key = process.env.BEE_KEY;
  if (!key) return false;
  const value = (await cookies()).get(COOKIE)?.value;
  return !!value && matches(value, token(key));
}

export async function signIn(
  _prev: { error: string } | null,
  form: FormData,
): Promise<{ error: string } | null> {
  const key = process.env.BEE_KEY;
  const given = form.get("key");
  if (!key || typeof given !== "string" || !matches(given, key)) {
    return { error: "Wrong key." };
  }
  (await cookies()).set(COOKIE, token(key), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/bee",
    maxAge: MAX_AGE_S,
  });
  redirect("/bee");
}
