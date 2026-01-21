import express from "express";
import { config } from "dotenv";
import { connectDB, disConnectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";

config();
connectDB();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API routes
app.use("/auth", authRoutes);

const PORT = 5001;
const server = app.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT}`);
});

// Handle unhandled promise rejections 
process.on("unhandledRejection", (err) => {
    console.error("Unhandle Rejection: ", err);
    server.close(async () => {
        await disConnectDB();
        process.exit(1);
    })
})

// Handle uncaught exception
process.on("uncaughtException", async (err) => {
    console.error("Uncaught Exception: ", err);
    await disConnectDB();
    process.exit(1);
})

// Graceful shutdown
process.on("SIGTERM", async () => {
    console.log("SIGTERM received, shutting down gracefully");
    server.close(async () => {
        await disConnectDB();
        process.exit(0);
    })
})
