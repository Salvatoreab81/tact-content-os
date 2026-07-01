import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, industry, markets, model, apiKey: userApiKey, lang = "en" } = body;

    if (!name || !industry) {
      return NextResponse.json(
        { error: "Missing required fields: name, industry" },
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

    // Default to a model with internet access if possible, or a highly knowledgeable one.
    let defaultModel = process.env.OPENROUTER_MODEL || "google/gemini-2.0-flash";
    if (defaultModel.includes("gemini-2.0-flash-exp")) {
      defaultModel = "google/gemini-2.0-flash";
    }
    const selectedModel = model || defaultModel;

    const isSpanish = lang === "es";

    const systemPrompt = `You are a top-tier Market Intelligence AI. Your task is to auto-detect and suggest top competitors for a specific brand in their industry. Return exactly a JSON array of 3 to 5 competitor objects. 
Each object must have these exact keys: "name", "url", "prices", "promotions", "topPerforming", "failedContent", "trends", "notes".
Do not return markdown code blocks, just raw JSON.`;

    const userPrompt = `Brand Name: ${name}
Industry: ${industry}
Markets: ${markets || "Global"}

Please identify 3 to 5 primary competitors. For each competitor, generate a structured profile filling out the required keys (name, url, prices, promotions, topPerforming, failedContent, trends, notes) with realistic estimates or known data about their marketing strategy. Write the values in ${isSpanish ? "Spanish" : "English"}.`;

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
        response_format: { type: "json_object" } // Tell the model to output JSON if supported
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { error: errorData.error?.message || "Failed to generate suggestions" },
        { status: response.status }
      );
    }

    const data = await response.json();
    let content = data.choices?.[0]?.message?.content?.trim() || "[]";
    
    // Clean up potential markdown code blocks
    if (content.startsWith("```json")) {
      content = content.replace(/^```json\n?/, "").replace(/\n?```$/, "");
    }
    
    // Sometimes the model wraps it in an object like { "competitors": [...] }
    let suggestions = [];
    try {
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed)) {
        suggestions = parsed;
      } else if (parsed.competitors && Array.isArray(parsed.competitors)) {
        suggestions = parsed.competitors;
      } else {
        suggestions = Object.values(parsed).find(v => Array.isArray(v)) || [];
      }
    } catch (e) {
      console.error("Failed to parse JSON from AI:", content);
      throw new Error("AI returned invalid JSON.");
    }

    return NextResponse.json({ suggestions });
  } catch (error: any) {
    console.error("AI Competitor Suggestion Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate insights" },
      { status: 500 }
    );
  }
}
