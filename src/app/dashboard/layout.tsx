"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Calendar,
  FileText,
  Sparkles,
  Settings,
  Building2,
  Loader2,
  LogOut,
  Radar,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/Logo";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/calendar", label: "Calendar", icon: Calendar },
  { href: "/dashboard/content", label: "Content", icon: FileText },
  { href: "/dashboard/brand", label: "Brand", icon: Building2 },
  { href: "/dashboard/competitors", label: "Competitors", icon: Radar },
  { href: "/dashboard/generate", label: "Generate", icon: Sparkles },
];

const bottomItems = [
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [checkingBrand, setCheckingBrand] = useState(true);

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      if (res.ok) {
        router.push("/login");
      }
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  useEffect(() => {
    async function checkSecurityAndBrand() {
      try {
        // 1. Check Auth Session
        const authRes = await fetch("/api/auth/session");
        if (!authRes.ok) {
          router.push("/login");
          return;
        }
        const authData = await authRes.json();
        if (!authData.authenticated) {
          router.push("/login");
          return;
        }

        // 2. Check Brand onboarding
        const brandRes = await fetch("/api/brands");
        if (brandRes.ok) {
          const brands = await brandRes.json();
          if (!brands || brands.length === 0) {
            router.push("/onboarding");
            return;
          }
        }
      } catch (err) {
        console.error("Error in layout verification:", err);
      } finally {
        setCheckingBrand(false);
      }
    }
    checkSecurityAndBrand();
  }, [router]);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside className="flex w-64 flex-col glass-sidebar shrink-0 relative z-10 shadow-[4px_0_24px_rgba(0,0,0,0.02)] dark:shadow-[4px_0_24px_rgba(0,0,0,0.4)]">
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-6">
          <Logo size="md" />
          <div>
            <h1 className="text-sm font-bold text-foreground tracking-tight heading-brutal">
              TACT
            </h1>
            <p className="text-[10px] text-[var(--text-muted)] font-semibold tracking-[0.15em] uppercase font-mono">
              Content OS
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="mx-5 h-px bg-gradient-to-r from-transparent via-[var(--border)] to-transparent" />

        {/* Navigation */}
        <nav className="flex-1 px-4 py-5 space-y-1">
          {navItems.map((item) => {
            const isActive =
              item.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn("nav-link", isActive && "active")}
              >
                <item.icon
                  className={cn(
                    "h-[18px] w-[18px] shrink-0 transition-colors duration-300",
                    isActive ? "text-[var(--neon)]" : "opacity-60"
                  )}
                />
                {item.label}
                {item.href === "/dashboard/generate" && (
                  <span className="ml-auto text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider font-mono border bg-[var(--neon)]/10 text-[var(--neon)] border-[var(--neon)]/20 shadow-[0_0_12px_rgba(0,113,227,0.1)] dark:shadow-[0_0_12px_rgba(0,255,136,0.1)]">
                    AI
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="px-4 py-5 space-y-1">
          <div className="mx-1 mb-4 h-px bg-gradient-to-r from-transparent via-[var(--border)] to-transparent" />
          {bottomItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn("nav-link", isActive && "active")}
              >
                <item.icon className="h-[18px] w-[18px] opacity-60" />
                {item.label}
              </Link>
            );
          })}
          <button
            onClick={handleLogout}
            className="w-full text-left text-red-500 hover:text-red-600 hover:bg-red-500/10 cursor-pointer flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-xl transition-all duration-300"
          >
            <LogOut className="h-[18px] w-[18px] shrink-0" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main content area */}
      <div className="flex flex-col flex-1 min-w-0 relative z-0">
        <main className="flex-1 overflow-y-auto aurora-bg">
          {checkingBrand ? (
            <div className="flex h-full w-full items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-[var(--neon)]" />
            </div>
          ) : (
            children
          )}
        </main>
      </div>
    </div>
  );
}
