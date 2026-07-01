import { NextRequest, NextResponse } from "next/server";
import { getAllBrands, getCalendarEvents, getContentPieces } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    // TACT is currently single-tenant by default. Fetch the first/main brand.
    const brands = await getAllBrands();
    if (!brands || brands.length === 0) {
      return NextResponse.json({ error: "No brands configured in TACT." }, { status: 404 });
    }

    const brand = brands[0];
    const brandId = brand.id;

    // Fetch calendar events for current year
    const currentYear = new Date().getFullYear();
    const calendarEvents = await getCalendarEvents(brandId, currentYear);

    // Fetch recent/upcoming content pieces (limit 100 for context)
    const contentPieces = await getContentPieces(brandId, 100);

    // Parse Competitor Data
    let competitorData = {};
    if (brand.competitor_research) {
      try {
        competitorData = JSON.parse(brand.competitor_research);
      } catch (e) {
        competitorData = { legacy_notes: brand.competitor_research };
      }
    }

    // Assemble the "Hermes Context"
    const hermesContext = {
      system_status: "active",
      timestamp: new Date().toISOString(),
      brand_profile: {
        id: brand.id,
        name: brand.name,
        industry: brand.industry,
        tone_of_voice: brand.tone_of_voice,
        target_audience: brand.target_audience,
        content_verticals: brand.content_verticals,
        platforms_and_formats: brand.platforms,
      },
      competitor_intelligence: competitorData,
      calendar_overview: calendarEvents.map(ev => ({
        title: ev.title,
        date: ev.event_date,
        type: ev.event_type,
        effort: ev.effort_level
      })),
      content_pipeline: contentPieces.map(cp => ({
        id: cp.id,
        platform: cp.platform,
        status: cp.status,
        scheduled_date: cp.scheduled_date || "unscheduled",
        content_vertical: cp.content_vertical
      }))
    };

    return NextResponse.json(hermesContext);
  } catch (error: any) {
    console.error("Error generating Hermes Context:", error);
    return NextResponse.json(
      { error: "Failed to generate context payload." },
      { status: 500 }
    );
  }
}
