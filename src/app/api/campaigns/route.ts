import { NextRequest, NextResponse } from "next/server";
import { getCampaigns, query } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const brandId = searchParams.get("brand_id");

    const campaigns = await getCampaigns(brandId ? parseInt(brandId) : 1);
    return NextResponse.json({ campaigns });
  } catch (error) {
    return NextResponse.json({ campaigns: [] });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = await query(
      `INSERT INTO campaigns (brand_id, name, description, start_date, end_date, status)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [
        body.brandId || 1,
        body.name,
        body.description || "",
        body.startDate,
        body.endDate,
        body.status || "active",
      ]
    );
    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create campaign" },
      { status: 500 }
    );
  }
}
