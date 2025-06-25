import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import chatRoute from "./routes/openai";
import path from "path";

// Based on your folder structure: project/server/index.ts
// The .env file is at: project/.env
// So we need to go up one level from server folder to project root
const envPath = path.resolve(__dirname, "../.env");
console.log("Looking for .env at:", envPath);

// Load the .env file
dotenv.config({ path: envPath });

// Debug: Check if the environment variable is loaded
console.log("OPENAI_API_KEY:", process.env.OPENAI_API_KEY ? "✅ LOADED" : "❌ NOT LOADED");
console.log("PORT:", process.env.PORT || "Not set");

const app = express();

app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:3001", "http://localhost:3000", "http://localhost:4000"]
}));

app.use(express.json());
app.use('/api/chat', chatRoute);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));