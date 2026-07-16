import Image from "next/image";
import Link from "next/link";
import { MapPin, Phone, Mail, Globe } from "lucide-react";
import Container from "@/components/ui/Container";

export default function Footer() {
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
        <p className="text-center text-xs text-gray-500">
          © {new Date().getFullYear()} KOEB. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}
