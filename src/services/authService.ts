// src/services/authService.ts
import bcrypt from "bcrypt";
import jwt, { SignOptions } from "jsonwebtoken";
import pool from "../db.js";
import type { RowDataPacket, ResultSetHeader } from "mysql2";
import type { StringValue } from "ms";


const SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS || "10", 10);
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRATION = process.env.JWT_EXPIRATION || "1h";

if (!JWT_SECRET) {
  throw new Error("❌ JWT_SECRET is not defined in environment variables.");
}

export async function registerUser(username: string, password: string) {
  const [rows]: [RowDataPacket[], any] = await pool.query(
    "SELECT id FROM users WHERE username = ?",
    [username]
  );

  if (rows.length > 0) {
    throw new Error("User already exists.");
  }

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
  const [result]: [ResultSetHeader, any] = await pool.query(
    "INSERT INTO users (username, password) VALUES (?, ?)",
    [username, hashedPassword]
  );

  return { userId: result.insertId };
}

export async function loginUser(username: string, password: string) {
  const [rows]: [RowDataPacket[], any] = await pool.query(
    "SELECT * FROM users WHERE username = ?",
    [username]
  );

  const user = rows[0];
  if (!user) {
    throw new Error("Invalid username or password.");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Invalid username or password.");
  }

  const payload = { userId: user.id, username };
  const options: SignOptions = {
    expiresIn: JWT_EXPIRATION as StringValue,
  };
  
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined.");
  }
  const token = jwt.sign(payload, JWT_SECRET, options);

  return { message: "Login successful", token };
}
