// db.js or database.js
import mongoose from "mongoose";

const MONGO_URI =
  process.env.DATABASEURL ||
  "mongodb+srv://tusharshitole6767:Tshitole@cluster0.9otsf99.mongodb.net/shortner?retryWrites=true&w=majority&appName=Cluster0";
console.log(MONGO_URI);
async function connectToDatabase() {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB connected via Mongoose");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  }
}

export default connectToDatabase;
