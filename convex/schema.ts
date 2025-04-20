import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  documents: defineTable({
    title: v.string(),
    content: v.string(),
    updatedAt: v.number(),
    userId: v.optional(v.string()),
  }).index("by_updatedAt", ["updatedAt"]),
  
  documentHistory: defineTable({
    documentId: v.id("documents"),
    content: v.string(),
    timestamp: v.number(),
    userId: v.optional(v.string()),
  }).index("by_documentId", ["documentId"]),
});
