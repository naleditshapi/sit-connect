import * as SQLite from "expo-sqlite";
import { SitterType } from "../types";

let db: SQLite.SQLiteDatabase | null = null;

//Open database connection - Uses singleton pattern - only one instance
const openDB = async (): Promise<SQLite.SQLiteDatabase> => {
  if (!db) {
    db = await SQLite.openDatabaseAsync("sitconnect.db");
    console.log("📂 Database opened");
  }
  return db;
};

// Initialize database tables and seed sample data - Called once when app starts
export const initDatabase = async (): Promise<void> => {
  try {
    const database = await openDB();

    // #region Create listings table
    // This stores all sitting job postings
    await database.execAsync(`
      CREATE TABLE IF NOT EXISTS listings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        creatorRoleId INTEGER NOT NULL,
        sitterType TEXT NOT NULL,
        location TEXT NOT NULL,
        startDate TEXT NOT NULL,
        endDate TEXT NOT NULL,
        description TEXT NOT NULL,
        createdAt TEXT NOT NULL
      );
    `);

    console.log("Listings table ready");

    // #region Saved Listings
    // This stores which listings a sitter has bookmarked
    await database.execAsync(`
      CREATE TABLE IF NOT EXISTS saved_listings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        listingId INTEGER NOT NULL,
        sitterRoleId INTEGER NOT NULL,
        savedAt TEXT NOT NULL,
        FOREIGN KEY (listingId) REFERENCES listings(id) ON DELETE CASCADE
      );
    `);

    console.log("Saved listings table ready");

    // Check if we need to seed data
    const result = await database.getFirstAsync<{ count: number }>(
      "SELECT COUNT(*) as count FROM listings"
    );

    // Only seed if database is empty
    if (result && result.count === 0) {
      await seedSampleData(database);
    } else {
      console.log("Database already has data");
    }
  } catch (error) {
    console.error("Database initialization error:", error);
    throw error;
  }
};
// #endregion Create listings table

//#region Seed Data
const seedSampleData = async (
  database: SQLite.SQLiteDatabase
): Promise<void> => {
  const sampleListings = [
    {
      creatorRoleId: 1,
      sitterType: SitterType.PET,
      location: "Cape Town, Western Cape",
      startDate: "2025-01-10",
      endDate: "2025-01-20",
      description:
        "Looking for a reliable pet sitter for my two cats while I travel. They are friendly and low-maintenance.",
      createdAt: new Date().toISOString(),
    },
    {
      creatorRoleId: 1,
      sitterType: SitterType.HOUSE,
      location: "Stellenbosch, Western Cape",
      startDate: "2025-02-01",
      endDate: "2025-02-14",
      description:
        "Need someone to house sit our home in Stellenbosch. Must water plants and collect mail.",
      createdAt: new Date().toISOString(),
    },
    {
      creatorRoleId: 1,
      sitterType: SitterType.BOTH,
      location: "Johannesburg, Gauteng",
      startDate: "2025-03-05",
      endDate: "2025-03-15",
      description:
        "Looking for someone to watch our house and take care of our dog. Dog needs daily walks.",
      createdAt: new Date().toISOString(),
    },
    {
      creatorRoleId: 1,
      sitterType: SitterType.PET,
      location: "Durban, KwaZulu-Natal",
      startDate: "2025-01-25",
      endDate: "2025-02-05",
      description:
        "Need a pet sitter for my golden retriever. Very friendly and energetic, loves playing fetch.",
      createdAt: new Date().toISOString(),
    },
    {
      creatorRoleId: 1,
      sitterType: SitterType.HOUSE,
      location: "Pretoria, Gauteng",
      startDate: "2025-02-20",
      endDate: "2025-03-01",
      description:
        "House sitting needed for our apartment. Simple tasks include watering garden and maintaining security.",
      createdAt: new Date().toISOString(),
    },
  ];
  // #endregion Sample Listings

  // #region Insert each sample listing
  for (const listing of sampleListings) {
    await database.runAsync(
      `INSERT INTO listings (creatorRoleId, sitterType, location, startDate, endDate, description, createdAt)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        listing.creatorRoleId,
        listing.sitterType,
        listing.location,
        listing.startDate,
        listing.endDate,
        listing.description,
        listing.createdAt,
      ]
    );
  }
  console.log("Seeded 5 sample listings");
};
//#endregion Seed Data

// #region Get database
export const getDatabase = async (): Promise<SQLite.SQLiteDatabase> => {
  return await openDB();
};
// #endregion Get database

export default { initDatabase, getDatabase };
