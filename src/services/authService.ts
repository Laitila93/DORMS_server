
/**
 * Authentication service for user management.
 * @module authService
 */

/**
 * Registers a new user in the system.
 * @param address - The address of the dorm
 * @param username - The username for the new account
 * @param password - The password for the new account
 * @throws {Error} If user already exists or if there's a database error
 * @returns {Promise<{dormID: number}>} The ID of the newly created dorm
 */

/**
 * Authenticates a user and generates a JWT token.
 * @param username - The username of the account
 * @param password - The password of the account
 * @throws {Error} If username/password combination is invalid
 * @returns {Promise<{message: string, token: string, dormID: number}>} Login success message, JWT token, and dorm ID
 */
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
  const connection = await pool.getConnection();
  await connection.beginTransaction();

  try {
    const [rows]: [RowDataPacket[], any] = await connection.query(
      "SELECT dormID FROM dorms WHERE username = ?",
      [username]
    );
    console.log("Username:", username); // Debugging line

    if (rows.length > 0) {
      throw new Error("User already exists.");
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const [result]: [ResultSetHeader, any] = await connection.query(
      "INSERT INTO dorms (address, username, password) VALUES (?, ?, ?)",
      [address, username, hashedPassword]
    );
    const dormID = result.insertId;
    console.log("dormID gotten from db while creating user:", dormID);

    await connection.query(
      "INSERT INTO equipped_fishes (dormID, fishID, position) VALUES (?, 2, 1), (?, 2, 2), (?, 2, 3), (?, 2, 4), (?, 2, 5), (?, 2, 6)",
      [dormID, dormID, dormID, dormID, dormID, dormID]
    );

    await connection.query(
      "INSERT INTO equipped_fish_hats (dormID, position, hatID) VALUES (?, 1, 1), (?, 2, 1), (?, 3, 1), (?, 4, 1), (?, 5, 1), (?, 6, 1)",
      [dormID, dormID, dormID, dormID, dormID, dormID]
    );

    await connection.query(
      "INSERT INTO equipped_special (dormID, specialID) VALUES (?, 1)",
      [dormID]
    );

    await connection.query(
      "INSERT INTO equipped_background (dormID, background) VALUES (?, ?)",
      [dormID, 'https://i.imgur.com/9T34bA9.png']
    );

    await connection.commit();
    console.log("User registration committed successfully.");
    return { dormID };

  } catch (error) {
    await connection.rollback();
    console.error("Transaction rolled back due to error:", error);
    throw error;

  } finally {
    connection.release();
  }
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

  const token = jwt.sign(payload, JWT_SECRET!, options);
  return { message: "Login successful", token, dormID: user.dormID };
}
