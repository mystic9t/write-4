import { diff_match_patch } from "diff-match-patch";

export interface TextDiff {
  text: string;
  added: boolean;
  removed: boolean;
}

export function computeLineDiff(oldText: string, newText: string): TextDiff[][] {
  const dmp = new diff_match_patch();
  const diffs = dmp.diff_main(oldText, newText);
  dmp.diff_cleanupSemantic(diffs);
  
  // Convert character diffs to line diffs
  const oldLines = oldText.split("\n");
  const newLines = newText.split("\n");
  
  const lineDiffs: TextDiff[][] = [];
  let currentLineDiff: TextDiff[] = [];
  let lineIndex = 0;
  
  // Initialize with empty lines
  for (let i = 0; i < Math.max(oldLines.length, newLines.length); i++) {
    lineDiffs.push([]);
  }
  
  // Process diffs into line-by-line format
  diffs.forEach(([type, text]) => {
    const lines = text.split("\n");
    let currentLineText = "";
    
    lines.forEach((line, i) => {
      if (i > 0) {
        // Add the current diff to the current line
        if (currentLineText) {
          lineDiffs[lineIndex].push({
            text: currentLineText,
            added: type === 1,
            removed: type === -1,
          });
        }
        
        lineIndex++;
        currentLineText = "";
      }
      
      currentLineText += line;
      
      if (i === lines.length - 1) {
        if (currentLineText) {
          // Ensure we have an array for this line
          if (!lineDiffs[lineIndex]) {
            lineDiffs[lineIndex] = [];
          }
          
          lineDiffs[lineIndex].push({
            text: currentLineText,
            added: type === 1,
            removed: type === -1,
          });
        }
      }
    });
  });
  
  // Clean up empty lines
  return lineDiffs.filter(line => line.length > 0);
}
