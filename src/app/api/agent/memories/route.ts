import { NextRequest, NextResponse } from "next/server";
import { getBrandMemories, createBrandMemory } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const brandId = searchParams.get("brand_id") || "1";

    const memories = await getBrandMemories(brandId);
    return NextResponse.json({ memories });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch brand memories" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const brandId = body.brandId || "1";
    
    if (!body.title || !body.content) {
      return NextResponse.json(
        { error: "Missing required fields: title, content" },
        { status: 400 }
      );
    }

    const memory = await createBrandMemory(brandId, body);
    return NextResponse.json(memory, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to create brand memory" },
      { status: 500 }
    );
  }
}
