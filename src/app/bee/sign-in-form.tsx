"use client";

import { useActionState } from "react";

import { signIn } from "./auth";

export function SignInForm() {
  const [state, action, pending] = useActionState(signIn, null);

  return (
    <form action={action} className="mt-6 flex max-w-xs flex-col gap-2">
      <label htmlFor="bee-key" className="text-xs text-ink-300">
        Key
      </label>
      <input
        id="bee-key"
        name="key"
        type="password"
        required
        autoFocus
        autoComplete="current-password"
        className="border border-ink-300/40 bg-transparent px-3 py-2 text-bone outline-none focus:border-amber"
      />
      {state?.error && <p className="text-xs text-amber">{state.error}</p>}
      <button
        type="submit"
        disabled={pending}
        className="btn btn--ghost btn--sm mt-2 self-start disabled:opacity-60"
      >
        {pending ? "Checking" : "Open"}
      </button>
    </form>
  );
}
