import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import chatRoute from "./routes/openai"; // no need for file extension

dotenv.config();

const app = express();

app.use(cors({
  origin: ["http://localhost:5173"],
}));

app.use(express.json());
app.use('/api/chat', chatRoute);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
