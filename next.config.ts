import type { NextConfig } from "next";

// ---------------------------------------------------------------------------
// Security headers applied to every response
// ---------------------------------------------------------------------------
const securityHeaders = [
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      // Scripts: self + Next.js inline runtime (nonce not used here, so unsafe-inline needed for Next.js hydration)
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      // Styles: self + inline (Tailwind injects inline styles)
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      // Fonts
      "font-src 'self' https://fonts.gstatic.com",
      // Images: self + Cloudinary + Unsplash (used in next/image remotePatterns)
      "img-src 'self' blob: data: https://res.cloudinary.com https://images.unsplash.com",
      // Frames: only Google Maps embed
      "frame-src https://www.google.com",
      // Connections: self + Cloudinary upload endpoint
      "connect-src 'self' https://api.cloudinary.com https://res.cloudinary.com",
      // Disallow plugins entirely
      "object-src 'none'",
      // Base URI restricted to self
      "base-uri 'self'",
      // Form submissions must go to same origin
      "form-action 'self'",
      // Upgrade insecure requests in production
      "upgrade-insecure-requests",
    ]
      .join("; ")
      .trim(),
  },

  // 4. X-Frame-Options — prevents clickjacking
  // SAMEORIGIN allows Google Maps embed in your own pages while blocking third-party framing.
  {
    key: "X-Frame-Options",
    value: "SAMEORIGIN",
  },

  // 5. X-Content-Type-Options — prevents MIME-type sniffing
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },

  // 6. Referrer-Policy — only send referrer to same origin; strips it for cross-origin
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },

  // 7. Permissions-Policy — opt out of browser features the site does not use
  {
    key: "Permissions-Policy",
    value: [
      "camera=()",
      "microphone=()",
      "geolocation=()",
      "payment=()",
      "usb=()",
      "magnetometer=()",
      "gyroscope=()",
      "accelerometer=()",
    ].join(", "),
  },

  // Strict-Transport-Security (bonus) — enforces HTTPS for 1 year
  {
    key: "Strict-Transport-Security",
    value: "max-age=31536000; includeSubDomains; preload",
  },
];

const nextConfig: NextConfig = {
images: {
  remotePatterns: [
    { protocol: "https", hostname: "res.cloudinary.com" },
    { protocol: "https", hostname: "images.unsplash.com" },
  ],
},

  // Apply security headers to all routes
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
