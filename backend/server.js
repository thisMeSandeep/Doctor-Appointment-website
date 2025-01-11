import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import connectCloudinary from "./config/cloudinary.js";

dotenv.config();

//app config

const app = express();

const PORT = process.env.PORT || 4000;
connectCloudinary();

//middlewares

app.use(express.json());
app.use(cors());

//api end points

app.get("/", (req, res) => {
  res.send("Server is initialized");
});

//start server
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (err) {
    console.error(`Failed to start server: ${err.message}`);
    process.exit(1);
  }
};

startServer();
