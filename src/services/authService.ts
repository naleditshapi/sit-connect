import AsyncStorage from "@react-native-async-storage/async-storage";
import { getDatabase } from "../database/db";
import { User, UserRole } from "../types";

// ============================================
// #region CREATE USER (SIGN UP)
// ============================================
export const signUp = async (
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  role: UserRole
): Promise<User> => {
  try {
    const db = await getDatabase();

    // Check if email already exists
    const existing = await db.getFirstAsync<User>(
      "SELECT * FROM users WHERE email = ?",
      [email.toLowerCase()]
    );

    if (existing) {
      throw new Error("Email already exists");
    }

    // Insert new user
    const result = await db.runAsync(
      `INSERT INTO users (firstName, lastName, email, password, role, createdAt)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        firstName,
        lastName,
        email.toLowerCase(),
        password,
        role,
        new Date().toISOString(),
      ]
    );

    // Fetch the newly created user
    const user = await db.getFirstAsync<User>(
      "SELECT * FROM users WHERE id = ?",
      [result.lastInsertRowId]
    );

    if (!user) {
      throw new Error("Failed to create user");
    }

    console.log("✅ User created:", user.email);
    return user;
  } catch (error) {
    console.error("❌ Error signing up:", error);
    throw error;
  }
};

// ============================================
// #region LOGIN
// ============================================
export const login = async (email: string, password: string): Promise<User> => {
  try {
    const db = await getDatabase();

    const user = await db.getFirstAsync<User>(
      "SELECT * FROM users WHERE email = ? AND password = ?",
      [email.toLowerCase(), password]
    );

    if (!user) {
      throw new Error("Invalid email or password");
    }

    console.log("✅ User logged in:", user.email);
    return user;
  } catch (error) {
    console.error("❌ Error logging in:", error);
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
  firstName: string,
  lastName: string,
  email: string
): Promise<void> => {
  try {
    const db = await getDatabase();
    await db.runAsync(
      `UPDATE users SET firstName = ?, lastName = ?, email = ? WHERE id = ?`,
      [firstName, lastName, email, id]
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
    await db.runAsync("UPDATE users SET password = ? WHERE id = ?", [
      password,
      id,
    ]);
    console.log("✅ Password updated:", id);
  } catch (error) {
    console.error("❌ Error updating password:", error);
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
    await db.runAsync("UPDATE users SET profileImage = ? WHERE id = ?", [
      imageUri,
      id,
    ]);
    console.log("✅ Updated profile image for user:", id);
  } catch (error) {
    console.error("❌ Error updating profile image:", error);
    throw error;
  }
};

export const getCurrentUser = async () => {
  // Implementation to get the current logged-in user
  // This should return the user object with an id property
  // Example implementation:
  try {
    // Replace with your actual auth logic (e.g., AsyncStorage, Firebase, etc.)
    const userJson = await AsyncStorage.getItem("currentUser");
    if (userJson) {
      return JSON.parse(userJson);
    }
    return null;
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
};
