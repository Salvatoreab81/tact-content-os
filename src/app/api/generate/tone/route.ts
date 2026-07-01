import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { brandName, industry, targetAudience, presets, model, apiKey: userApiKey } = body;

    if (!brandName || !industry) {
      return NextResponse.json(
        { error: "Missing required fields: brandName, industry" },
        { status: 400 }
      );
    }

    const apiKey = userApiKey || process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "OpenRouter API Key is not configured. Please supply one in Onboarding or set OPENROUTER_API_KEY in the environment." },
        { status: 500 }
      );
    }

    let defaultModel = process.env.OPENROUTER_MODEL || "google/gemini-2.0-flash";
    if (defaultModel.includes("gemini-2.0-flash-exp")) {
      defaultModel = "google/gemini-2.0-flash";
    }
    const selectedModel = model || defaultModel;

    const systemPrompt = `You are an expert Brand Identity and Voice Consultant. Your job is to define a precise, high-impact, and strategic tone of voice guideline for brands.`;

    const marketsStr = targetAudience?.markets?.length ? targetAudience.markets.join(", ") : "Global";
    const gendersStr = targetAudience?.genders
      ? `Men: ${targetAudience.genders.men || 50}%, Women: ${targetAudience.genders.women || 50}%`
      : "Balanced (50% Men, 50% Women)";
    const generationsStr = targetAudience?.generations?.length ? targetAudience.generations.join(", ") : "All generations";
    const socioEconomicStr = targetAudience?.socioEconomic
      ? `A/B (Luxury): ${targetAudience.socioEconomic.ab || 0}%, C+ (Premium): ${targetAudience.socioEconomic.cplus || 0}%, C (Mass): ${targetAudience.socioEconomic.c || 0}%, D/E (Low Cost): ${targetAudience.socioEconomic.de || 0}%`
      : "All levels";
    const presetsStr = presets?.length ? presets.join(", ") : "Professional, friendly";

    const userPrompt = `Please write a professional, strategic, and high-impact tone of voice guideline in Spanish for the following brand:
- Brand Name: ${brandName}
- Industry: ${industry}
- Target Demographic Markets: ${marketsStr}
- Target Demographics (Gender): ${gendersStr}
- Target Demographics (Generations): ${generationsStr}
- Target Socio-Economic Profile: ${socioEconomicStr}
- Preferred Tone Descriptors: ${presetsStr}

Structure your response exactly as follows (use these exact headings):
Voz: [A strategic description of the brand's personality and character in 2-3 sentences]
Tono: [A detailed explanation of how the brand speaks to its audience, including what to do and what to avoid]
Ejemplo práctico: [A short example phrase or post demonstrating the tone]

Write the guidelines directly. Do not include any introductory remarks, conversational greetings, quotes, or markdown code blocks. Write it entirely in Spanish.`;

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
        { error: errorData.error?.message || "Failed to generate brand tone from OpenRouter" },
        { status: response.status }
      );
    }

    const data = await response.json();
    const toneOfVoice = data.choices?.[0]?.message?.content?.trim() || "";

    return NextResponse.json({ toneOfVoice });
  } catch (error: any) {
    console.error("AI Tone Suggestion Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate tone" },
      { status: 500 }
    );
  }
}
