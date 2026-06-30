import { NextRequest, NextResponse } from "next/server";
import { getCampaigns, createCampaign } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const brandId = searchParams.get("brand_id");

    const campaigns = await getCampaigns(brandId ? brandId : 1);
    return NextResponse.json({ campaigns });
  } catch (error) {
    return NextResponse.json({ campaigns: [] });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const campaign = await createCampaign(body);
    return NextResponse.json(campaign, { status: 201 });
  } catch (error) {

    return NextResponse.json(
      { error: "Failed to create campaign" },
      { status: 500 }
    );
  }
}
