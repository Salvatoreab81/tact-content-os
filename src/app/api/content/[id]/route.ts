import { NextRequest, NextResponse } from "next/server";
import { query, updateContentPiece } from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const result = await query("SELECT * FROM content_pieces WHERE id = $1", [
      parseInt(id),
    ]);
    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: "Content piece not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(result.rows[0]);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch content piece" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const piece = await updateContentPiece(parseInt(id), body);
    if (!piece) {
      return NextResponse.json(
        { error: "Content piece not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(piece);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update content piece" },
      { status: 500 }
    );
  }
}
