import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, industry, competitors, targetAudience, model, apiKey: userApiKey, lang = "en" } = body;

    if (!name || !industry || !competitors || !Array.isArray(competitors)) {
      return NextResponse.json(
        { error: "Missing required fields: name, industry, competitors (array)" },
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

    const systemPrompt = `You are an elite Market Research Strategist and Chief Marketing Officer. Your job is to analyze competitor data to extract high-value insights focused on maximizing ROI (Return on Investment) and ROT (Return on Time), as well as audience building and engagement.`;

    const marketsStr = targetAudience?.markets?.length ? targetAudience.markets.join(", ") : "Global";

    let competitorsText = "";
    competitors.forEach((c: any, index: number) => {
      competitorsText += `\nCompetitor ${index + 1}: ${c.name} (${c.url})\n`;
      if (c.prices) competitorsText += `- Pricing Strategy: ${c.prices}\n`;
      if (c.promotions) competitorsText += `- Current Promotions: ${c.promotions}\n`;
      if (c.topPerforming) competitorsText += `- Top Performing Content / What works: ${c.topPerforming}\n`;
      if (c.failedContent) competitorsText += `- Failed Content / What doesn't work: ${c.failedContent}\n`;
      if (c.trends) competitorsText += `- Observed Trends: ${c.trends}\n`;
      if (c.notes) competitorsText += `- Additional Notes: ${c.notes}\n`;
    });

    const isSpanish = lang === "es";

    const userPrompt = `Please analyze the following competitor data for our brand:
- Our Brand: ${name}
- Industry: ${industry}
- Markets: ${marketsStr}

Competitors Data:
${competitorsText}

Based on this data, generate a structured strategic summary. Focus intensely on actionable takeaways to increase our ROI and ROT. Identify market gaps, pricing opportunities, and content that actually converts vs vanity metrics.

Provide the analysis in the following format (use Markdown):

### 1. Market & Pricing Dynamics
(Analyze their pricing, promos, and how we can position ourselves for better conversions)

### 2. Content & Engagement Analysis
(What content works for them that we should adopt? What failed for them that we should avoid?)

### 3. ROI & ROT Strategic Recommendations
(Provide 3 highly actionable steps we must take right now to capture their audience and maximize ROI/ROT)

Write the entire response in ${isSpanish ? "Spanish" : "English"}. Do not include any generic introductory text.`;

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
        temperature: 0.6,
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
