import { z } from "zod";

export const addToWatchlistSchema = z.object({
    status: z.enum([
        "PLANNED",
        "WATCHING",
        "COMPLETED",
        "DROPPED",
    ]).optional(),
    rating: z.coerce.number(),
    notes: z.string(),
});
