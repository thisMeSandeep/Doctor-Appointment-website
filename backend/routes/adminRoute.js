import express from "express";
import {
  addDoctor,
  adminLogin,
  getDoctors,
  appointmentsAdmin,
  appoitmentCancel,
  adminDashboard
} from "../controllers/adminController.js";
import { changeAvailability } from "../controllers/doctorController.js";
import upload from "../middlewares/multer.js";
import authAdmin from "../middlewares/authAdmin.js";

const adminRouter = express.Router();

adminRouter.post("/add-doctor", authAdmin, upload.single("image"), addDoctor); //add doctor
adminRouter.post("/login", adminLogin); //admin login
adminRouter.get("/all-doctors", authAdmin, getDoctors); //get all doctors
adminRouter.post("/change-availability", authAdmin, changeAvailability); //change visibility
adminRouter.get("/appointments", authAdmin, appointmentsAdmin); //get appointments
adminRouter.post("/cancelAppointment", authAdmin, appoitmentCancel); //cancel appoitment
adminRouter.get("/dashboard", authAdmin, adminDashboard); //Dashboard data

export default adminRouter;
