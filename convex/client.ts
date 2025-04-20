import { ConvexClient } from "convex/browser";

// Create a Convex client
export const convex = new ConvexClient(process.env.NEXT_PUBLIC_CONVEX_URL || "");
