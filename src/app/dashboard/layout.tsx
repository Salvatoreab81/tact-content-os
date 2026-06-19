"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Calendar,
  FileText,
  Megaphone,
  Sparkles,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/calendar", label: "Calendar", icon: Calendar },
  { href: "/content", label: "Content", icon: FileText },
  { href: "/campaigns", label: "Campaigns", icon: Megaphone },
  { href: "/generate", label: "Generate", icon: Sparkles },
];

const bottomItems = [
  { href: "/settings", label: "Settings", icon: Settings },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex h-screen overflow-hidden bg-[#050505]">
      {/* Sidebar */}
      <aside className="hidden lg:flex w-64 flex-col glass-sidebar">
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#00ff88]/10 border border-[#00ff88]/20 text-[#00ff88] font-bold text-sm shadow-[0_0_20px_rgba(0,255,136,0.1)]">
            T
          </div>
          <div>
            <h1 className="text-sm font-bold text-white tracking-tight heading-brutal">
              TACT
            </h1>
            <p className="text-[10px] text-white/35 font-medium tracking-[0.15em] uppercase font-mono">
              Content OS
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="mx-4 h-px bg-white/[0.06]" />

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-[#00ff88]/10 text-[#00ff88] shadow-[0_0_20px_rgba(0,255,136,0.06)] border border-[#00ff88]/15"
                    : "text-white/40 hover:text-white/80 hover:bg-white/[0.04] border border-transparent"
                )}
              >
                <item.icon
                  className={cn(
                    "h-4 w-4 shrink-0",
                    isActive ? "text-[#00ff88]" : "text-white/25"
                  )}
                />
                {item.label}
                {item.href === "/generate" && (
                  <span className="ml-auto rounded-full bg-[#00ff88]/10 px-2 py-0.5 text-[10px] font-semibold text-[#00ff88] font-mono border border-[#00ff88]/15">
                    AI
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="px-3 py-4 space-y-0.5">
          <div className="mx-1 mb-3 h-px bg-white/[0.06]" />
          {bottomItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-white/[0.06] text-white border border-white/[0.08]"
                    : "text-white/30 hover:text-white/60 hover:bg-white/[0.03] border border-transparent"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </div>
      </aside>

      {/* Mobile header */}
      <div className="flex flex-col flex-1 min-w-0">
        <header className="flex items-center justify-between border-b border-white/[0.06] bg-[#050505]/80 backdrop-blur-xl px-4 py-3 lg:hidden sticky top-0 z-50">
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#00ff88]/10 border border-[#00ff88]/20 text-[#00ff88] font-bold text-xs">
                T
              </div>
              <span className="font-bold text-sm heading-brutal">TACT</span>
            </Link>
          </div>
          {/* Mobile bottom nav */}
          <div className="flex items-center gap-1">
            {navItems.slice(0, 5).map((item) => {
              const isActive =
                pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex flex-col items-center gap-1 rounded-lg px-3 py-1.5 text-[10px] font-medium transition-colors",
                    isActive
                      ? "text-[#00ff88]"
                      : "text-white/30 hover:text-white/60"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto grid-bg">{children}</main>
      </div>
    </div>
  );
}
