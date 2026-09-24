import type { Metadata } from "next";
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
          <SignInForm />
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
