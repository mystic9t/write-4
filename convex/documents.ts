import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { Doc, Id } from "./_generated/dataModel";

export const get = query({
  args: { id: v.optional(v.id("documents")) },
  handler: async (ctx, args) => {
    if (!args.id) return null;
    return await ctx.db.get(args.id);
  },
});

export const getAll = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("documents")
      .order("desc", "updatedAt")
      .collect();
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = null; // Add authentication later
    const documentId = await ctx.db.insert("documents", {
      title: args.title,
      content: args.content,
      updatedAt: Date.now(),
      userId,
    });
    
    await ctx.db.insert("documentHistory", {
      documentId,
      content: args.content,
      timestamp: Date.now(),
      userId,
    });
    
    return documentId;
  },
});

export const update = mutation({
  args: {
    id: v.id("documents"),
    content: v.string(),
    title: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = null; // Add authentication later
    
    const document = await ctx.db.get(args.id);
    if (!document) {
      throw new Error("Document not found");
    }
    
    // Save to history if content changed
    if (document.content !== args.content) {
      await ctx.db.insert("documentHistory", {
        documentId: args.id,
        content: document.content,
        timestamp: Date.now(),
        userId,
      });
    }
    
    // Update the document
    await ctx.db.patch(args.id, {
      content: args.content,
      ...(args.title ? { title: args.title } : {}),
      updatedAt: Date.now(),
    });
    
    return args.id;
  },
});
