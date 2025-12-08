# SitConnect - Pet & House Sitting Board

## About

SitConnect is a mobile app designed for the Softicat Summer Internship Technical Assignment. It demonstrates core React Native development skills including:

React Native with Expo (managed workflow)
TypeScript for type safety
Local data persistence with SQLite
React Navigation for screen management
Component-based architecture
CRUD operations

## Features

For Requesters ("I need a sitter")

- Create new sitting listings (pet, house, or both)
- View all your listings
- Edit existing listings
- Delete listings
- Specify location, dates, and description

For Sitters ("I am a sitter")

- Browse all available listings
- Filter by type (pet sitting, house sitting, both, or all)
- View detailed listing information
- Save/bookmark interesting listings
- View all saved listings

## Tech Stack

- React Native - Mobile framework
- Expo - Development platform
- TypeScript - Type safety
- React Navigation - Navigation library
- Expo SQLite - Local database
- React Native Screens - Native navigation performance
- React Native Safe Area Context - Safe area handling

## Diagrams

- ERD (diagrams/erd.png)
- Architecture (diagrams/architecture.png)

## Prerequisites

Before running this app, make sure you have:

- Node.js (v14 or higher)
- npm or yarn - Comes with Node.js
- Expo Go app on your Android/iOS device - Download from App Store/Google Play

## Installation

1. Clone the repository:
   git clone <repository-url>
   cd SitConnect

2. Install dependencies:
   npm install

3. Start the development server:
   npx expo start

## Running the App

Using Expo Go:

1. Make sure your phone and computer are on the same WiFi network
2. Open Expo Go app on your device
3. Scan the QR code from the terminal or Metro Bundler in your browser
4. App will load on your device

## Development Notes

Mock Authentication
Uses hardcoded role IDs (1 for requester, 2 for sitter)
In production, replace with real authentication system

Date Handling
Uses simple text input (YYYY-MM-DD format)
For production, implement proper date picker component

Web Support
App is designed for iOS/Android only
Web shows "not supported" message (SQLite limitation)

## Acknowledgments

- Expo team for excellent documentation
- React Navigation for routing solution
- TypeScript for type safety
- Softicat for the opportunity
