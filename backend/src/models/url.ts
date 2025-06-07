
import { z } from "zod";

export const ShortenUrlSchemaInput = z.object({
    original_url: z.string().url(),
});

export type ShortenUrlInput = z.infer<typeof ShortenUrlSchemaInput>;

