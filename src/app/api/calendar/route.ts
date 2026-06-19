import { NextRequest, NextResponse } from "next/server";
import { getCalendarEvents } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const brandId = searchParams.get("brand_id");
    const year = searchParams.get("year");

    const events = await getCalendarEvents(
      brandId ? parseInt(brandId) : 1,
      year ? parseInt(year) : new Date().getFullYear()
    );
    return NextResponse.json({ events });
  } catch (error) {
    return NextResponse.json({ events: [] });
  }
}
