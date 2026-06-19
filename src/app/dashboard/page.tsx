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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  planned: "bg-blue-500/15 text-blue-400 border-blue-500/20",
  drafting: "bg-yellow-500/15 text-yellow-400 border-yellow-500/20",
  review: "bg-orange-500/15 text-orange-400 border-orange-500/20",
  approved: "bg-green-500/15 text-green-400 border-green-500/20",
  published: "bg-purple-500/15 text-purple-400 border-purple-500/20",
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
      color: "text-blue-400",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
    },
    {
      title: "Published",
      value: stats.published,
      icon: Globe,
      color: "text-green-400",
      bg: "bg-green-500/10",
      border: "border-green-500/20",
    },
    {
      title: "Scheduled",
      value: stats.scheduled,
      icon: Clock,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
    },
    {
      title: "Drafts",
      value: stats.drafts,
      icon: PenLine,
      color: "text-yellow-400",
      bg: "bg-yellow-500/10",
      border: "border-yellow-500/20",
    },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">
          Dashboard
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Welcome back. Here&apos;s your content overview.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <Card
            key={card.title}
            className={`bg-gray-900/50 border-white/[0.06] hover:border-white/[0.12] transition-all duration-300 group`}
          >
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl ${card.bg} border ${card.border}`}
                >
                  <card.icon className={`h-5 w-5 ${card.color}`} />
                </div>
                <TrendingUp className="h-4 w-4 text-gray-600 group-hover:text-gray-400 transition-colors" />
              </div>
              <div className="mt-4">
                {loading ? (
                  <Skeleton className="h-8 w-16 bg-white/[0.06]" />
                ) : (
                  <p className="text-3xl font-bold text-white">{card.value}</p>
                )}
                <p className="text-xs text-gray-500 mt-1 font-medium">
                  {card.title}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link href="/generate" className="group">
          <Card className="bg-gradient-to-br from-blue-600/10 to-blue-600/5 border-blue-500/20 hover:border-blue-500/40 transition-all duration-300 cursor-pointer h-full">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600/20">
                <Sparkles className="h-6 w-6 text-blue-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-white group-hover:text-blue-400 transition-colors">
                  Generate Content
                </h3>
                <p className="text-sm text-gray-500">
                  AI-powered content creation
                </p>
              </div>
              <ArrowUpRight className="h-5 w-5 text-gray-600 group-hover:text-blue-400 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </CardContent>
          </Card>
        </Link>
        <Link href="/calendar" className="group">
          <Card className="bg-gradient-to-br from-purple-600/10 to-purple-600/5 border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 cursor-pointer h-full">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-600/20">
                <Calendar className="h-6 w-6 text-purple-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-white group-hover:text-purple-400 transition-colors">
                  View Calendar
                </h3>
                <p className="text-sm text-gray-500">
                  Plan and schedule content
                </p>
              </div>
              <ArrowUpRight className="h-5 w-5 text-gray-600 group-hover:text-purple-400 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Recent Content */}
      <Card className="bg-gray-900/50 border-white/[0.06]">
        <CardHeader className="border-b border-white/[0.06] pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-gray-500" />
              <CardTitle className="text-base font-semibold text-white">
                Recent Content
              </CardTitle>
            </div>
            <Link
              href="/content"
              className="text-xs text-blue-400 hover:text-blue-300 transition-colors font-medium"
            >
              View all →
            </Link>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-6 space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="h-4 flex-1 bg-white/[0.06]" />
                  <Skeleton className="h-4 w-20 bg-white/[0.06]" />
                  <Skeleton className="h-5 w-16 bg-white/[0.06]" />
                </div>
              ))}
            </div>
          ) : recentContent.length === 0 ? (
            <div className="p-12 text-center">
              <FileText className="h-12 w-12 text-gray-700 mx-auto mb-3" />
              <p className="text-sm text-gray-500 font-medium">
                No content pieces yet
              </p>
              <p className="text-xs text-gray-600 mt-1">
                Start by generating your first piece of content
              </p>
              <Link href="/generate">
                <Button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white text-sm">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate Content
                </Button>
              </Link>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-white/[0.06] hover:bg-transparent">
                  <TableHead className="text-gray-500 text-xs font-medium">
                    Title
                  </TableHead>
                  <TableHead className="text-gray-500 text-xs font-medium hidden sm:table-cell">
                    Platform
                  </TableHead>
                  <TableHead className="text-gray-500 text-xs font-medium">
                    Status
                  </TableHead>
                  <TableHead className="text-gray-500 text-xs font-medium hidden md:table-cell">
                    Date
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentContent.map((piece) => (
                  <TableRow
                    key={piece.id}
                    className="border-white/[0.04] hover:bg-white/[0.02] transition-colors"
                  >
                    <TableCell className="font-medium text-white text-sm">
                      {piece.title || "Untitled"}
                    </TableCell>
                    <TableCell className="text-gray-400 text-sm hidden sm:table-cell capitalize">
                      {piece.platform || "—"}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`text-[10px] font-medium capitalize border ${
                          statusColors[piece.status] ||
                          "bg-gray-500/15 text-gray-400 border-gray-500/20"
                        }`}
                      >
                        {piece.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-500 text-xs hidden md:table-cell">
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
        </CardContent>
      </Card>
    </div>
  );
}
