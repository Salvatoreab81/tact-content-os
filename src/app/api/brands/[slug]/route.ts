import { NextRequest, NextResponse } from "next/server";
import { getBrand, updateBrand } from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const brand = await getBrand(slug);
    if (!brand) {
      return NextResponse.json({ error: "Brand not found" }, { status: 404 });
    }
    return NextResponse.json(brand);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch brand" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const body = await request.json();
    const brand = await getBrand(slug);
    if (!brand) {
      return NextResponse.json({ error: "Brand not found" }, { status: 404 });
    }
    const updatedBrand = await updateBrand(slug, body);
    return NextResponse.json(updatedBrand);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update brand" },
      { status: 500 }
    );
  }
}

