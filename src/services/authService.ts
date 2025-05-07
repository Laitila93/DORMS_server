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

export async function registerUser(address: string, username: string, password: string) {
  const [rows]: [RowDataPacket[], any] = await pool.query(
    "SELECT dormID FROM dorms WHERE username = ?",
    [username]
  );
  console.log("Username:", username); // Debugging line

  if (rows.length > 0) {
    throw new Error("User already exists.");
  }

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
  const [result]: [ResultSetHeader, any] = await pool.query(
    "INSERT INTO dorms (address, username, password) VALUES (?, ?, ?)",
    [address, username, hashedPassword]
  );
  console.log("Insert result:", result); // Debugging line
  return { dormID: result.insertId };
}

export async function loginUser(username: string, password: string) {
  const [rows]: [RowDataPacket[], any] = await pool.query(
    "SELECT * FROM dorms WHERE username = ?",
    [username]
  );
  console.log("Login attempt for username:", username); // Debugging line
  const user = rows[0];
  if (!user) {
    throw new Error("Invalid username or password.");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Invalid username or password.");
  }

  const payload = { dormID: user.dormID, username };
  const options: SignOptions = {
    expiresIn: JWT_EXPIRATION as StringValue,
  };
  
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined.");
  }
  const token = jwt.sign(payload, JWT_SECRET, options);
  return { message: "Login successful", token, dormID: user.dormID };
}
