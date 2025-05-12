// src/middleware/validate.ts
import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";

export const validate = (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
  try {
    schema.parse(req.body);
    next();
  } catch (err: any) {
    const errorMessage = err.errors ? JSON.stringify(err.errors) : "Invalid request data";
    res.status(400).send(errorMessage);
  }
};
