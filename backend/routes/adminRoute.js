import express from "express";
import {
  addDoctor,
  adminLogin,
  getDoctors,
} from "../controllers/adminController.js";
import upload from "../middlewares/multer.js";
import authAdmin from "../middlewares/authAdmin.js";

const adminRouter = express.Router();

adminRouter.post("/add-doctor", authAdmin, upload.single("image"), addDoctor); //add doctor
adminRouter.post("/login", adminLogin); //admin login
adminRouter.get("/all-doctors",authAdmin, getDoctors); //get all doctors

export default adminRouter;
