import type { Metadata, Viewport } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import "@/styles/globals.css";
import { SessionProvider } from "@/components/auth/session-provider";
import { DemoBanner } from "@/components/ui/demo-banner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "OpenContract — Public Procurement Transparency",
    template: "%s | OpenContract",
  },
  description:
    "OpenContract makes public procurement easier to trace, understand and independently verify — from tender publication to contract completion.",
  keywords: [
    "procurement transparency",
    "public contracts",
    "blockchain verification",
    "Ghana procurement",
    "OCDS",
    "accountability",
  ],
  authors: [{ name: "OpenContract" }],
  creator: "OpenContract",
  openGraph: {
    type: "website",
    locale: "en_GH",
    url: "https://opencontract.dev",
    siteName: "OpenContract",
    title: "OpenContract — Public Procurement Transparency",
    description:
      "Public money should leave a public trail. OpenContract makes procurement records easier to trace, verify and audit.",
  },
  twitter: {
    card: "summary_large_image",
    title: "OpenContract — Public Procurement Transparency",
    description: "Public money should leave a public trail.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#F7F7F4",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <body
        className="min-h-screen bg-background text-foreground antialiased"
        suppressHydrationWarning
      >
        <SessionProvider>
          <DemoBanner />
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
