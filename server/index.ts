import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import chatRoute from "./routes/openai"; // no need for file extension

import path from 'path';
dotenv.config({ path: '../.env' });

const app = express();

app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:3001", "http://localhost:3000", "http://localhost:5174"],
}));

app.use(express.json());
app.use('/api/chat', chatRoute);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));