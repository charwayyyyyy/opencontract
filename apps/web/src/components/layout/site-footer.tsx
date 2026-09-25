import Link from "next/link";

const footerLinks = {
  Explore: [
    { label: "Browse contracts", href: "/explore" },
    { label: "Verify a document", href: "/verify" },
    { label: "Review signals", href: "/signals" },
    { label: "Organizations", href: "/organizations" },
  ],
  Reference: [
    { label: "About", href: "/about" },
    { label: "Methodology", href: "/methodology" },
    { label: "Limitations", href: "/limitations" },
    { label: "Documentation", href: "/docs" },
  ],
  Technical: [
    { label: "API reference", href: "/docs/api" },
    { label: "OCDS data", href: "/ocds/releases" },
    { label: "GitHub", href: "https://github.com/charwayyyyyy/opencontract" },
  ],
} as const;

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-surface mt-16">
      <div className="container-wide py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <p className="font-semibold text-text-primary mb-2">OpenContract</p>
            <p className="text-sm text-text-secondary leading-relaxed">
              Public money should leave a public trail.
            </p>
            <p className="text-xs text-text-muted mt-3">
              Built for the public interest.
            </p>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section}>
              <p className="text-xs font-medium uppercase tracking-wide text-text-secondary mb-3">
                {section}
              </p>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-text-secondary hover:text-text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="mt-10 pt-6 border-t border-border flex flex-col sm:flex-row justify-between gap-4">
          <div className="space-y-1">
            <p className="text-xs text-text-muted">
              Demo environment — data shown is fictional unless explicitly stated.
            </p>
            <p className="text-xs text-text-muted">
              Blockchain verification powered by an EVM testnet. Blockchain anchoring
              does not independently verify the truthfulness of submitted information.
            </p>
          </div>
          <p className="text-xs text-text-muted whitespace-nowrap">
            © {new Date().getFullYear()} OpenContract
          </p>
        </div>
      </div>
    </footer>
  );
}
