import { NextRequest, NextResponse } from "next/server";
import { getAllBrands, getContentPiecesByDate, getCalendarEventsByDate } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const brandId = searchParams.get("brand_id") || "1";
    
    // Default to today's date in local YYYY-MM-DD
    const todayStr = new Date().toLocaleDateString("sv-SE"); // Returns YYYY-MM-DD format
    const dateStr = searchParams.get("date") || todayStr;

    // 1. Fetch Brand Guidelines
    const brands = await getAllBrands();
    if (!brands || brands.length === 0) {
      return NextResponse.json(
        { error: "No brand guidelines configured. Please run onboarding first." },
        { status: 400 }
      );
    }
    const brand = brands[0];

    // 2. Fetch Content Pieces scheduled for this date
    const contentPieces = await getContentPiecesByDate(brandId, dateStr);

    // 3. Fetch Calendar Events scheduled for this date
    const calendarEvents = await getCalendarEventsByDate(brandId, dateStr);

    // 4. Return assembled Agent context payload
    return NextResponse.json({
      date: dateStr,
      brand: {
        id: brand.id,
        name: brand.name,
        industry: brand.industry,
        tone_of_voice: brand.tone_of_voice || brand.toneOfVoice || "Engaging and professional",
        markets: brand.markets || [],
        platforms: brand.platforms || [],
        content_verticals: brand.content_verticals || brand.contentVerticals || [],
      },
      content_pieces: contentPieces,
      calendar_events: calendarEvents,
    });
  } catch (error: any) {
    console.error("Agent schedule fetch error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to compile agent schedule data" },
      { status: 500 }
    );
  }
}
