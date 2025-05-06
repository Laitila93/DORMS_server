// src/validators/authSchemas.ts
import { z } from "zod";

export const registerSchema = z.object({
  address: z.string().min(3),
  username: z.string().min(3),
  password: z.string().min(6),
});

export const loginSchema = registerSchema; // Same fields
