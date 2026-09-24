"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert } from "@/components/ui/states";

export function SignInForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(
          "Incorrect email or password. Please try again."
        );
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch {
      setError("Sign-in failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      {error && (
        <Alert variant="error">
          <p>{error}</p>
        </Alert>
      )}

      <div className="field-group">
        <label htmlFor="email" className="field-label">
          Email address
        </label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="name@organization.gov.gh"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={loading}
          error={!!error}
        />
      </div>

      <div className="field-group">
        <label htmlFor="password" className="field-label">
          Password
        </label>
        <Input
          id="password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={loading}
          error={!!error}
        />
      </div>

      <Button
        type="submit"
        className="w-full"
        loading={loading}
        aria-describedby={error ? "sign-in-error" : undefined}
      >
        Sign in
      </Button>

      {/* Demo credentials hint */}
      <div className="rounded-md bg-muted p-3">
        <p className="text-xs font-medium text-text-secondary mb-1.5">
          Demo credentials
        </p>
        <div className="space-y-1 text-xs text-text-muted font-mono">
          <p>officer@demo.opencontract.dev</p>
          <p>contractor@demo.opencontract.dev</p>
          <p>auditor@demo.opencontract.dev</p>
          <p className="text-text-secondary">Password: demo1234</p>
        </div>
      </div>
    </form>
  );
}
