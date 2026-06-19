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
  planned: "bg-[#00ff88]/10 text-[#00ff88] border-[#00ff88]/15",
  drafting: "bg-[#ffaa00]/10 text-[#ffaa00] border-[#ffaa00]/15",
  review: "bg-[#ff8844]/10 text-[#ff8844] border-[#ff8844]/15",
  approved: "bg-[#00cc6a]/10 text-[#00cc6a] border-[#00cc6a]/15",
  published: "bg-white/5 text-white/60 border-white/10",
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
    <div className="p-6 sm:p-8 lg:p-10 max-w-7xl mx-auto space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight heading-brutal">
          Dashboard
        </h1>
        <p className="text-sm text-white/35 mt-2">
          Welcome back. Here&apos;s your content overview.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <div
            key={card.title}
            className="glass glass-hover p-5 transition-all duration-200 group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.04] border border-white/[0.06]">
                <card.icon className="h-5 w-5 text-white/40 group-hover:text-[#00ff88] transition-colors duration-200" />
              </div>
              <TrendingUp className="h-4 w-4 text-white/15 group-hover:text-white/30 transition-colors duration-200" />
            </div>
            <div>
              {loading ? (
                <Skeleton className="h-9 w-16 bg-white/[0.04]" />
              ) : (
                <p className="text-3xl font-extrabold stat-number">{card.value}</p>
              )}
              <p className="text-xs text-white/35 mt-1 font-medium font-mono uppercase tracking-wider">
                {card.title}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link href="/generate" className="group">
          <div className="glass glass-hover p-6 flex items-center gap-4 cursor-pointer transition-all duration-200">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#00ff88]/8 border border-[#00ff88]/12">
              <Sparkles className="h-6 w-6 text-[#00ff88]/70" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-white group-hover:text-[#00ff88] transition-colors duration-200 heading-brutal">
                Generate Content
              </h3>
              <p className="text-sm text-white/35 mt-0.5">
                AI-powered content creation
              </p>
            </div>
            <ArrowUpRight className="h-5 w-5 text-white/20 group-hover:text-[#00ff88] transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </div>
        </Link>
        <Link href="/calendar" className="group">
          <div className="glass glass-hover p-6 flex items-center gap-4 cursor-pointer transition-all duration-200">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#00ff88]/8 border border-[#00ff88]/12">
              <Calendar className="h-6 w-6 text-[#00ff88]/70" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-white group-hover:text-[#00ff88] transition-colors duration-200 heading-brutal">
                View Calendar
              </h3>
              <p className="text-sm text-white/35 mt-0.5">
                Plan and schedule content
              </p>
            </div>
            <ArrowUpRight className="h-5 w-5 text-white/20 group-hover:text-[#00ff88] transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </div>
        </Link>
      </div>

      {/* Recent Content */}
      <div className="glass overflow-hidden">
        <div className="px-6 py-4 border-b border-white/[0.06]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-white/25" />
              <h2 className="text-base font-semibold text-white heading-brutal">
                Recent Content
              </h2>
            </div>
            <Link
              href="/content"
              className="text-xs text-[#00ff88]/70 hover:text-[#00ff88] transition-colors font-medium font-mono"
            >
              View all →
            </Link>
          </div>
        </div>
        <div>
          {loading ? (
            <div className="p-6 space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="h-4 flex-1 bg-white/[0.04]" />
                  <Skeleton className="h-4 w-20 bg-white/[0.04]" />
                  <Skeleton className="h-5 w-16 bg-white/[0.04]" />
                </div>
              ))}
            </div>
          ) : recentContent.length === 0 ? (
            <div className="p-16 text-center">
              <FileText className="h-12 w-12 text-white/10 mx-auto mb-3" />
              <p className="text-sm text-white/40 font-medium">
                No content pieces yet
              </p>
              <p className="text-xs text-white/20 mt-1">
                Start by generating your first piece of content
              </p>
              <Link href="/generate">
                <Button className="mt-5 bg-[#00ff88] hover:bg-[#00cc6a] text-[#050505] text-sm font-semibold transition-all duration-200 glow-sm hover:scale-[1.02]">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate Content
                </Button>
              </Link>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-white/[0.04] hover:bg-transparent">
                  <TableHead className="text-white/30 text-xs font-medium font-mono uppercase tracking-wider">
                    Title
                  </TableHead>
                  <TableHead className="text-white/30 text-xs font-medium font-mono uppercase tracking-wider hidden sm:table-cell">
                    Platform
                  </TableHead>
                  <TableHead className="text-white/30 text-xs font-medium font-mono uppercase tracking-wider">
                    Status
                  </TableHead>
                  <TableHead className="text-white/30 text-xs font-medium font-mono uppercase tracking-wider hidden md:table-cell">
                    Date
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentContent.map((piece) => (
                  <TableRow
                    key={piece.id}
                    className="border-white/[0.04] hover:bg-white/[0.02] transition-all duration-200"
                  >
                    <TableCell className="font-medium text-white text-sm">
                      {piece.title || "Untitled"}
                    </TableCell>
                    <TableCell className="text-white/40 text-sm hidden sm:table-cell capitalize">
                      {piece.platform || "—"}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`text-[10px] font-medium capitalize border font-mono ${
                          statusColors[piece.status] ||
                          "bg-white/5 text-white/40 border-white/10"
                        }`}
                      >
                        {piece.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-white/25 text-xs hidden md:table-cell">
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
