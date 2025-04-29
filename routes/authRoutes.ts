// src/routes/authRoutes.ts
import express from "express";
import { registerUser, loginUser } from "../services/authService";
import { registerSchema, loginSchema } from "../validators/authSchemas";
import { validate } from "../middleware/validate";

const router = express.Router();

router.post("/register", validate(registerSchema), async (req, res) => {
  try {
    const { username, password } = req.body;
    const result = await registerUser(username, password);
    res.status(201).json(result);
  } catch (err: any) {
    res.status(409).json({ error: err.message });
  }
});

router.post("/login", validate(loginSchema), async (req, res) => {
  try {
    const { username, password } = req.body;
    const result = await loginUser(username, password);
    res.json(result);
  } catch (err: any) {
    res.status(401).json({ error: err.message });
  }
});

export default router;
