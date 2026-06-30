"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  FileText,
  Globe,
  Clock,
  PenLine,
  ArrowUpRight,
  Calendar,
  Sparkles,
  TrendingUp,
  BarChart3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface ContentPiece {
  id: number;
  title: string;
  platform: string;
  content_type: string;
  status: string;
  created_at: string;
  campaign_id: number | null;
}

const statusColors: Record<string, string> = {
  planned: "bg-[#00ff88]/10 text-[#00ff88] border-[#00ff88]/20",
  drafting: "bg-[#ffaa00]/10 text-[#ffaa00] border-[#ffaa00]/20",
  review: "bg-[#ff8844]/10 text-[#ff8844] border-[#ff8844]/20",
  approved: "bg-[#00cc6a]/10 text-[#00cc6a] border-[#00cc6a]/20",
  published: "bg-[#00d4ff]/8 text-[#00d4ff]/70 border-[#00d4ff]/12",
};

export default function DashboardPage() {
  const [stats, setStats] = useState({
    total: 0,
    published: 0,
    scheduled: 0,
    drafts: 0,
  });
  const [recentContent, setRecentContent] = useState<ContentPiece[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/content");
        if (res.ok) {
          const data = await res.json();
          const pieces = data.pieces || data || [];
          setRecentContent(Array.isArray(pieces) ? pieces.slice(0, 5) : []);
          setStats({
            total: Array.isArray(pieces) ? pieces.length : 0,
            published: Array.isArray(pieces)
              ? pieces.filter((p: ContentPiece) => p.status === "published")
                  .length
              : 0,
            scheduled: Array.isArray(pieces)
              ? pieces.filter((p: ContentPiece) => p.status === "planned")
                  .length
              : 0,
            drafts: Array.isArray(pieces)
              ? pieces.filter(
                  (p: ContentPiece) =>
                    p.status === "drafting" || p.status === "review"
                ).length
              : 0,
          });
        }
      } catch {
        // API may not be available yet
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const statCards = [
    {
      title: "Total Content",
      value: stats.total,
      icon: FileText,
    },
    {
      title: "Published",
      value: stats.published,
      icon: Globe,
    },
    {
      title: "Scheduled",
      value: stats.scheduled,
      icon: Clock,
    },
    {
      title: "Drafts",
      value: stats.drafts,
      icon: PenLine,
    },
  ];

  return (
    <div className="p-8 sm:p-10 lg:p-12 section-container space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-extrabold text-white tracking-tight heading-glow">
          Dashboard
        </h1>
        <p className="text-sm text-white/50 mt-3 font-medium">
          Welcome back. Here&apos;s your content overview.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((card) => (
          <div
            key={card.title}
            className="glass glass-hover stat-accent p-6 group"
          >
            <div className="flex items-center justify-between mb-5">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#00ff88]/8 border border-[#00ff88]/15 group-hover:border-[#00ff88]/25 group-hover:shadow-[0_0_16px_rgba(0,255,136,0.1)] transition-all duration-300">
                <card.icon className="h-5 w-5 text-[#00ff88]/60 group-hover:text-[#00ff88] transition-colors duration-300" />
              </div>
              <TrendingUp className="h-4 w-4 text-white/15 group-hover:text-[#00d4ff]/50 transition-colors duration-300" />
            </div>
            <div>
              {loading ? (
                <Skeleton className="h-10 w-16 bg-white/[0.04]" />
              ) : (
                <p className="text-4xl font-extrabold stat-number leading-none">
                  {card.value}
                </p>
              )}
              <p className="text-[10px] text-white/40 mt-2 font-semibold font-mono uppercase tracking-[0.1em]">
                {card.title}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Link href="/dashboard/generate" className="group">
          <div className="glass glass-hover p-7 flex items-center gap-5 cursor-pointer">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#00ff88]/8 border border-[#00ff88]/12 group-hover:border-[#00ff88]/25 group-hover:shadow-[0_0_20px_rgba(0,255,136,0.08)] transition-all duration-300">
              <Sparkles className="h-6 w-6 text-[#00ff88]/60 group-hover:text-[#00ff88] transition-colors duration-300" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-white group-hover:text-[#00ff88] transition-colors duration-300 heading-brutal text-[15px]">
                Generate Content
              </h3>
              <p className="text-sm text-white/40 mt-1">
                AI-powered content creation
              </p>
            </div>
            <ArrowUpRight className="h-5 w-5 text-white/15 group-hover:text-[#00ff88] transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </div>
        </Link>
        <Link href="/dashboard/calendar" className="group">
          <div className="glass glass-hover p-7 flex items-center gap-5 cursor-pointer">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#00d4ff]/8 border border-[#00d4ff]/12 group-hover:border-[#00d4ff]/25 group-hover:shadow-[0_0_20px_rgba(0,212,255,0.08)] transition-all duration-300">
              <Calendar className="h-6 w-6 text-[#00d4ff]/60 group-hover:text-[#00d4ff] transition-colors duration-300" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-white group-hover:text-[#00d4ff] transition-colors duration-300 heading-brutal text-[15px]">
                View Calendar
              </h3>
              <p className="text-sm text-white/40 mt-1">
                Plan and schedule content
              </p>
            </div>
            <ArrowUpRight className="h-5 w-5 text-white/15 group-hover:text-[#00d4ff] transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </div>
        </Link>
      </div>

      {/* Recent Content */}
      <div className="glass overflow-hidden">
        <div className="px-7 py-5 border-b border-white/[0.06]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BarChart3 className="h-4 w-4 text-[#00d4ff]/50" />
              <h2 className="text-base font-bold text-white heading-brutal">
                Recent Content
              </h2>
            </div>
            <Link
              href="/dashboard/content"
              className="text-xs text-[#00ff88]/60 hover:text-[#00ff88] transition-colors duration-300 font-semibold font-mono"
            >
              View all →
            </Link>
          </div>
        </div>
        <div>
          {loading ? (
            <div className="p-7 space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="h-4 flex-1 bg-white/[0.04]" />
                  <Skeleton className="h-4 w-20 bg-white/[0.04]" />
                  <Skeleton className="h-5 w-16 bg-white/[0.04]" />
                </div>
              ))}
            </div>
          ) : recentContent.length === 0 ? (
            <div className="p-20 text-center">
              <FileText className="h-14 w-14 text-white/8 mx-auto mb-4" />
              <p className="text-sm text-white/45 font-medium">
                No content pieces yet
              </p>
              <p className="text-xs text-white/25 mt-2">
                Start by generating your first piece of content
              </p>
              <Link href="/dashboard/generate">
                <Button className="mt-6 bg-[#00ff88] hover:bg-[#00cc6a] text-[#0a0a1a] text-sm font-bold transition-all duration-300 glow-sm hover:scale-[1.03] shadow-[0_0_20px_rgba(0,255,136,0.2)]">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate Content
                </Button>
              </Link>
            </div>
          ) : (
            <Table className="table-premium">
              <TableHeader>
                <TableRow className="border-white/[0.06] hover:bg-transparent">
                  <TableHead>Title</TableHead>
                  <TableHead className="hidden sm:table-cell">
                    Platform
                  </TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden md:table-cell">
                    Date
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentContent.map((piece) => (
                  <TableRow
                    key={piece.id}
                    className="border-white/[0.04] hover:bg-white/[0.02] transition-all duration-300"
                  >
                    <TableCell className="font-medium text-white text-sm">
                      {piece.title || "Untitled"}
                    </TableCell>
                    <TableCell className="text-white/50 text-sm hidden sm:table-cell capitalize">
                      {piece.platform || "—"}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`text-[10px] font-semibold capitalize border font-mono ${
                          statusColors[piece.status] ||
                          "bg-white/5 text-white/40 border-white/10"
                        }`}
                      >
                        {piece.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-white/30 text-xs hidden md:table-cell font-mono">
                      {piece.created_at
                        ? new Date(piece.created_at).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                            }
                          )
                        : "—"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
    </div>
  );
}
