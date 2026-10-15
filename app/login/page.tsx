"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage("");
    const { error } = await createClient().auth.signInWithPassword({ email, password });
    if (error) { setMessage(error.message); setIsSubmitting(false); return; }
    router.replace("/admin");
    router.refresh();
  }

  return <main className="grid min-h-screen place-items-center p-6"><form onSubmit={submit} className="w-full max-w-sm rounded-2xl bg-white p-7 shadow-sm"><h1 className="text-2xl font-bold">Admin sign in</h1><p className="mt-2 text-sm text-stone-600">Use your administrator email and password.</p><label className="mt-6 block text-sm font-semibold">Email<input required type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-2 w-full rounded-lg border p-3" /></label><label className="mt-4 block text-sm font-semibold">Password<input required type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-2 w-full rounded-lg border p-3" /></label><button disabled={isSubmitting} className="mt-5 w-full rounded-lg bg-stone-900 p-3 font-semibold text-white disabled:opacity-60">{isSubmitting ? "Signing in…" : "Sign in"}</button>{message && <p role="alert" className="mt-4 text-sm text-red-700">{message}</p>}</form></main>;
}
