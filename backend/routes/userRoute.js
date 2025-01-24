import express from "express";
import {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  bookAppointment,
  ListAppointment,
  cancelAppoitment,
} from "../controllers/userController.js";

import authUser from "../middlewares/authUser.js";
import upload from "../middlewares/multer.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser); //register
userRouter.post("/login", loginUser); //login
userRouter.get("/get-profile", authUser, getProfile); //get user profile data
userRouter.post(
  "/update-profile",
  upload.single("image"),
  authUser,
  updateProfile
);
userRouter.post("/book-appointment", authUser, bookAppointment); //book appointment
userRouter.get("/appointments", authUser, ListAppointment); // appointments list
userRouter.post("/cancel-appointment", authUser, cancelAppoitment); //cancel appoitments

export default userRouter;
