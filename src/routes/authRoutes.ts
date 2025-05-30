
/**
 * Express router for handling authentication routes.
 * 
 * @module authRoutes
 * 
 * @route POST /register
 * @description Register a new user
 * @body {Object} body - Request body
 * @body {string} body.address - User's address
 * @body {string} body.username - User's username
 * @body {string} body.password - User's password
 * @returns {Object} 201 - Registration successful
 * @throws {409} - User already exists
 * @throws {500} - Internal server error
 * 
 * @route POST /login
 * @description Authenticate a user
 * @body {Object} body - Request body
 * @body {string} body.username - User's username
 * @body {string} body.password - User's password
 * @returns {Object} 200 - Login successful with token
 * @throws {401} - Authentication failed
 */
import express from "express";
import { registerUser, loginUser } from "../services/authService.js";
import { registerSchema, loginSchema } from "../validators/authSchemas.js";
import { validate } from "../middleware/validate.js";

const router = express.Router();

router.post("/register", validate(registerSchema), async (req, res) => {
  try {
    const { address, username, password } = req.body;
    const result = await registerUser(address, username, password);
    res.status(201).json(result);
  } catch (err: any) {
    if (err.message === "User already exists.") {
      res.status(409).json({ error: err.message });
    } else {
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
