// #region Sitter Type Enums
export enum SitterType {
  PET = "pet",
  HOUSE = "house",
  BOTH = "both",
}
// #endregion Sitter Type Enums

// #region User Role Enums
export enum UserRole {
  REQUESTER = "requester",
  SITTER = "sitter",
}
// #endregion User Role Enums

// #region User Type
export type User = {
  name: string;
  surname: string;
  email: string;
  username: string;
  role: "requester" | "sitter";
  profileImage?: string;
};
// #endregion User Type

// #region Listing Type
export interface Listing {
  id: number;
  creatorRoleId: number;
  sitterType: SitterType;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
  pricePerDay: number;
  createdAt: string;
}
// #endregion Listing Type

// #region Root Stack Param List
export type RootStackParamList = {
  Landing: undefined;
  Login: undefined;
  SignUp: undefined;

  // Tab Navigators
  RequesterTabs: undefined;
  SitterTabs: undefined;

  // Requester Screens
  RequesterHomeNew: undefined;
  RequesterProfile: undefined;
  CreateListing: undefined;
  MyListings: undefined;
  EditListing: { listingId: number };

  // Sitter Screens
  SitterHomeNew: undefined;
  BrowseListings: undefined;
  SavedListings: undefined;
  SitterProfile: undefined;

  // Profile Screens
  EditProfile: { listingsId: number };
  ChangePassword: undefined;
  NotificationSettings: undefined;

  // Browse
  BrowseSitters: undefined;
  ListingDetails: { listingId: number };

  // Legacy (keep for now)
  RequesterHome: undefined;
  SitterHome: undefined;

  AboutApp: undefined;
};
// #endregion Root Stack Param List
