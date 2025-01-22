"use client";

import { useState } from "react";
import { register } from "@/lib/actions/auth";

export function RegisterForm() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  async function onSubmit(formData: FormData) {
    setError(null);
    setSuccess(null);
    setIsPending(true);

    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const result = await register({ name, email, password });

    setIsPending(false);

    if (result?.error) {
      setError(result.error);
    }

    if (result?.success) {
      setSuccess(result.success);
    }
  }

  return (
    <div className="space-y-6">
      <form action={onSubmit}>
        <div className="space-y-4">
          <div>
            <label htmlFor="name">Name</label>
            <input id="name" name="name" type="text" required />
          </div>
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
        {success && <div className="text-green-500">{success}</div>}
        <button type="submit" disabled={isPending}>
          {isPending ? "Creating account..." : "Register"}
        </button>
      </form>
    </div>
  );
}
