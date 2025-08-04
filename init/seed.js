// scripts/seed.js
import dotenv from 'dotenv';
dotenv.config();

import { connectToDB } from "../utils/database.js";
import Listing from "../models/listing.js";
import sampleListings from "../init/data.js";

async function seedDatabase() {
  try {
    await connectToDB();
    await Listing.deleteMany({});
    await Listing.insertMany(sampleListings);
    console.log("✅ Database seeded successfully.");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
  }
}

seedDatabase();