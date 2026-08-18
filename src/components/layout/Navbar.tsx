"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { clsx } from "clsx";
import { motion, useReducedMotion } from "framer-motion";
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
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrolled(window.scrollY > 12);
          ticking = false;
        });
        ticking = true;
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header
      className={clsx(
        "sticky top-0 z-50 w-full transition-[background-color,box-shadow,border-color,backdrop-filter,transform] duration-500 ease-out",
        scrolled
          ? "border-b border-white/20 bg-white/75 shadow-[0_8px_30px_rgba(0,0,0,0.08)] backdrop-blur-xl"
          : "border-b border-transparent bg-white shadow-none"
      )}
    >
      <Container className="flex h-20 items-center justify-between">
        <Link
          href="/"
          className="relative block h-10 w-32 shrink-0 transition-transform duration-500 ease-out hover:scale-[1.02]"
        >
          <Image
            src="/images/koeb-logo.png"
            alt="KOEB"
            fill
            sizes="128px"
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
                  "group relative pb-1 font-heading text-[15px] font-semibold transition-colors duration-300",
                  active ? "text-brand-red" : "text-brand-text hover:text-brand-red"
                )}
              >
                {item.label}
                <span
                  className={clsx(
                    "absolute -bottom-0.5 left-0 h-[2px] rounded-full bg-brand-red transition-[width,opacity] duration-500 ease-out",
                    active ? "w-full opacity-100" : "w-0 opacity-0 group-hover:w-full group-hover:opacity-100"
                  )}
                />
              </Link>
            );
          })}
        </nav>

        <motion.button
          whileTap={reduceMotion ? undefined : { scale: 0.9 }}
          aria-label="Toggle navigation menu"
          className="rounded-full p-2 transition-colors duration-300 hover:bg-black/5 md:hidden"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={26} /> : <Menu size={26} />}
        </motion.button>
      </Container>

      <div
        className={clsx(
          "overflow-hidden border-t border-white/15 bg-white/80 shadow-2xl backdrop-blur-xl transition-[max-height,opacity] duration-500 ease-out md:hidden",
          open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <nav className="flex flex-col px-5 py-4">
          {navItems.map((item, index) => (
            <motion.div
              key={item.href}
              initial={false}
              animate={open && !reduceMotion ? { opacity: 1, x: 0 } : { opacity: open ? 1 : 0, x: open ? 0 : -8 }}
              transition={{ duration: 0.3, delay: open ? index * 0.035 : 0, ease: "easeOut" }}
            >
              <Link
                href={item.href}
                className={clsx(
                  "block rounded-lg py-3 font-heading text-base font-semibold transition-[color,background-color,padding-left] duration-300 hover:bg-black/5 hover:pl-2",
                  pathname === item.href ? "text-brand-red" : "text-brand-text"
                )}
              >
                {item.label}
              </Link>
            </motion.div>
          ))}
        </nav>
      </div>
    </header>
  );
}
