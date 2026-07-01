import { NextRequest, NextResponse } from "next/server";
import { getAllBrands, getBrandHistoryBySlug, restoreBrandVersion } from "@/lib/db";

export async function GET() {
  try {
    const brands = await getAllBrands();
    if (!brands || brands.length === 0) {
      return NextResponse.json([]);
    }
    const history = await getBrandHistoryBySlug(brands[0].slug);
    return NextResponse.json(history);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch brand history" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { versionId } = body;

    if (!versionId) {
      return NextResponse.json(
        { error: "Missing required parameter: versionId" },
        { status: 400 }
      );
    }

    const brands = await getAllBrands();
    if (!brands || brands.length === 0) {
      return NextResponse.json(
        { error: "No brand configured" },
        { status: 400 }
      );
    }

    const restored = await restoreBrandVersion(brands[0].slug, versionId);
    return NextResponse.json(restored);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to restore version" },
      { status: 500 }
    );
  }
}
