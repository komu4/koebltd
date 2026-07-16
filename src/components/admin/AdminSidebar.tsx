"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { clsx } from "clsx";
import {
  LayoutDashboard,
  Package,
  FolderTree,
  Wrench,
  Handshake,
  Home,
  Mail,
  LogOut,
} from "lucide-react";

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/categories", label: "Categories", icon: FolderTree },
  { href: "/admin/services", label: "Services", icon: Wrench },
  { href: "/admin/partners", label: "Partners", icon: Handshake },
  { href: "/admin/homepage", label: "Homepage", icon: Home },
  { href: "/admin/messages", label: "Messages", icon: Mail },
];

type AdminSidebarProps = {
  /** Controls visibility on mobile only; ignored at md+ where the sidebar is always shown. */
  mobileOpen?: boolean;
  onNavigate?: () => void;
};

export default function AdminSidebar({ mobileOpen = false, onNavigate }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={clsx(
        "fixed inset-y-0 left-0 z-40 flex h-screen w-64 shrink-0 flex-col overflow-y-auto border-r border-white/10 bg-brand-dark text-white transition-transform duration-300 md:static md:translate-x-0",
        mobileOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
      <div className="relative h-10 w-32 mx-6 mt-6 shrink-0">
        <Image src="/images/koeb-logo.png" alt="KOEB" fill className="object-contain object-left" />
      </div>

      <nav className="mt-8 flex-1 space-y-1 px-3">
        {links.map((link) => {
          const active = pathname === link.href;
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={onNavigate}
              className={clsx(
                "flex items-center gap-3 rounded-button px-4 py-2.5 text-sm font-medium transition-colors",
                active ? "bg-brand-red text-white" : "text-gray-300 hover:bg-white/10"
              )}
            >
              <Icon size={18} /> {link.label}
            </Link>
          );
        })}
      </nav>

      <button
        onClick={() => signOut({ callbackUrl: "/admin/login" })}
        className="mx-3 mb-6 flex items-center gap-3 rounded-button px-4 py-2.5 text-sm font-medium text-gray-300 hover:bg-white/10"
      >
        <LogOut size={18} /> Sign Out
      </button>
    </aside>
  );
}
