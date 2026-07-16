import type { Metadata } from "next";
import { Montserrat, Inter } from "next/font/google";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SocialFloat from "@/components/layout/SocialFloat";
import { prisma } from "@/lib/prisma";
import "../globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-montserrat",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.koebltd.com"),
  title: {
    default: "KOEB | Air Filters & Air Compressors",
    template: "%s | KOEB",
  },
  description:
    "KOEB is a trusted supplier of high quality air filters, air compressors, compressor parts and industrial accessories built for reliability and efficiency.",
  openGraph: {
    title: "KOEB | Air Filters & Air Compressors",
    description:
      "High quality air filters and air compressors built for reliability and efficiency.",
    url: "https://www.koebltd.com",
    siteName: "KOEB",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "KOEB | Air Filters & Air Compressors",
    description:
      "High quality air filters and air compressors built for reliability and efficiency.",
  },
};

async function getSocialSettings() {
  try {
    return await prisma.settings.findUnique({ where: { id: "settings" } });
  } catch {
    return null;
  }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSocialSettings();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "KOEB",
    url: "https://www.koebltd.com",
    logo: "https://www.koebltd.com/images/koeb-logo.png",
    description:
      "KOEB supplies air filters, air compressors, compressor parts and industrial accessories.",
  };

  return (
    <html lang="en" className={`${montserrat.variable} ${inter.variable}`}>
      <body className="font-body antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Navbar />
        <main>{children}</main>
        <Footer />
        <SocialFloat
          whatsapp={settings?.whatsapp}
          facebookUrl={settings?.facebookUrl}
          instagramUrl={settings?.instagramUrl}
          linkedinUrl={settings?.linkedinUrl}
        />
      </body>
    </html>
  );
}
