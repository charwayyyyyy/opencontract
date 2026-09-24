/** @type {import('next').NextConfig} */
const nextConfig = {
  typedRoutes: false,
  serverExternalPackages: ["@prisma/client"],
  transpilePackages: [
    "@opencontract/database",
    "@opencontract/types",
    "@opencontract/validation",
  ],
  images: {
    remotePatterns: [],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
