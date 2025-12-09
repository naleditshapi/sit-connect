import * as SQLite from "expo-sqlite";
import { SitterType } from "../types";

let db: SQLite.SQLiteDatabase | null = null;

// ===========================================================
// #region OPEN DB
// ===========================================================
const openDB = async (): Promise<SQLite.SQLiteDatabase> => {
  if (!db) {
    db = await SQLite.openDatabaseAsync("sitconnect.db");
    console.log("📂 Database opened");
  }
  return db;
};
// #endregion OPEN DB

// ===========================================================
// #region INIT DATABASE
// Creates ALL tables
// ===========================================================
export const initDatabase = async (): Promise<void> => {
  try {
    const database = await openDB();

    console.log("Initializing database...");

    // ============================
    // #region USERS TABLE
    // ============================
    await database.execAsync(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        firstName TEXT NOT NULL,
        lastName TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT NOT NULL CHECK (role IN ('requester','sitter')),
        profileImage TEXT,
        createdAt TEXT DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log("Users table ready");
    // #endregion USERS TABLE

    // ============================
    // #region LISTINGS TABLE
    // ============================
    await database.execAsync(`
      CREATE TABLE IF NOT EXISTS listings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        creatorRoleId INTEGER NOT NULL,
        sitterType TEXT NOT NULL,
        location TEXT NOT NULL,
        startDate TEXT NOT NULL,
        endDate TEXT NOT NULL,
        description TEXT NOT NULL,
        createdAt TEXT NOT NULL,
        FOREIGN KEY (creatorRoleId) REFERENCES users(id) ON DELETE CASCADE
      );
    `);

    console.log("Listings table ready");
    // #endregion LISTINGS TABLE

    // ============================
    // #region SAVED LISTINGS TABLE
    // ============================
    await database.execAsync(`
      CREATE TABLE IF NOT EXISTS saved_listings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        listingId INTEGER NOT NULL,
        sitterRoleId INTEGER NOT NULL,
        savedAt TEXT NOT NULL,
        FOREIGN KEY (listingId) REFERENCES listings(id) ON DELETE CASCADE,
        FOREIGN KEY (sitterRoleId) REFERENCES users(id) ON DELETE CASCADE
      );
    `);

    console.log("Saved listings table ready");
    // #endregion SAVED LISTINGS TABLE

    // ============================
    // #region SEED LISTINGS
    // ============================
    const result = await database.getFirstAsync<{ count: number }>(
      "SELECT COUNT(*) as count FROM listings"
    );

    if (result && result.count === 0) {
      await seedSampleData(database);
    } else {
      console.log("Database already contains listings.");
    }

    console.log("Database initialization complete.");
  } catch (error) {
    console.error("Database initialization error:", error);
    throw error;
  }
  // #endregion INIT DATABASE
};

// ===========================================================
// #region SEED SAMPLE LISTINGS
// ===========================================================
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
// #endregion SEED SAMPLE LISTINGS

// ===========================================================
// #region GET DATABASE
// ===========================================================
export const getDatabase = async (): Promise<SQLite.SQLiteDatabase> => {
  return await openDB();
};

export default { initDatabase, getDatabase };
// #endregion GET DATABASE
