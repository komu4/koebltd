"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { clsx } from "clsx";
import Container from "@/components/ui/Container";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  { label: "About Us", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Partners", href: "/partners" },
  { label: "Contact Us", href: "/contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header
      className={clsx(
        "sticky top-0 z-50 w-full bg-white transition-shadow duration-300",
        scrolled ? "shadow-md" : "shadow-none"
      )}
    >
      <Container className="flex h-20 items-center justify-between">
        <Link href="/" className="relative block h-10 w-32 shrink-0">
          <Image
            src="/images/koeb-logo.png"
            alt="KOEB"
            fill
            className="object-contain object-left"
            priority
          />
        </Link>

        <nav className="hidden md:flex md:items-center md:gap-8">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  "relative font-heading text-[15px] font-semibold pb-1 transition-colors",
                  active ? "text-brand-red" : "text-brand-text hover:text-brand-red"
                )}
              >
                {item.label}
                {active && (
                  <span className="absolute -bottom-0.5 left-0 h-[2px] w-full bg-brand-red" />
                )}
              </Link>
            );
          })}
        </nav>

        <button
          aria-label="Toggle navigation menu"
          className="md:hidden"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={26} /> : <Menu size={26} />}
        </button>
      </Container>

      <div
        className={clsx(
          "md:hidden overflow-hidden bg-white transition-[max-height] duration-300 ease-in-out",
          open ? "max-h-96 border-t border-brand-border" : "max-h-0"
        )}
      >
        <nav className="flex flex-col px-5 py-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "py-3 font-heading font-semibold text-base",
                pathname === item.href ? "text-brand-red" : "text-brand-text"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
