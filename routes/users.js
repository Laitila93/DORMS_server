import express from "express";
import bcrypt from "bcrypt";
import pool from "../db.js";
import jwt from "jsonwebtoken"; // Import jsonwebtoken

const router = express.Router();

// Create User
router.post("/createUser", async (req, res) => {
  const { name, password } = req.body || {};

  if (!name || !password) {
    return res.status(400).json({ error: "Username and password are required." });
  }

  try {
    const [existing] = await pool.query("SELECT * FROM users WHERE username = ?", [name]);

    if (existing.length > 0) {
      return res.status(409).json({ error: "User already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await pool.query(
      "INSERT INTO users (username, password) VALUES (?, ?)",
      [name, hashedPassword]
    );

    console.log("✅ Created new user with ID:", result.insertId);
    res.status(201).json({ success: true, userId: result.insertId });
  } catch (err) {
    console.error("❌ User creation error:", err);
    res.status(500).json({ error: "Internal server error." });
  }
});

export default router;









/*
// Login (Authenticate User & Issue Access Token)
router.post("/login", async (req, res) => {
  const { name, password } = req.body || {};

  if (!name || !password) {
    return res.status(400).json({ error: "Username and password are required." });
  }

  try {
    const [result] = await pool.query("SELECT * FROM users WHERE username = ?", [name]);

    if (result.length === 0) {
      console.log("❌ User does not exist");
      return res.status(404).json({ error: "User does not exist." });
    }

    const hashedPassword = result[0].password;
    const isMatch = await bcrypt.compare(password, hashedPassword);

    if (isMatch) {
      console.log("✅ Login successful");

      // Create JWT Token
      const payload = { userId: result[0].id, name: result[0].user };
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRATION });

      // Send the token in the response
      res.json({
        message: `${name} is logged in!`,
        token, // Include token in the response
      });
    } else {
      console.log("❌ Password incorrect");
      res.status(401).json({ error: "Password incorrect!" });
    }
  } catch (err) {
    console.error("❌ Login error:", err);
    res.status(500).json({ error: "Internal server error." });
  }
});
*/

