import { NextRequest, NextResponse } from "next/server";
import { processWithAI } from "@/lib/ai-service";

export async function POST(req: NextRequest) {
  try {
    // Parse request body
    const body = await req.json();
    const { text, instruction, provider, temperature, maxTokens } = body;

    // Validate required fields
    if (!text || !instruction) {
      return NextResponse.json(
        { error: "Missing required fields: text and instruction are required" },
        { status: 400 }
      );
    }

    // Process the text with the AI service
    const result = await processWithAI(
      text,
      instruction,
      provider,
      temperature,
      maxTokens
    );

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("AI processing error:", error);

    // Return a more descriptive error message if available
    const errorMessage = error?.message || "Failed to process text";
    return NextResponse.json(
      { error: errorMessage, processedText: "Error: Unable to generate content. Please try again." },
      { status: 500 }
    );
  }
}
