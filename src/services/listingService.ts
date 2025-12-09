import { getDatabase } from "../database/db";
import { Listing, SitterType } from "../types";

// ============================================
// #region CREATE Operations
// ============================================

//Create a new listing - @returns The ID of the newly created listing
export const createListing = async (
  creatorRoleId: number,
  sitterType: SitterType,
  location: string,
  startDate: string,
  endDate: string,
  description: string
): Promise<number> => {
  try {
    const db = await getDatabase();

    // runAsync executes INSERT/UPDATE/DELETE and returns metadata
    const result = await db.runAsync(
      `INSERT INTO listings (creatorRoleId, sitterType, location, startDate, endDate, description, createdAt)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        creatorRoleId,
        sitterType,
        location,
        startDate,
        endDate,
        description,
        new Date().toISOString(),
      ]
    );

    console.log("Created listing with ID:", result.lastInsertRowId);
    return result.lastInsertRowId;
  } catch (error) {
    console.error("Error creating listing:", error);
    throw error;
  }
};

// ============================================
// #region READ Operations
// ============================================

// Get all listings (for sitters browsing) - @returns Array of all listings, newest first
export const getAllListings = async (): Promise<Listing[]> => {
  try {
    const db = await getDatabase();

    // getAllAsync fetches multiple rows
    const listings = await db.getAllAsync<Listing>(
      "SELECT * FROM listings ORDER BY createdAt DESC"
    );

    console.log(`📋 Fetched ${listings.length} listings`);
    return listings;
  } catch (error) {
    console.error("Error fetching listings:", error);
    throw error;
  }
};

// Get listings created by a specific user (for "My Listings" screen)
export const getListingsByCreator = async (
  creatorUserId: number
): Promise<Listing[]> => {
  try {
    const db = await getDatabase();

    const listings = await db.getAllAsync<Listing>(
      "SELECT * FROM listings WHERE creatorRoleId = ? ORDER BY createdAt DESC",
      [creatorUserId]
    );

    return listings;
  } catch (error) {
    console.error("❌ Error fetching listings by creator:", error);
    throw error;
  }
};

//Get a single listing by ID - @returns Listing object or null if not found
export const getListingById = async (id: number): Promise<Listing | null> => {
  try {
    const db = await getDatabase();

    // getFirstAsync fetches only the first matching row
    const listing = await db.getFirstAsync<Listing>(
      "SELECT * FROM listings WHERE id = ?",
      [id]
    );

    return listing || null;
  } catch (error) {
    console.error("Error fetching listing by ID:", error);
    throw error;
  }
};

// Filter listings by sitter type - Handles the special case where 'both' matches both specific types
export const filterListingsByType = async (
  sitterType: SitterType | "all"
): Promise<Listing[]> => {
  try {
    const db = await getDatabase();

    if (sitterType === "all") {
      return await getAllListings();
    }

    if (sitterType === SitterType.BOTH) {
      return await db.getAllAsync<Listing>(`
        SELECT * FROM listings WHERE sitterType = "both"
        ORDER BY createdAt DESC
      `);
    }

    // ONLY return exact type — no both
    const listings = await db.getAllAsync<Listing>(
      `SELECT * FROM listings WHERE sitterType = ? ORDER BY createdAt DESC`,
      [sitterType]
    );

    return listings;
  } catch (error) {
    console.error("Error filtering listings:", error);
    throw error;
  }
};

// ============================================
// #region UPDATE Operations
// ============================================

// Update existing listing
export const updateListing = async (
  id: number,
  sitterType: SitterType,
  location: string,
  startDate: string,
  endDate: string,
  description: string
): Promise<void> => {
  try {
    const db = await getDatabase();

    await db.runAsync(
      `UPDATE listings 
       SET sitterType = ?, location = ?, startDate = ?, endDate = ?, description = ?
       WHERE id = ?`,
      [sitterType, location, startDate, endDate, description, id]
    );

    console.log("Updated listing:", id);
  } catch (error) {
    console.error("Error updating listing:", error);
    throw error;
  }
};

// ============================================
// #region DELETE Operations
// ============================================

// Delete a listing - CASCADE will automatically delete related saved_listings entries
export const deleteListing = async (id: number): Promise<void> => {
  try {
    const db = await getDatabase();

    await db.runAsync("DELETE FROM listings WHERE id = ?", [id]);

    console.log("Deleted listing:", id);
  } catch (error) {
    console.error("Error deleting listing:", error);
    throw error;
  }
};

// ============================================
// #region SAVED LISTINGS
// ============================================

// Save/bookmark a listing for a sitter
export const saveListingForSitter = async (
  listingId: number,
  sitterRoleId: number
): Promise<void> => {
  try {
    const db = await getDatabase();

    // First check if already saved (prevent duplicates)
    const existing = await db.getFirstAsync(
      "SELECT * FROM saved_listings WHERE listingId = ? AND sitterRoleId = ?",
      [listingId, sitterRoleId]
    );

    if (existing) {
      console.log("Listing already saved");
      return;
    }

    // Insert new saved listing
    await db.runAsync(
      "INSERT INTO saved_listings (listingId, sitterRoleId, savedAt) VALUES (?, ?, ?)",
      [listingId, sitterRoleId, new Date().toISOString()]
    );

    console.log("Saved listing:", listingId);
  } catch (error) {
    console.error("Error saving listing:", error);
    throw error;
  }
};

// Unsave/remove bookmark from a listing
export const unsaveListingForSitter = async (
  listingId: number,
  sitterRoleId: number
): Promise<void> => {
  try {
    const db = await getDatabase();

    await db.runAsync(
      "DELETE FROM saved_listings WHERE listingId = ? AND sitterRoleId = ?",
      [listingId, sitterRoleId]
    );

    console.log("Unsaved listing:", listingId);
  } catch (error) {
    console.error("Error unsaving listing:", error);
    throw error;
  }
};

// Check if a listing is saved by a sitter
export const isListingSaved = async (
  listingId: number,
  sitterRoleId: number
): Promise<boolean> => {
  try {
    const db = await getDatabase();

    const result = await db.getFirstAsync(
      "SELECT * FROM saved_listings WHERE listingId = ? AND sitterRoleId = ?",
      [listingId, sitterRoleId]
    );

    return result !== null;
  } catch (error) {
    console.error("Error checking if listing is saved:", error);
    throw error;
  }
};

// Get all saved listings for a sitter
export const getSavedListingsForSitter = async (
  sitterRoleId: number
): Promise<Listing[]> => {
  try {
    const db = await getDatabase();

    // JOIN: Combine saved_listings with listings table
    // This gets the full listing data, not just IDs
    const listings = await db.getAllAsync<Listing>(
      `SELECT l.* FROM listings l
       INNER JOIN saved_listings sl ON l.id = sl.listingId
       WHERE sl.sitterRoleId = ?
       ORDER BY sl.savedAt DESC`,
      [sitterRoleId]
    );

    console.log(`Fetched ${listings.length} saved listings`);
    return listings;
  } catch (error) {
    console.error("Error fetching saved listings:", error);
    throw error;
  }
};
