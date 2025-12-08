import { getDatabase } from "../database/db";
import { User } from "../types";

// ============================================
// #region CREATE USER
// ============================================

export const signUp = async (
  name: string,
  surname: string,
  role: "requester" | "sitter",
  email: string,
  username: string,
  password: string
): Promise<number> => {
  try {
    const db = await getDatabase();

    const result = await db.runAsync(
      `INSERT INTO users (name, surname, role, email, username, password)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [name, surname, role, email, username, password]
    );

    console.log("✅ Created user with ID:", result.lastInsertRowId);
    return result.lastInsertRowId;
  } catch (error) {
    console.error("❌ Error creating user:", error);
    throw error;
  }
};

// ============================================
// #region LOGIN
// ============================================

export const loginUser = async (
  email: string,
  password: string
): Promise<User | null> => {
  try {
    const db = await getDatabase();

    const user = await db.getFirstAsync<User>(
      `SELECT * FROM users WHERE email = ? AND password = ?`,
      [email, password]
    );

    return user || null;
  } catch (error) {
    console.error("❌ Login error:", error);
    throw error;
  }
};

// ============================================
// #region GET USER BY ID
// ============================================

export const getUserById = async (id: number): Promise<User | null> => {
  try {
    const db = await getDatabase();

    const user = await db.getFirstAsync<User>(
      "SELECT * FROM users WHERE id = ?",
      [id]
    );

    return user || null;
  } catch (error) {
    console.error("❌ Error fetching user:", error);
    throw error;
  }
};

// ============================================
// #region UPDATE USER PROFILE
// ============================================

export const updateUserProfile = async (
  id: number,
  name: string,
  surname: string,
  email: string,
  username: string
): Promise<void> => {
  try {
    const db = await getDatabase();

    await db.runAsync(
      `UPDATE users
       SET name = ?, surname = ?, email = ?, username = ?
       WHERE id = ?`,
      [name, surname, email, username, id]
    );

    console.log("🔄 Updated user profile:", id);
  } catch (error) {
    console.error("❌ Error updating user profile:", error);
    throw error;
  }
};

// ============================================
// #region UPDATE PASSWORD
// ============================================

export const updatePassword = async (
  id: number,
  password: string
): Promise<void> => {
  try {
    const db = await getDatabase();

    await db.runAsync(`UPDATE users SET password = ? WHERE id = ?`, [
      password,
      id,
    ]);

    console.log("Password updated:", id);
  } catch (error) {
    console.error("Error updating password:", error);
    throw error;
  }
};

// ============================================
// #region PROFILE IMAGE
// ============================================

export const updateProfileImage = async (
  id: number,
  imageUri: string | null
): Promise<void> => {
  try {
    const db = await getDatabase();

    await db.runAsync(`UPDATE users SET profileImage = ? WHERE id = ?`, [
      imageUri,
      id,
    ]);

    console.log("Updated profile image for user:", id);
  } catch (error) {
    console.error("Error updating profile image:", error);
    throw error;
  }
};
