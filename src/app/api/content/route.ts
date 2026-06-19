import { NextRequest, NextResponse } from "next/server";
import { getContentPieces, createContentPiece } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const brandId = searchParams.get("brand_id");
    const limit = parseInt(searchParams.get("limit") || "50", 10);

    // Use brand_id=1 as default for now
    const pieces = await getContentPieces(brandId ? parseInt(brandId) : 1, limit);
    return NextResponse.json({ pieces });
  } catch (error) {
    // If database is unavailable, return empty
    return NextResponse.json({ pieces: [] });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const piece = await createContentPiece(body);
    return NextResponse.json(piece, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create content piece" },
      { status: 500 }
    );
  }
}
