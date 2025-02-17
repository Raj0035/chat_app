import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import bodyParser from "body-parser"; 

import authRoutes from "./routes/auth.route.js";  // Import auth routes
import messageRoutes from "./routes/message.route.js";
import { connectDB } from "./lib/db.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(bodyParser.json({ limit: "50mb" }));
app.use(cookieParser());
app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true,
}));

// ✅ Debugging: Check if the auth routes are loaded
console.log("Auth routes are being registered...");

// Register routes
app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);

app.listen(PORT, () => {
    console.log("Server is running on PORT:" + PORT);
    connectDB();
});
