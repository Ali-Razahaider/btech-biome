"use client";

import { FormEvent, useEffect, useState } from "react";
import { supabase, getDisplayName } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session?.user) {
        const displayName = getDisplayName(session.user);
        console.log("Authenticated user:", displayName);
        setMessage(`Signed in as ${displayName}`);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setMessage(error.message);
        return;
      }

      const user = data.user;
      if (user) {
        const displayName = getDisplayName(user);
        console.log("Authenticated user:", displayName);
        setMessage(`Signed in as ${displayName}`);
        router.push("/");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#0B0B0C] px-6 py-12 text-white sm:px-10 lg:px-16">
      <section className="mx-auto grid min-h-[calc(100vh-6rem)] max-w-6xl items-center gap-10 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-2xl shadow-black/40 backdrop-blur-xl sm:p-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(85,214,136,0.22),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(149,125,192,0.18),_transparent_32%)]" />
          <div className="relative">
            <p className="mb-3 text-sm font-medium uppercase tracking-[0.3em] text-[#55D688]">
              GreenPulse Auth
            </p>
            <h1 className="max-w-xl text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              Sign in to continue your sustainability dashboard.
            </h1>
            <p className="mt-4 max-w-lg text-sm leading-7 text-white/70 sm:text-base">
              Authenticate with Supabase, keep the session alive in the browser,
              and log the signed-in user&apos;s name as soon as login succeeds.
            </p>

            <form className="mt-8 space-y-4 max-w-lg" onSubmit={handleSubmit}>
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-white/80">
                  Email
                </span>
                <input
                  className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none transition placeholder:text-white/30 focus:border-[#55D688]"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-white/80">
                  Password
                </span>
                <input
                  className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none transition placeholder:text-white/30 focus:border-[#55D688]"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                />
              </label>

              <button
                type="submit"
                disabled={loading}
                className="inline-flex w-full items-center justify-center rounded-2xl bg-[#55D688] px-5 py-3 text-sm font-semibold text-[#0B0B0C] transition-transform hover:scale-[0.99] active:scale-95 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>

              {message ? (
                <p className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white/80">
                  {message}
                </p>
              ) : null}
            </form>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-[2rem] border border-[#55D688]/30 bg-[#1C1D1F] p-8 shadow-2xl shadow-black/50 sm:p-10">
          <div className="absolute -left-16 -top-16 h-48 w-48 rounded-full bg-[#55D688]/20 blur-3xl" />
          <div className="absolute -bottom-20 right-0 h-60 w-60 rounded-full bg-[#957DC0]/20 blur-3xl" />
          <div className="relative space-y-6">
            <p className="text-sm uppercase tracking-[0.3em] text-white/45">
              Session Preview
            </p>
            <div className="rounded-3xl border border-white/10 bg-black/30 p-5">
              <div className="text-xs uppercase tracking-[0.25em] text-white/40">
                Auth state
              </div>
              <div className="mt-3 text-lg font-medium text-white">
                Session persists in the browser via Supabase Auth.
              </div>
              <div className="mt-2 text-sm leading-6 text-white/65">
                After a successful login, the authenticated user name is printed
                to the console and the session can be reused across the app.
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border border-white/10 bg-black/20 p-4">
                <div className="text-xs uppercase tracking-[0.25em] text-white/40">
                  Login
                </div>
                <div className="mt-2 text-white/80">Email + password</div>
              </div>
              <div className="rounded-3xl border border-white/10 bg-black/20 p-4">
                <div className="text-xs uppercase tracking-[0.25em] text-white/40">
                  Output
                </div>
                <div className="mt-2 text-white/80">Console logs user name</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
