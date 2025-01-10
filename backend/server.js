import dotenv from "dotenv";
import express from "express";
import cors from "cors";

//app config

const app = express();

const PORT = process.env.PORT || 4000;

//middlewares

app.use(express.json());
app.use(cors());

//api end points

app.get("/", (req, res) => {
  res.send("Server is initialized");
});

//start server
app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
