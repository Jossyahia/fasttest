"use client";

import { useState } from "react";
import { login } from "@/lib/actions/auth";
import { signIn } from "next-auth/react";

export function LoginForm() {
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  async function onSubmit(formData: FormData) {
    setError(null);
    setIsPending(true);

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const result = await login({ email, password });

    setIsPending(false);

    if (result?.error) {
      setError(result.error);
    }
  }

  return (
    <div className="space-y-6">
      <form action={onSubmit}>
        <div className="space-y-4">
          <div>
            <label htmlFor="email">Email</label>
            <input id="email" name="email" type="email" required />
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <input id="password" name="password" type="password" required />
          </div>
        </div>
        {error && <div className="text-red-500">{error}</div>}
        <button type="submit" disabled={isPending}>
          {isPending ? "Loading..." : "Login"}
        </button>
      </form>
      <div>
        <button onClick={() => signIn("google", { callbackUrl: "/dashboard" })}>
          Continue with Google
        </button>
      </div>
    </div>
  );
}
