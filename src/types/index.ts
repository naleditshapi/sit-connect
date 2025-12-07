// Blueprints for data
// They help TypeScript catch errors before runtime

// #region Sitter Type Interface
export enum SitterType {
  PET = "pet", // Just pets
  HOUSE = "house", // Just house
  BOTH = "both", // Both pets and house
}

// #region User Role Interface
export enum UserRole {
  REQUESTER = "requester", // "I need a sitter"
  SITTER = "sitter", // "I am a sitter"
}

// #region Listing Interface
export interface Listing {
  id: number; // Unique identifier
  creatorRoleId: number; // Who created this? (mock: 1)
  sitterType: SitterType; // What service needed?
  location: string; // Where?
  startDate: string; // ISO format: "2025-01-15"
  endDate: string;
  description: string; // Details about the job
  createdAt: string; // When was this posted?
}

// #region Nav Screen Data
export type RootStackParamList = {
  RoleSelection: undefined;
  RequesterHome: undefined;
  CreateListing: undefined;
  MyListings: undefined;
  EditListing: { listingId: number };
  BrowseListings: undefined;
  ListingDetails: { listingId: number };
  SavedListings: undefined;
  SitterHome: undefined;
};
