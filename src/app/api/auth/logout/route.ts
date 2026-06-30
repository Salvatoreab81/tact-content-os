import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    cookieStore.set("tact_session", "", {
      path: "/",
      maxAge: 0,
    });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Error al cerrar sesión" },
      { status: 500 }
    );
  }
}
