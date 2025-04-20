import { action } from "./_generated/server";
import { v } from "convex/values";

export const processText = action({
  args: {
    text: v.string(),
    instruction: v.string(),
  },
  handler: async (ctx, args) => {
    // This would be your LLM API call
    // For now, we'll return a mock response to demonstrate the flow
    // Replace this with actual API call to OpenAI/Anthropic/etc.
    
    // Mock processing - this simulates an LLM improving the text
    let processedText = args.text;
    
    if (args.instruction.includes("improve")) {
      processedText = args.text
        .split("\n")
        .map(line => {
          if (line.trim() === "") return line;
          if (Math.random() > 0.7) {
            return line + " (improved with additional context)";
          }
          return line;
        })
        .join("\n");
    } else if (args.instruction.includes("summarize")) {
      processedText = "Summary: " + args.text.substring(0, args.text.length / 3);
    } else {
      // Default transform
      processedText = args.text;
    }
    
    return { originalText: args.text, processedText };
  },
});
