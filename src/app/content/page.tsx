"use client";

import { useEffect, useState } from "react";
import {
  FileText,
  Filter,
  Search,
  MoreHorizontal,
  ExternalLink,
  Edit3,
  Trash2,
  Sparkles,
  RefreshCw,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  content_vertical: string;
  created_at: string;
  updated_at: string;
  brand_id: number;
  campaign_id: number | null;
}

const statusConfig: Record<string, { label: string; className: string }> = {
  planned: {
    label: "Planned",
    className: "bg-blue-500/15 text-blue-400 border-blue-500/20",
  },
  drafting: {
    label: "Drafting",
    className: "bg-yellow-500/15 text-yellow-400 border-yellow-500/20",
  },
  review: {
    label: "Review",
    className: "bg-orange-500/15 text-orange-400 border-orange-500/20",
  },
  approved: {
    label: "Approved",
    className: "bg-green-500/15 text-green-400 border-green-500/20",
  },
  published: {
    label: "Published",
    className: "bg-purple-500/15 text-purple-400 border-purple-500/20",
  },
};

const platforms = [
  "All",
  "Instagram",
  "Facebook",
  "TikTok",
  "YouTube",
  "LinkedIn",
  "Blog",
  "Twitter",
];
const statuses = ["All", "planned", "drafting", "review", "approved", "published"];

export default function ContentPage() {
  const [pieces, setPieces] = useState<ContentPiece[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("All");
  const [platformFilter, setPlatformFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchContent = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/content");
      if (res.ok) {
        const data = await res.json();
        setPieces(data.pieces || data || []);
      }
    } catch {
      // API may not be available
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, []);

  const filtered = pieces.filter((p) => {
    if (statusFilter !== "All" && p.status !== statusFilter) return false;
    if (
      platformFilter !== "All" &&
      p.platform?.toLowerCase() !== platformFilter.toLowerCase()
    )
      return false;
    if (
      searchQuery &&
      !p.title?.toLowerCase().includes(searchQuery.toLowerCase())
    )
      return false;
    return true;
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Content
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage all your content pieces
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={fetchContent}
            className="text-gray-400 hover:text-white"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="bg-gray-900/50 border-white/[0.06]">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="relative flex-1 w-full sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-600" />
              <Input
                placeholder="Search content..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-white/[0.05] border-white/[0.08] text-white placeholder:text-gray-600 focus:border-blue-500/50"
              />
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Filter className="h-4 w-4 text-gray-600 hidden sm:block" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-lg bg-white/[0.05] border border-white/[0.08] px-3 py-2 text-xs text-white outline-none cursor-pointer"
              >
                {statuses.map((s) => (
                  <option key={s} value={s}>
                    {s === "All" ? "All Statuses" : s.charAt(0).toUpperCase() + s.slice(1)}
                  </option>
                ))}
              </select>
              <select
                value={platformFilter}
                onChange={(e) => setPlatformFilter(e.target.value)}
                className="rounded-lg bg-white/[0.05] border border-white/[0.08] px-3 py-2 text-xs text-white outline-none cursor-pointer"
              >
                {platforms.map((p) => (
                  <option key={p} value={p}>
                    {p === "All" ? "All Platforms" : p}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content Table */}
      <Card className="bg-gray-900/50 border-white/[0.06]">
        <CardContent className="p-0">
          {loading ? (
            <div className="p-6 space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="h-4 flex-1 bg-white/[0.06]" />
                  <Skeleton className="h-4 w-24 bg-white/[0.06]" />
                  <Skeleton className="h-4 w-16 bg-white/[0.06]" />
                  <Skeleton className="h-5 w-16 bg-white/[0.06]" />
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-16 text-center">
              <FileText className="h-12 w-12 text-gray-700 mx-auto mb-3" />
              <p className="text-sm text-gray-500 font-medium">
                {pieces.length === 0
                  ? "No content pieces yet"
                  : "No results match your filters"}
              </p>
              <p className="text-xs text-gray-600 mt-1">
                {pieces.length === 0
                  ? "Create your first piece of content to get started"
                  : "Try adjusting your search or filters"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-white/[0.06] hover:bg-transparent">
                    <TableHead className="text-gray-500 text-xs font-medium">
                      Title
                    </TableHead>
                    <TableHead className="text-gray-500 text-xs font-medium hidden md:table-cell">
                      Platform
                    </TableHead>
                    <TableHead className="text-gray-500 text-xs font-medium hidden lg:table-cell">
                      Type
                    </TableHead>
                    <TableHead className="text-gray-500 text-xs font-medium">
                      Status
                    </TableHead>
                    <TableHead className="text-gray-500 text-xs font-medium hidden sm:table-cell">
                      Date
                    </TableHead>
                    <TableHead className="text-gray-500 text-xs font-medium text-right">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((piece) => {
                    const sc = statusConfig[piece.status] || statusConfig.planned;
                    return (
                      <TableRow
                        key={piece.id}
                        className="border-white/[0.04] hover:bg-white/[0.02] transition-colors"
                      >
                        <TableCell className="font-medium text-white text-sm max-w-[200px] truncate">
                          {piece.title || "Untitled"}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <span className="text-sm text-gray-400 capitalize">
                            {piece.platform || "—"}
                          </span>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          <span className="text-sm text-gray-500 capitalize">
                            {piece.content_type || "—"}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={`text-[10px] font-medium border ${sc.className}`}
                          >
                            {sc.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <span className="text-xs text-gray-600">
                            {piece.created_at
                              ? new Date(
                                  piece.created_at
                                ).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                })
                              : "—"}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button className="p-1.5 rounded-md hover:bg-white/[0.06] text-gray-600 hover:text-white transition-colors">
                              <Edit3 className="h-3.5 w-3.5" />
                            </button>
                            <button className="p-1.5 rounded-md hover:bg-white/[0.06] text-gray-600 hover:text-white transition-colors">
                              <ExternalLink className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Count */}
      {!loading && filtered.length > 0 && (
        <p className="text-xs text-gray-600 text-center">
          Showing {filtered.length} of {pieces.length} content pieces
        </p>
      )}
    </div>
  );
}
