"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, Search, LogIn, User as UserIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";

const publicNavItems = [
  { href: "/explore", label: "Explore" },
  { href: "/verify", label: "Verify" },
  { href: "/signals", label: "Signals" },
  { href: "/analyst", label: "AI Analyst" },
  { href: "/organizations", label: "Organizations" },
  { href: "/about", label: "About" },
] as const;

function roleConsoleHref(role: string): string {
  if (role === "PROCUREMENT_OFFICER" || role === "EVALUATOR") return "/console";
  if (role === "CONTRACTOR") return "/contractor";
  if (role === "AUDITOR") return "/auditor";
  if (role === "ADMIN") return "/console";
  return "/dashboard";
}

function roleConsoleLabel(role: string): string {
  if (role === "PROCUREMENT_OFFICER" || role === "EVALUATOR") return "Console";
  if (role === "CONTRACTOR") return "My Portal";
  if (role === "AUDITOR") return "Audit Console";
  if (role === "ADMIN") return "Admin";
  return "Dashboard";
}

export function SiteHeader() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-surface/95 backdrop-blur-sm border-b border-border">
      <div className="container-wide">
        <div className="flex h-14 items-center justify-between gap-4">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2.5 flex-shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
            aria-label="OpenContract home"
          >
            <div className="relative h-7 w-7">
              <Image
                src="/logo.png"
                alt=""
                fill
                className="object-contain"
                priority
              />
            </div>
            <span className="font-semibold text-text-primary text-sm tracking-tight">
              OpenContract
            </span>
          </Link>

          {/* Desktop nav */}
          <nav
            className="hidden md:flex items-center gap-0.5"
            aria-label="Main navigation"
          >
            {publicNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "nav-link rounded px-3 py-1.5",
                  pathname.startsWith(item.href) && "nav-link-active bg-muted"
                )}
                aria-current={pathname.startsWith(item.href) ? "page" : undefined}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* Search shortcut */}
            <Link
              href="/explore"
              className="hidden sm:flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary transition-colors px-2 py-1"
              aria-label="Search procurements"
            >
              <Search className="h-4 w-4" aria-hidden />
              <span className="hidden lg:inline text-xs text-text-muted border border-border rounded px-1.5 py-0.5">
                /
              </span>
            </Link>

            {/* Auth */}
            {session?.user ? (
              <div className="flex items-center gap-2">
                <Link
                  href={roleConsoleHref(session.user.role)}
                  className="hidden sm:block"
                >
                  <Button size="sm" variant="secondary">
                    {roleConsoleLabel(session.user.role)}
                  </Button>
                </Link>
                <Link href="/profile">
                  <Button size="icon-sm" variant="ghost" aria-label="Profile">
                    <UserIcon className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            ) : (
              <Link href="/auth/signin">
                <Button size="sm" variant="secondary">
                  <LogIn className="h-3.5 w-3.5" aria-hidden />
                  Sign in
                </Button>
              </Link>
            )}

            {/* Mobile menu toggle */}
            <Button
              size="icon-sm"
              variant="ghost"
              className="md:hidden"
              onClick={() => setMobileOpen((p) => !p)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav"
            >
              {mobileOpen ? (
                <X className="h-4 w-4" aria-hidden />
              ) : (
                <Menu className="h-4 w-4" aria-hidden />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile nav */}
        {mobileOpen && (
          <nav
            id="mobile-nav"
            className="md:hidden border-t border-border py-3 space-y-0.5 animate-slide-down"
            aria-label="Mobile navigation"
          >
            {publicNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center px-3 py-2.5 text-sm font-medium rounded",
                  pathname.startsWith(item.href)
                    ? "bg-muted text-text-primary"
                    : "text-text-secondary hover:text-text-primary hover:bg-muted"
                )}
                aria-current={pathname.startsWith(item.href) ? "page" : undefined}
              >
                {item.label}
              </Link>
            ))}
            {session?.user ? (
              <Link
                href={roleConsoleHref(session.user.role)}
                onClick={() => setMobileOpen(false)}
                className="flex items-center px-3 py-2.5 text-sm font-medium text-primary"
              >
                {roleConsoleLabel(session.user.role)}
              </Link>
            ) : (
              <Link
                href="/auth/signin"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-primary"
              >
                <LogIn className="h-4 w-4" aria-hidden />
                Sign in
              </Link>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}
