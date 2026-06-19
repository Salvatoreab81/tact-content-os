import { NextRequest, NextResponse } from "next/server";
import { getAllBrands, createBrand } from "@/lib/db";

export async function GET() {
  try {
    const brands = await getAllBrands();
    return NextResponse.json(brands);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch brands" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const brand = await createBrand(body);
    return NextResponse.json(brand, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create brand" },
      { status: 500 }
    );
  }
}
