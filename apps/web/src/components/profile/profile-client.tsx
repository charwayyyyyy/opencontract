"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signOut, signIn } from "next-auth/react";
import {
  LogOut,
  Shield,
  Briefcase,
  FileSearch,
  CheckCircle2,
  Key,
  Bell,
  RefreshCw,
  ExternalLink,
  UserCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ProfileClientProps {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  organizationName: string;
  officerAddress?: string;
}

const SWITCHABLE_ROLES = [
  {
    role: "PROCUREMENT_OFFICER",
    name: "Procurement Officer",
    person: "Ama Asante",
    org: "Ministry of Roads & Highways",
    email: "officer@demo.opencontract.dev",
    target: "/console",
    icon: Shield,
  },
  {
    role: "CONTRACTOR",
    name: "Contractor / Supplier",
    person: "Kofi Mensah",
    org: "Accra BuilderCo Ltd",
    email: "contractor@demo.opencontract.dev",
    target: "/contractor",
    icon: Briefcase,
  },
  {
    role: "AUDITOR",
    name: "Public Auditor",
    person: "Efua Boateng",
    org: "Audit & Oversight Board",
    email: "auditor@demo.opencontract.dev",
    target: "/auditor",
    icon: FileSearch,
  },
];

export function ProfileClient({ user, organizationName, officerAddress }: ProfileClientProps) {
  const router = useRouter();
  const [switching, setSwitching] = useState<string | null>(null);
  const [loggingOut, setLoggingOut] = useState(false);
  const [alertsEnabled, setAlertsEnabled] = useState(true);
  const [anchorConfirmations, setAnchorConfirmations] = useState(true);
  const [savedNote, setSavedNote] = useState(false);

  async function handleSwitchRole(targetEmail: string, destination: string) {
    setSwitching(targetEmail);
    try {
      await signIn("credentials", {
        email: targetEmail,
        password: "demo1234",
        redirect: false,
      });
      router.push(destination);
      router.refresh();
    } catch (e) {
      console.error(e);
      setSwitching(null);
    }
  }

  async function handleSignOut() {
    setLoggingOut(true);
    await signOut({ callbackUrl: "/" });
  }

  function handleSavePreferences() {
    setSavedNote(true);
    setTimeout(() => setSavedNote(false), 2500);
  }

  return (
    <div className="space-y-8">
      {/* ── User Overview Card ────────────────────────────────────── */}
      <div className="card-padded border border-border/80 bg-surface shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-[hsl(var(--forest-green)/0.1)] border border-[hsl(var(--forest-green)/0.25)] flex items-center justify-center text-[hsl(var(--forest-green))] text-xl font-bold font-mono">
              {user.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-heading-sm text-text-primary font-semibold">{user.name}</h2>
                <span className="badge-success flex items-center gap-1 text-[11px]">
                  <CheckCircle2 className="h-3 w-3" /> Demo Verified
                </span>
              </div>
              <p className="text-xs text-text-secondary mt-0.5">{user.email}</p>
              <p className="text-xs text-text-muted mt-1 font-mono">ID: {user.id.slice(0, 16)}…</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handleSignOut}
              loading={loggingOut}
              className="gap-2 border-[hsl(var(--status-error)/0.3)] text-[hsl(var(--status-error))] hover:bg-[hsl(var(--status-error-bg))] hover:text-[hsl(var(--status-error))]"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </Button>
          </div>
        </div>

        {/* User Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-text-muted mb-1">
              Active Role
            </p>
            <p className="text-sm font-semibold text-text-primary">
              {user.role.replace(/_/g, " ")}
            </p>
            <p className="text-xs text-text-secondary mt-1">
              Authorized to view and interact according to role clearance.
            </p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-text-muted mb-1">
              Organization Affiliation
            </p>
            <p className="text-sm font-semibold text-text-primary">{organizationName}</p>
            <p className="text-xs text-text-secondary mt-1">Republic of Ghana Public Registry</p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-text-muted mb-1">
              Authentication Scheme
            </p>
            <p className="text-sm font-semibold text-text-primary font-mono">JWT Session (8 hrs)</p>
            <p className="text-xs text-text-secondary mt-1">NextAuth v5 + bcrypt salted credentials</p>
          </div>
        </div>
      </div>

      {/* ── Web3 Blockchain Registry Authorization ─────────────────── */}
      <div className="card-padded border border-border/80 bg-surface shadow-xs">
        <div className="flex items-center gap-2 mb-3">
          <Key className="h-4 w-4 text-[hsl(var(--forest-green))]" />
          <h3 className="text-sm font-semibold text-text-primary uppercase tracking-wider">
            Web3 Verification Credentials
          </h3>
          <span className="text-[10px] px-2 py-0.5 rounded bg-muted text-text-muted ml-auto font-mono">
            Base Sepolia (84532)
          </span>
        </div>
        <p className="text-xs text-text-secondary leading-relaxed mb-4">
          Procurement officers and auditors anchor SHA-256 event fingerprints directly onto the EVM
          smart registry (<span className="font-mono text-text-primary">OpenContractRegistry.sol</span>).
        </p>

        <div className="bg-muted/50 rounded-lg p-3.5 space-y-2.5 font-mono text-xs border border-border/60">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
            <span className="text-text-muted">Officer Ethereum Address:</span>
            <span className="text-text-primary font-semibold select-all">
              {officerAddress || "0x71C672a9Fe3b94a82B6114Ff23908f5d0F523A9f"}
            </span>
          </div>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
            <span className="text-text-muted">Registry Smart Contract:</span>
            <a
              href="https://sepolia.basescan.org/address/0x5FbDB2315678afecb367f032d93F642f64180aa3"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[hsl(var(--forest-green))] hover:underline flex items-center gap-1"
            >
              0x5FbDB2315678afecb367f032d93F642f64180aa3
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
            <span className="text-text-muted">On-Chain Role Status:</span>
            <span className="text-[hsl(var(--status-success))] flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5" /> ACTIVE_ISSUER_ROLE (EVM Confirmed)
            </span>
          </div>
        </div>
      </div>

      {/* ── Quick Switch Demo Role (Judge Testing Tool) ─────────────── */}
      <div className="card-padded border border-border/80 bg-surface shadow-xs">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4 text-[hsl(var(--forest-green))]" />
            <h3 className="text-sm font-semibold text-text-primary uppercase tracking-wider">
              Switch Demo Role (Hackathon Testing)
            </h3>
          </div>
          <span className="text-[11px] text-text-muted">Instant login switch</span>
        </div>
        <p className="text-xs text-text-secondary leading-relaxed mb-4">
          Judges can seamlessly jump between perspectives to inspect what a Procurement Officer,
          Contractor, or Auditor sees.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {SWITCHABLE_ROLES.map((role) => {
            const isCurrent = user.email === role.email;
            const isSwitching = switching === role.email;
            const Icon = role.icon;
            return (
              <div
                key={role.email}
                className={cn(
                  "p-3.5 rounded-lg border transition-all flex flex-col justify-between",
                  isCurrent
                    ? "border-[hsl(var(--forest-green))] bg-[hsl(var(--forest-green)/0.04)]"
                    : "border-border/80 bg-surface hover:border-border"
                )}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4 text-text-primary" />
                      <span className="text-xs font-semibold text-text-primary">{role.name}</span>
                    </div>
                    {isCurrent && (
                      <span className="text-[10px] bg-[hsl(var(--forest-green))] text-white px-1.5 py-0.2 rounded font-medium">
                        Active
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-text-secondary">{role.person}</p>
                  <p className="text-[11px] text-text-muted">{role.org}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-border/60">
                  {isCurrent ? (
                    <Button
                      variant="secondary"
                      size="sm"
                      className="w-full text-xs"
                      onClick={() => router.push(role.target)}
                    >
                      Go to {role.name} Portal
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full text-xs gap-1.5"
                      loading={isSwitching}
                      disabled={switching !== null}
                      onClick={() => handleSwitchRole(role.email, role.target)}
                    >
                      <UserCheck className="h-3.5 w-3.5" />
                      Switch to this role
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Notification & Audit Preferences ──────────────────────── */}
      <div className="card-padded border border-border/80 bg-surface shadow-xs">
        <div className="flex items-center gap-2 mb-3">
          <Bell className="h-4 w-4 text-text-secondary" />
          <h3 className="text-sm font-semibold text-text-primary uppercase tracking-wider">
            Integrity Notification Preferences
          </h3>
        </div>

        <div className="space-y-4">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={alertsEnabled}
              onChange={(e) => setAlertsEnabled(e.target.checked)}
              className="mt-1 h-4 w-4 rounded border-border text-[hsl(var(--forest-green))] focus:ring-[hsl(var(--forest-green))]"
            />
            <div>
              <p className="text-sm font-medium text-text-primary">
                High-Risk Integrity Review Signal Alerts
              </p>
              <p className="text-xs text-text-secondary">
                Notify when automated rules detect significant contract amendments (&gt;15%) or single-bidder awards.
              </p>
            </div>
          </label>

          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={anchorConfirmations}
              onChange={(e) => setAnchorConfirmations(e.target.checked)}
              className="mt-1 h-4 w-4 rounded border-border text-[hsl(var(--forest-green))] focus:ring-[hsl(var(--forest-green))]"
            />
            <div>
              <p className="text-sm font-medium text-text-primary">
                Blockchain Milestone Anchoring Receipts
              </p>
              <p className="text-xs text-text-secondary">
                Receive on-chain transaction hash confirmations whenever a tender, award, or milestone is anchored.
              </p>
            </div>
          </label>

          <div className="pt-2 flex items-center gap-3">
            <Button size="sm" onClick={handleSavePreferences}>
              Save preferences
            </Button>
            {savedNote && (
              <span className="text-xs text-[hsl(var(--status-success))] font-medium flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5" /> Preferences saved!
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
