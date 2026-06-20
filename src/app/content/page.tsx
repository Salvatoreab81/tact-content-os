"use client";

import { useEffect, useState } from "react";
import {
  FileText,
  Filter,
  Search,
  Edit3,
  ExternalLink,
  RefreshCw,
} from "lucide-react";
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
    className: "bg-[#00ff88]/8 text-[#00ff88] border-[#00ff88]/15",
  },
  drafting: {
    label: "Drafting",
    className: "bg-[#ffaa00]/8 text-[#ffaa00] border-[#ffaa00]/15",
  },
  review: {
    label: "Review",
    className: "bg-[#ff8844]/8 text-[#ff8844] border-[#ff8844]/15",
  },
  approved: {
    label: "Approved",
    className: "bg-[#00cc6a]/8 text-[#00cc6a] border-[#00cc6a]/15",
  },
  published: {
    label: "Published",
    className: "bg-[#00d4ff]/6 text-[#00d4ff]/70 border-[#00d4ff]/10",
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
    <div className="p-8 sm:p-10 lg:p-12 section-container space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight heading-glow">
            Content
          </h1>
          <p className="text-sm text-white/50 mt-3 font-medium">
            Manage all your content pieces
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={fetchContent}
            className="text-white/30 hover:text-white/70 transition-colors duration-300"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="glass p-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="relative flex-1 w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/25" />
            <Input
              placeholder="Search content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 glass-input"
            />
          </div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <Filter className="h-4 w-4 text-white/25 hidden sm:block" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-xl glass-select px-3 py-2 text-xs cursor-pointer"
            >
              {statuses.map((s) => (
                <option key={s} value={s}>
                  {s === "All"
                    ? "All Statuses"
                    : s.charAt(0).toUpperCase() + s.slice(1)}
                </option>
              ))}
            </select>
            <select
              value={platformFilter}
              onChange={(e) => setPlatformFilter(e.target.value)}
              className="rounded-xl glass-select px-3 py-2 text-xs cursor-pointer"
            >
              {platforms.map((p) => (
                <option key={p} value={p}>
                  {p === "All" ? "All Platforms" : p}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Content Table */}
      <div className="glass overflow-hidden">
        <div>
          {loading ? (
            <div className="p-7 space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="h-4 flex-1 bg-white/[0.04]" />
                  <Skeleton className="h-4 w-24 bg-white/[0.04]" />
                  <Skeleton className="h-4 w-16 bg-white/[0.04]" />
                  <Skeleton className="h-5 w-16 bg-white/[0.04]" />
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-20 text-center">
              <FileText className="h-14 w-14 text-white/8 mx-auto mb-4" />
              <p className="text-sm text-white/45 font-medium">
                {pieces.length === 0
                  ? "No content pieces yet"
                  : "No results match your filters"}
              </p>
              <p className="text-xs text-white/25 mt-2">
                {pieces.length === 0
                  ? "Create your first piece of content to get started"
                  : "Try adjusting your search or filters"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table className="table-premium">
                <TableHeader>
                  <TableRow className="border-white/[0.06] hover:bg-transparent">
                    <TableHead>Title</TableHead>
                    <TableHead className="hidden md:table-cell">
                      Platform
                    </TableHead>
                    <TableHead className="hidden lg:table-cell">
                      Type
                    </TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="hidden sm:table-cell">
                      Date
                    </TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((piece) => {
                    const sc = statusConfig[piece.status] || statusConfig.planned;
                    return (
                      <TableRow
                        key={piece.id}
                        className="border-white/[0.04] hover:bg-white/[0.02] transition-all duration-300"
                      >
                        <TableCell className="font-medium text-white text-sm max-w-[200px] truncate">
                          {piece.title || "Untitled"}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <span className="text-sm text-white/50 capitalize">
                            {piece.platform || "—"}
                          </span>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          <span className="text-sm text-white/35 capitalize">
                            {piece.content_type || "—"}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={`text-[10px] font-semibold border font-mono ${sc.className}`}
                          >
                            {sc.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <span className="text-xs text-white/30 font-mono">
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
                            <button className="p-2 rounded-xl hover:bg-white/[0.06] text-white/25 hover:text-[#00ff88]/70 transition-all duration-300">
                              <Edit3 className="h-3.5 w-3.5" />
                            </button>
                            <button className="p-2 rounded-xl hover:bg-white/[0.06] text-white/25 hover:text-[#00d4ff]/70 transition-all duration-300">
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
        </div>
      </div>

      {/* Count */}
      {!loading && filtered.length > 0 && (
        <p className="text-xs text-white/25 text-center font-mono">
          Showing {filtered.length} of {pieces.length} content pieces
        </p>
      )}
    </div>
  );
}
