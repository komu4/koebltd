import Image from "next/image";
import Link from "next/link";
import { MapPin, Phone, Mail, Globe, Instagram, Linkedin, Facebook } from "lucide-react";
import Container from "@/components/ui/Container";

// lucide-react has no official WhatsApp glyph, so it's drawn as a small inline SVG
// (kept visually consistent with the other lucide icons used here: 18px, stroke-based).
function WhatsAppIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.28-1.38a9.9 9.9 0 0 0 4.76 1.21h.01c5.46 0 9.9-4.45 9.9-9.91C21.96 6.45 17.5 2 12.04 2Zm0 18.02h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.13.82.84-3.05-.2-.31a8.14 8.14 0 0 1-1.26-4.34c0-4.51 3.68-8.19 8.2-8.19 2.19 0 4.25.85 5.79 2.4a8.12 8.12 0 0 1 2.4 5.8c0 4.51-3.68 8.2-8.14 8.2Zm4.48-6.14c-.25-.12-1.45-.71-1.67-.8-.22-.08-.39-.12-.55.13-.16.24-.63.79-.78.96-.14.16-.29.18-.53.06-.25-.12-1.04-.38-1.98-1.22-.73-.65-1.23-1.46-1.37-1.7-.14-.25-.02-.38.11-.5.11-.11.25-.29.37-.43.12-.14.16-.25.25-.41.08-.16.04-.31-.02-.43-.06-.12-.55-1.32-.75-1.81-.2-.48-.4-.41-.55-.42h-.47c-.16 0-.43.06-.65.31-.22.25-.86.84-.86 2.04s.88 2.37 1 2.53c.12.16 1.73 2.64 4.19 3.7.59.25 1.05.4 1.4.51.59.19 1.13.16 1.55.1.47-.07 1.45-.59 1.65-1.16.2-.57.2-1.06.14-1.16-.06-.11-.22-.17-.47-.29Z" />
    </svg>
  );
}

type FooterProps = {
  whatsapp?: string | null;
  facebookUrl?: string | null;
  instagramUrl?: string | null;
  linkedinUrl?: string | null;
};

export default function Footer({
  whatsapp,
  facebookUrl,
  instagramUrl,
  linkedinUrl,
}: FooterProps = {}) {
  const socialLinks = [
    { label: "Instagram", href: instagramUrl || "https://www.instagram.com/koebindustrialsolutionsltd/", Icon: Instagram },
    { label: "WhatsApp", href: `https://wa.me/${whatsapp || "2347070070996"}`, Icon: WhatsAppIcon },
    { label: "LinkedIn", href: linkedinUrl || "https://www.linkedin.com/company/105698550/admin/edit/?editPageActiveTab=info", Icon: Linkedin },
    { label: "Facebook", href: facebookUrl || "https://www.facebook.com/profile.php?id=61573895350637", Icon: Facebook },
  ];

  return (
    <footer className="bg-brand-dark text-white">
      <Container className="grid grid-cols-1 gap-10 py-16 md:grid-cols-4 md:gap-8">
        <div>
          <div className="relative h-10 w-32 mb-4">
            <Image src="/images/koeb-logo.png" alt="KOEB" fill className="object-contain object-left" />
          </div>
          <p className="text-sm leading-relaxed text-gray-400">
            KOEB provides reliable air filtration and compression solutions for industries that
            demand quality, efficiency and performance.
          </p>
        </div>

        <div>
          <h3 className="font-heading font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sm text-gray-400">
            <li><Link href="/" className="hover:text-brand-red">Home</Link></li>
            <li><Link href="/products" className="hover:text-brand-red">Products</Link></li>
            <li><Link href="/about" className="hover:text-brand-red">About Us</Link></li>
            <li><Link href="/services" className="hover:text-brand-red">Services</Link></li>
            <li><Link href="/partners" className="hover:text-brand-red">Partners</Link></li>
            <li><Link href="/contact" className="hover:text-brand-red">Contact Us</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-heading font-semibold mb-4">Products</h3>
          <ul className="space-y-2 text-sm text-gray-400">
            <li><Link href="/products?category=air-filters" className="hover:text-brand-red">Air Filters</Link></li>
            <li><Link href="/products?category=air-compressors" className="hover:text-brand-red">Air Compressors</Link></li>
            <li><Link href="/products?category=compressor-parts" className="hover:text-brand-red">Compressor Parts</Link></li>
            <li><Link href="/products?category=accessories" className="hover:text-brand-red">Accessories</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-heading font-semibold mb-4">Contact Us</h3>
          <ul className="space-y-3 text-sm text-gray-400">
            <li className="flex gap-2"><MapPin size={18} className="shrink-0 text-brand-red" /> 19, Mojidi Street, Off Toyin Street, Ikeja, Lagos, Nigeria</li>
            <li className="flex gap-2"><Phone size={18} className="shrink-0 text-brand-red" /> 08023508817, 08031335765, 08038672377</li>
            <li className="flex gap-2"><Mail size={18} className="shrink-0 text-brand-red" /> info@koebltd.com</li>
            <li className="flex gap-2"><Globe size={18} className="shrink-0 text-brand-red" /> www.koebltd.com</li>
          </ul>
        </div>
      </Container>

      <div className="border-t border-white/10 py-5">
        <Container className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <p className="text-center text-xs text-gray-500 sm:text-left">
            © {new Date().getFullYear()} KOEB. All Rights Reserved.
          </p>
          <div className="flex items-center gap-3" aria-label="Social media links">
            {socialLinks.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="flex h-9 w-9 items-center justify-center border border-white/20 rounded-full bg-white/10 backdrop-blur-lg shadow-lg transition-all duration-300 hover:-translate-x-1 hover:bg-brand-red hover:shadow-lg sm:h-11 sm:w-11"
              >
                <Icon size={16} />
              </a>
            ))}
          </div>
        </Container>
      </div>
    </footer>
  );
}
