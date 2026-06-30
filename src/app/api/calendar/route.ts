import { NextRequest, NextResponse } from "next/server";
import { getCalendarEvents, createCalendarEvent } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const brandId = searchParams.get("brand_id");
    const year = searchParams.get("year");

    const events = await getCalendarEvents(
      brandId ? String(brandId) : "1",
      year ? parseInt(year) : new Date().getFullYear()
    );
    return NextResponse.json({ events });
  } catch (error) {
    return NextResponse.json({ events: [] });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const event = await createCalendarEvent(body);
    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create calendar event" },
      { status: 500 }
    );
  }
}
