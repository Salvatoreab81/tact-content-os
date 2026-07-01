import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, industry, toneOfVoice, platforms, contentVerticals, targetAudience, platformDetails, model } = body;

    if (!name || !industry) {
      return NextResponse.json(
        { error: "Missing required fields: name, industry" },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "OPENROUTER_API_KEY is not configured in environment variables." },
        { status: 500 }
      );
    }

    const defaultModel = process.env.OPENROUTER_MODEL || "google/gemini-2.0-flash-exp:free";
    const selectedModel = model || defaultModel;

    const systemPrompt = `You are an elite, highly critical AI Chief Marketing Officer and Strategy Consultant. Your job is to analyze brand setups and find target mismatches, missed opportunities, or format inconsistencies.`;

    const marketsStr = targetAudience?.markets?.length ? targetAudience.markets.join(", ") : "Global";
    const gendersStr = `Men: ${targetAudience?.genders?.men || 50}%, Women: ${targetAudience?.genders?.women || 50}%`;
    const socioEconomicStr = `A/B (Luxury): ${targetAudience?.socioEconomic?.ab || 25}%, C+ (Premium): ${targetAudience?.socioEconomic?.cplus || 25}%, C (Mass): ${targetAudience?.socioEconomic?.c || 50}%, D/E (Low Cost): ${targetAudience?.socioEconomic?.de || 0}%`;
    const generationsStr = targetAudience?.generations?.length ? targetAudience.generations.join(", ") : "All generations";
    const platformsStr = platforms?.join(", ") || "None";
    const verticalsStr = contentVerticals?.join(", ") || "None";

    const userPrompt = `Perform a rapid strategic audit in Spanish on this brand setup:
- Brand Name: ${name}
- Industry: ${industry}
- Markets/Regions: ${marketsStr}
- Gender Split: ${gendersStr}
- Socio-Economic Tier Split: ${socioEconomicStr}
- Targeted Generations: ${generationsStr}
- Channels Active: ${platformsStr}
- Content Verticals: ${verticalsStr}
- Tone of Voice Guidelines: ${toneOfVoice || "None configured"}

Identify inconsistencies (e.g. targeting Gen Z and Luxury tier but ignoring TikTok or not writing in a witty, high-energy tone; or publishing Blog Articles without Curiosity/Education verticals).

Provide exactly 3 strategic, actionable recommendations in Spanish. 
Format your output ONLY as a valid JSON array of objects. Do not include markdown blocks like \`\`\`json or conversational text.

Schema:
[
  {
    "id": "rec_1",
    "title": "Action title in Spanish (e.g. Agregar Canal de TikTok)",
    "description": "Short reasoning in Spanish explaining the mismatch and recommendation (1-2 sentences).",
    "type": "platform" | "vertical" | "tone",
    "actionValue": "Value to merge. If type is 'platform', the platform ID (e.g. 'tiktok'). If type is 'vertical', the vertical ID (e.g. 'curiosity'). If type is 'tone', a string with a recommended tone modifier (e.g. 'fresco, dinámico y rebelde')."
  }
]`;

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
        { error: errorData.error?.message || "Failed to generate strategy audit from OpenRouter" },
        { status: response.status }
      );
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "";

    // Parse and Clean JSON
    let cleanText = reply.trim();
    if (cleanText.startsWith("```json")) {
      cleanText = cleanText.substring(7);
    } else if (cleanText.startsWith("```")) {
      cleanText = cleanText.substring(3);
    }
    if (cleanText.endsWith("```")) {
      cleanText = cleanText.substring(0, cleanText.length - 3);
    }
    cleanText = cleanText.trim();

    // Robust extraction search for the JSON array boundaries
    const startIndex = cleanText.indexOf('[');
    const endIndex = cleanText.lastIndexOf(']');
    if (startIndex !== -1 && endIndex !== -1 && endIndex > startIndex) {
      cleanText = cleanText.substring(startIndex, endIndex + 1);
    }

    const recommendations = JSON.parse(cleanText);
    return NextResponse.json({ recommendations });
  } catch (error: any) {
    console.error("AI Strategy Audit Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to parse recommendations" },
      { status: 500 }
    );
  }
}
