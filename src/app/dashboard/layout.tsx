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
import { Separator } from "@/components/ui/separator";

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
    <div className="flex h-screen overflow-hidden bg-gray-950">
      {/* Sidebar */}
      <aside className="hidden lg:flex w-64 flex-col border-r border-white/[0.08] bg-gray-950">
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white font-bold text-sm">
            T
          </div>
          <div>
            <h1 className="text-sm font-semibold text-white tracking-tight">
              TACT
            </h1>
            <p className="text-[10px] text-gray-500 font-medium tracking-wider uppercase">
              Content OS
            </p>
          </div>
        </div>

        <Separator className="bg-white/[0.08]" />

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-blue-600/15 text-blue-400 shadow-sm shadow-blue-600/10"
                    : "text-gray-400 hover:text-white hover:bg-white/[0.05]"
                )}
              >
                <item.icon
                  className={cn(
                    "h-4 w-4 shrink-0",
                    isActive ? "text-blue-400" : "text-gray-500"
                  )}
                />
                {item.label}
                {item.href === "/generate" && (
                  <span className="ml-auto rounded-full bg-blue-600/20 px-2 py-0.5 text-[10px] font-semibold text-blue-400">
                    AI
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="px-3 py-4 space-y-1">
          <Separator className="mb-4 bg-white/[0.08]" />
          {bottomItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-white/[0.08] text-white"
                    : "text-gray-500 hover:text-gray-300 hover:bg-white/[0.04]"
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
        <header className="flex items-center justify-between border-b border-white/[0.08] bg-gray-950/80 backdrop-blur-xl px-4 py-3 lg:hidden sticky top-0 z-50">
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white font-bold text-xs">
                T
              </div>
              <span className="font-semibold text-sm">TACT</span>
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
                      ? "text-blue-400"
                      : "text-gray-500 hover:text-gray-300"
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
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
