import { NextRequest, NextResponse } from "next/server";
import { getAllBrands } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { platform, vertical, topic, model } = body;

    if (!platform || !vertical || !topic) {
      return NextResponse.json(
        { error: "Missing required fields: platform, vertical, topic" },
        { status: 400 }
      );
    }

    // 1. Get Brand Guidelines
    const brands = await getAllBrands();
    if (!brands || brands.length === 0) {
      return NextResponse.json(
        { error: "No brand guidelines found. Please configure onboarding first." },
        { status: 400 }
      );
    }
    const brand = brands[0];

    // 2. OpenRouter Configuration
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "OPENROUTER_API_KEY is not configured in environment variables." },
        { status: 500 }
      );
    }

    const defaultModel = process.env.OPENROUTER_MODEL || "google/gemini-2.0-flash-exp:free";
    const selectedModel = model || defaultModel;

    // 3. Construct Prompts
    const systemPrompt = `You are an expert AI Content Strategist and Copywriter. Your job is to create high-converting, professional, and tailored social media content based on the provided brand guidelines, target market, content vertical, and platform constraints.`;

    const userPrompt = `Brand Guidelines:
- Name: ${brand.name}
- Industry: ${brand.industry}
- Tone of Voice: ${brand.tone_of_voice || brand.toneOfVoice || "Engaging and professional"}
- Target Markets: ${brand.markets ? brand.markets.join(", ") : "Global"}

Request Details:
- Target Platform: ${platform}
- Content Vertical: ${vertical}
- Topic/Theme: ${topic}

Generate exactly 2 alternative content options suitable for the selected platform: ${platform}. 
Format the response ONLY as a JSON array of objects. Do not write any markdown code blocks, explanatory text, or conversational intros/outros.

JSON Schema to follow:
[
  {
    "title": "Short title or hook",
    "caption": "The complete caption or script, structured with line breaks, emojis, and specific content relevant to the platform.",
    "hashtags": "Space-separated hashtags",
    "type": "E.g. Carousel Post, Reel Script, Single Post, Thread, Article, etc."
  }
]`;

    // 4. Send request to OpenRouter
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
        { error: errorData.error?.message || "Failed to generate content from OpenRouter" },
        { status: response.status }
      );
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "";

    // 5. Parse and Clean response JSON
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

    try {
      const parsedContent = JSON.parse(cleanText);
      return NextResponse.json(parsedContent);
    } catch (parseError) {
      console.error("JSON parse error on AI response:", reply, parseError);
      return NextResponse.json(
        { error: "AI returned invalid JSON format. Please try again.", raw: reply },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("Content generation error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process content generation" },
      { status: 500 }
    );
  }
}
