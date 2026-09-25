import type { Metadata } from "next";
import { Suspense } from "react";
import { SignInForm } from "@/components/auth/sign-in-form";

export const metadata: Metadata = {
  title: "Sign in",
};

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-border bg-surface">
        <a href="/" className="text-sm font-medium text-text-secondary hover:text-text-primary">
          ← OpenContract
        </a>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-sm">
          <div className="mb-8">
            <h1 className="text-heading-lg text-text-primary mb-2">Sign in</h1>
            <p className="text-sm text-text-secondary">
              Enter your credentials to access your portal.
            </p>
          </div>
          <Suspense fallback={<SignInFormSkeleton />}>
            <SignInForm />
          </Suspense>
          <div className="mt-8 border-t border-border pt-6">
            <p className="text-xs text-text-muted leading-relaxed">
              This is a demo environment. All accounts, data, and blockchain records
              are for demonstration purposes only. Do not enter real personal
              credentials.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function SignInFormSkeleton() {
  return (
    <div className="space-y-6" aria-hidden>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="skeleton h-3 w-40 rounded" />
          <div className="skeleton h-3 w-20 rounded" />
        </div>
        <div className="space-y-2.5">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="w-full p-3 rounded-lg border border-border/80 bg-surface flex items-center justify-between">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-md bg-muted skeleton" />
                <div className="space-y-1.5">
                  <div className="skeleton h-4 w-32 rounded" />
                  <div className="skeleton h-3 w-40 rounded" />
                </div>
              </div>
              <div className="skeleton h-3 w-14 rounded" />
            </div>
          ))}
        </div>
      </div>
      <div className="relative flex items-center justify-center">
        <div className="border-t border-border w-full" />
        <span className="bg-background px-3 text-xs text-text-muted uppercase tracking-wider absolute">
          or sign in manually
        </span>
      </div>
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="skeleton h-3 w-24 rounded" />
          <div className="skeleton h-9 w-full rounded-md" />
        </div>
        <div className="space-y-2">
          <div className="skeleton h-3 w-20 rounded" />
          <div className="skeleton h-9 w-full rounded-md" />
        </div>
        <div className="skeleton h-10 w-full rounded-md" />
      </div>
    </div>
  );
}
