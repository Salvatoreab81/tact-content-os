import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, industry, competitorNotes, targetAudience, model, apiKey: userApiKey } = body;

    if (!name || !industry || !competitorNotes) {
      return NextResponse.json(
        { error: "Missing required fields: name, industry, competitorNotes" },
        { status: 400 }
      );
    }

    const apiKey = userApiKey || process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "OpenRouter API Key is not configured." },
        { status: 500 }
      );
    }

    let defaultModel = process.env.OPENROUTER_MODEL || "google/gemini-2.0-flash";
    if (defaultModel.includes("gemini-2.0-flash-exp")) {
      defaultModel = "google/gemini-2.0-flash";
    }
    const selectedModel = model || defaultModel;

    const systemPrompt = `You are a top-tier Brand Strategist and Competitor Analyst. Your job is to analyze rough notes about competitors and extract actionable, high-value insights.`;

    const marketsStr = targetAudience?.markets?.length ? targetAudience.markets.join(", ") : "Global";

    const userPrompt = `Please analyze the following raw competitor research notes for our brand:
- Our Brand: ${name}
- Industry: ${industry}
- Markets: ${marketsStr}

Raw Competitor Notes:
"${competitorNotes}"

Based on these notes, generate a structured strategic summary in Spanish. Provide:
1. "Fortalezas de la Competencia" (Competitor Strengths - 2 bullet points)
2. "Oportunidades para ${name}" (Opportunities/Gaps - 2 bullet points)
3. "Ángulo de Contenido Recomendado" (1 recommended content angle we should use to stand out)

Format it cleanly with Markdown headers and bullet points. Do not include any introductory text. Write entirely in Spanish.`;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
        "HTTP-Referer": "https://tact.app",
        "X-Title": "TACT Content OS",
      },
      body: JSON.stringify({
        model: selectedModel,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { error: errorData.error?.message || "Failed to generate competitor insights from OpenRouter" },
        { status: response.status }
      );
    }

    const data = await response.json();
    const insights = data.choices?.[0]?.message?.content?.trim() || "";

    return NextResponse.json({ insights });
  } catch (error: any) {
    console.error("AI Competitor Insights Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate insights" },
      { status: 500 }
    );
  }
}
