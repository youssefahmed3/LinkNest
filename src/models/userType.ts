import { z } from "zod";

export const CreateUserSchemaInput = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(6),
});

export type createUserInput = z.infer<typeof CreateUserSchemaInput>;