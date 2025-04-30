// src/routes/authRoutes.ts
import express from "express";
import { registerUser, loginUser } from "../services/authService.js";
import { registerSchema, loginSchema } from "../validators/authSchemas.js";
import { validate } from "../middleware/validate.js";

const router = express.Router();

router.post("/register", validate(registerSchema), async (req, res) => {
  console.log("Register endpoint hit"); // Debugging line
  try {
    const { username, password } = req.body;
    const result = await registerUser(username, password);
    res.status(201).json(result);
  } catch (err: any) {
    if (err.message === "User already exists.") {
      res.status(409).json({ error: err.message });
    } else {
      console.error("Unexpected error during registration:", err);
      res.status(500).json({ error: "Internal server error" });
    }
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
