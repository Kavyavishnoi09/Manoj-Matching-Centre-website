import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import { User } from "./models/User.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
  path: path.resolve(__dirname, "../../.env"),
});

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  throw new Error("MONGO_URI is missing");
}

await mongoose.connect(MONGO_URI);

const newEmail = "vishnoikavya108@gmail.com";
const newPassword = "Kavya@MMC2026!";

// Existing admin ko role se find karo
const admin = await User.findOne({ role: "admin" });

if (!admin) {
  console.log("No admin user found");
} else {
  admin.email = newEmail;
  admin.password = newPassword;
  admin.role = "admin";
  admin.active = true;

  await admin.save();

  console.log("Admin credentials updated successfully.");
  console.log(`Email: ${newEmail}`);
  console.log("Password updated successfully.");
}

await mongoose.disconnect();