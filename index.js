// app.js
import express from "express";
import connectToDatabase from "./db/mongodb.js";
import shortUrlRoutes from "./routes/shortUrl.js";
import { configDotenv } from "dotenv";

configDotenv();
const app = express();
app.use(express.json());

// Use the short URL routes
app.use(shortUrlRoutes);

connectToDatabase().then(() => {
  app.listen(3000, () => {
    console.log("🚀 Server is running on port 3000");
  });
});
