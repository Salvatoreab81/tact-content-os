import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    const authEmail = process.env.AUTH_EMAIL || "admin@nextcontent.digital";
    const authPassword = process.env.AUTH_PASSWORD || "tact2026!";

    if (email === authEmail && password === authPassword) {
      const cookieStore = await cookies();
      cookieStore.set("tact_session", "authenticated", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 1 week
        sameSite: "lax"
      });

      return NextResponse.json({ success: true, email: authEmail });
    }

    return NextResponse.json(
      { error: "Credenciales incorrectas" },
      { status: 401 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Error al iniciar sesión" },
      { status: 500 }
    );
  }
}
