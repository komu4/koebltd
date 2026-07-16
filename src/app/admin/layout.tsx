"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Montserrat, Inter } from "next/font/google";
import { Menu, X } from "lucide-react";
import SessionProviderWrapper from "@/components/admin/SessionProviderWrapper";
import AdminSidebar from "@/components/admin/AdminSidebar";
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

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLogin = pathname === "/admin/login";
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <html lang="en" className={`${montserrat.variable} ${inter.variable}`}>
      <body className="font-body antialiased">
        <SessionProviderWrapper>
          {isLogin ? (
            children
          ) : (
            <div className="flex min-h-screen w-full max-w-full bg-brand-light md:overflow-x-hidden">
              <AdminSidebar mobileOpen={mobileNavOpen} onNavigate={() => setMobileNavOpen(false)} />

              {mobileNavOpen && (
                <button
                  aria-label="Close menu"
                  onClick={() => setMobileNavOpen(false)}
                  className="fixed inset-0 z-30 bg-black/50 md:hidden"
                />
              )}

              <div className="flex min-h-screen w-full min-w-0 flex-1 flex-col">
                <div className="sticky top-0 z-20 flex items-center gap-3 border-b border-brand-border bg-white px-4 py-3 shadow-sm md:hidden">
                  <button
                    aria-label="Toggle navigation menu"
                    onClick={() => setMobileNavOpen((v) => !v)}
                    className="text-brand-text"
                  >
                    {mobileNavOpen ? <X size={24} /> : <Menu size={24} />}
                  </button>
              <div className="h-10 w-32 flex-shrink-0">
                <img
                  src="/images/koeb-logo.svg"
                  alt="KOEB Ltd"
                  className="h-full w-full object-contain"
                />
              </div>
                </div>

                <div className="w-full min-w-0 flex-1 overflow-x-hidden overflow-y-auto p-4 sm:p-6 lg:p-8">
                  {children}
                </div>
              </div>
            </div>
          )}
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
