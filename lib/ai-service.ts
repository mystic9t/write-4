import { GoogleGenerativeAI } from "@google/generative-ai";
import OpenAI from "openai";
import { AIProvider } from "@/contexts/SettingsContext";

/**
 * AI Service Module
 *
 * A modular service for interacting with various AI providers.
 * This can be reused across different projects by changing the agent types
 * and system prompts to match the specific use case.
 */

// Agent types - customize these for different projects
export type AgentType = 'world-building' | 'character-creation' | 'story-making';

// Response interface
export interface AIResponse {
  originalText: string;
  processedText: string;
}

// Configuration interface
export interface AIConfig {
  provider: AIProvider;
  temperature: number;
  maxTokens: number;
}

/**
 * Get API key for the specified provider
 * Checks both client-side storage and server-side environment variables
 */
const getApiKey = (provider: AIProvider): string => {
  if (typeof window === 'undefined') {
    // Server-side
    switch (provider) {
      case 'gemini':
        return process.env.GEMINI_API_KEY || '';
      case 'openai':
        return process.env.OPENAI_API_KEY || '';
      case 'anthropic':
        return process.env.ANTHROPIC_API_KEY || '';
      default:
        return '';
    }
  } else {
    // Client-side
    switch (provider) {
      case 'gemini':
        return localStorage.getItem('gemini-api-key') || '';
      case 'openai':
        return localStorage.getItem('openai-api-key') || '';
      case 'anthropic':
        return localStorage.getItem('anthropic-api-key') || '';
      default:
        return '';
    }
  }
};

/**
 * Get system prompt for each agent type
 * These prompts can be customized for different projects
 */
export function getAgentSystemPrompt(agentType: AgentType): string {
  switch (agentType) {
    case 'world-building':
      return "You are an expert world-building assistant. You help create detailed, consistent, and immersive fictional worlds with rich geography, cultures, magic systems, and history. Your responses should be creative, detailed, and logically consistent.";

    case 'character-creation':
      return "You are an expert character creation assistant. You help create compelling, three-dimensional characters with detailed profiles, backstories, relationships, and character arcs. Your characters should feel realistic, with clear motivations, strengths, flaws, and potential for growth.";

    case 'story-making':
      return "You are an expert storytelling assistant. You help create engaging narratives with well-structured plots, vivid scenes, natural dialogue, and meaningful themes. Your stories should have clear arcs, compelling conflicts, and satisfying resolutions.";
  }
}

/**
 * Provider-specific implementation for Google Gemini
 */
async function processWithGemini(
  text: string,
  instruction: string,
  agentType: AgentType,
  temperature: number,
  maxTokens: number
): Promise<string> {
  const apiKey = getApiKey('gemini');
  if (!apiKey) throw new Error("Gemini API key not found");

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const systemPrompt = getAgentSystemPrompt(agentType);
  const prompt = `${systemPrompt}\n\n${instruction}:\n\n${text}`;

  const result = await model.generateContent({
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: temperature,
      maxOutputTokens: maxTokens,
    },
  });

  const response = result.response;
  return response.text();
}

/**
 * Provider-specific implementation for OpenAI
 */
async function processWithOpenAI(
  text: string,
  instruction: string,
  agentType: AgentType,
  temperature: number,
  maxTokens: number
): Promise<string> {
  const apiKey = getApiKey('openai');
  if (!apiKey) throw new Error("OpenAI API key not found");

  const openai = new OpenAI({ apiKey });
  const systemPrompt = getAgentSystemPrompt(agentType);

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: `${instruction}:\n\n${text}` }
    ],
    temperature: temperature,
    max_tokens: maxTokens
  });

  return response.choices[0].message.content || text;
}

/**
 * Provider-specific implementation for Anthropic (placeholder)
 */
async function processWithAnthropic(
  text: string,
  instruction: string,
  agentType: AgentType,
  temperature: number,
  maxTokens: number
): Promise<string> {
  const apiKey = getApiKey('anthropic');
  if (!apiKey) throw new Error("Anthropic API key not found");

  // This is a placeholder - in a real implementation, you would use Anthropic's SDK
  // For now, we'll just return a message indicating this is not implemented
  return "Anthropic Claude integration is not yet implemented. Please use Gemini or OpenAI.";
}

/**
 * Generate mock responses for local testing or when no API keys are available
 */
function generateMockResponse(
  text: string,
  instruction: string,
  agentType: AgentType
): string {
  // Simple mock responses based on agent type
  switch (agentType) {
    case 'world-building':
      return `${text}\n\n[MOCK WORLD BUILDING RESPONSE]\nThis is a mock response for world building. In a real implementation, this would be generated by an AI model.\n\nGeography: Mountains in the north, forests in the center, and coastal regions to the south.\nCultures: Three main societies - nomadic tribes in the mountains, agricultural communities in the forests, and seafaring merchants along the coast.\nMagic System: Magic is derived from natural elements and requires years of study.\nHistory: The world has gone through three major ages, with the current era being one of rebuilding after a great calamity.`;

    case 'character-creation':
      return `${text}\n\n[MOCK CHARACTER CREATION RESPONSE]\nThis is a mock response for character creation. In a real implementation, this would be generated by an AI model.\n\nName: Elara Nightwind\nAppearance: Tall with silver hair and piercing blue eyes\nPersonality: Intelligent but socially awkward\nBackstory: Orphaned at a young age, raised by scholars\nMotivations: Seeks knowledge about her mysterious heritage`;

    case 'story-making':
      return `${text}\n\n[MOCK STORY CREATION RESPONSE]\nThis is a mock response for story creation. In a real implementation, this would be generated by an AI model.\n\nPlot: A young scholar discovers an ancient artifact that reveals secrets about her past.\nConflict: Powerful forces seek the artifact for their own purposes.\nResolution: The scholar must decide whether to use the artifact's power or destroy it to prevent it from falling into the wrong hands.`;
  }
}

/**
 * Determine the agent type based on the instruction
 */
function determineAgentType(instruction: string): AgentType {
  if (instruction.toLowerCase().includes('character')) {
    return 'character-creation';
  } else if (instruction.toLowerCase().includes('story') ||
             instruction.toLowerCase().includes('plot') ||
             instruction.toLowerCase().includes('scene') ||
             instruction.toLowerCase().includes('dialogue')) {
    return 'story-making';
  }
  return 'world-building';
}

/**
 * Main function to process text with the selected AI provider
 * This is the primary export that should be used by client code
 */
export async function processWithAI(
  text: string,
  instruction: string,
  provider: AIProvider = 'gemini',
  temperature: number = 0.7,
  maxTokens: number = 1500
): Promise<AIResponse> {
  try {
    // Determine which agent to use based on the instruction
    const agentType = determineAgentType(instruction);
    let processedText: string;

    // Process with the selected provider
    switch (provider) {
      case 'gemini':
        processedText = await processWithGemini(text, instruction, agentType, temperature, maxTokens);
        break;
      case 'openai':
        processedText = await processWithOpenAI(text, instruction, agentType, temperature, maxTokens);
        break;
      case 'anthropic':
        processedText = await processWithAnthropic(text, instruction, agentType, temperature, maxTokens);
        break;
      case 'local':
        processedText = generateMockResponse(text, instruction, agentType);
        break;
      default:
        throw new Error(`Unknown AI provider: ${provider}`);
    }

    return { originalText: text, processedText };
  } catch (error) {
    console.error("AI processing error:", error);
    throw error;
  }
}
