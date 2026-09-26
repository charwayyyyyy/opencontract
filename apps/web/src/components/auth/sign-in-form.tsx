"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { Shield, Briefcase, FileSearch, ArrowRight, CheckCircle2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert } from "@/components/ui/states";
import { cn } from "@/lib/utils";

interface DemoRole {
  id: string;
  name: string;
  role: string;
  person: string;
  org: string;
  email: string;
  target: string;
  badge: string;
  icon: typeof Shield;
}

const DEMO_ROLES: DemoRole[] = [
  {
    id: "officer",
    name: "Procurement Officer",
    role: "PROCUREMENT_OFFICER",
    person: "Ama Asante",
    org: "Ministry of Roads and Highways",
    email: "officer@demo.opencontract.dev",
    target: "/console",
    badge: "Issuing Authority",
    icon: Shield,
  },
  {
    id: "contractor",
    name: "Contractor / Supplier",
    role: "CONTRACTOR",
    person: "Kofi Mensah",
    org: "Accra BuilderCo Ltd",
    email: "contractor@demo.opencontract.dev",
    target: "/contractor",
    badge: "Bidding Entity",
    icon: Briefcase,
  },
  {
    id: "auditor",
    name: "Public Auditor",
    role: "AUDITOR",
    person: "Efua Boateng",
    org: "Audit & Oversight Board",
    email: "auditor@demo.opencontract.dev",
    target: "/auditor",
    badge: "Independent Oversight",
    icon: FileSearch,
  },
];

export function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeRoleLoading, setActiveRoleLoading] = useState<string | null>(null);

  async function handleQuickSignIn(role: DemoRole) {
    setError(null);
    setActiveRoleLoading(role.id);

    try {
      const result = await signIn("credentials", {
        email: role.email,
        password: "demo1234",
        redirect: false,
      });

      if (result?.error) {
        setError(`Could not sign in: ${result.error}. (Please verify database seeding)`);
      } else {
        const dest = callbackUrl || role.target;
        router.push(dest);
        router.refresh();
      }
    } catch {
      setError("Sign-in request failed. Please try again.");
    } finally {
      setActiveRoleLoading(null);
    }
  }

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
        setError("Incorrect email or password. Please try again.");
      } else {
        const dest = callbackUrl || "/dashboard";
        router.push(dest);
        router.refresh();
      }
    } catch {
      setError("Sign-in failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="error">
          <p>{error}</p>
        </Alert>
      )}

      {/* ── 1-Click Demo Login for Hackathon Judges ───────────────── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-wider text-text-muted">
            Instant Demo Logins (Judges)
          </p>
          <span className="text-[11px] text-[hsl(var(--forest-green))] font-medium flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3" /> 1-Click Access
          </span>
        </div>

        <div className="space-y-2.5">
          {DEMO_ROLES.map((role) => {
            const Icon = role.icon;
            const isThisLoading = activeRoleLoading === role.id;
            return (
              <button
                key={role.id}
                type="button"
                onClick={() => handleQuickSignIn(role)}
                disabled={loading || activeRoleLoading !== null}
                className={cn(
                  "w-full text-left p-3 rounded-lg border border-border/80 bg-surface hover:border-[hsl(var(--forest-green)/0.4)] hover:bg-[hsl(var(--forest-green)/0.03)] transition-all flex items-center justify-between group cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-xs",
                  isThisLoading && "border-[hsl(var(--forest-green))] bg-[hsl(var(--forest-green)/0.06)]"
                )}
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-md bg-muted flex items-center justify-center text-text-primary group-hover:bg-[hsl(var(--forest-green)/0.12)] group-hover:text-[hsl(var(--forest-green))] transition-colors flex-shrink-0 mt-0.5">
                    <Icon className="h-4 w-4 stroke-[1.75]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-text-primary group-hover:text-[hsl(var(--forest-green))] transition-colors">
                        {role.name}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-muted text-text-muted font-normal">
                        {role.badge}
                      </span>
                    </div>
                    <p className="text-xs text-text-secondary mt-0.5">
                      {role.person} · <span className="text-text-muted">{role.org}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-xs font-medium text-text-muted group-hover:text-[hsl(var(--forest-green))] transition-colors flex-shrink-0 ml-2">
                  <span>{isThisLoading ? "Signing in…" : "Launch"}</span>
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="relative flex items-center justify-center">
        <div className="border-t border-border w-full" />
        <span className="bg-background px-3 text-xs text-text-muted uppercase tracking-wider absolute">
          or sign in manually
        </span>
      </div>

      {/* ── Standard Manual Sign-in ─────────────────────────────── */}
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
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
            disabled={loading || activeRoleLoading !== null}
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
            disabled={loading || activeRoleLoading !== null}
            error={!!error}
          />
        </div>

        <Button
          type="submit"
          className="w-full gap-2"
          loading={loading}
          disabled={activeRoleLoading !== null}
          aria-describedby={error ? "sign-in-error" : undefined}
        >
          <Lock className="h-3.5 w-3.5" />
          Sign in with credentials
        </Button>
      </form>
    </div>
  );
}
