import validator from "validator";
import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";
import doctorModel from "../models/doctorModel.js";
import jwt from "jsonwebtoken";
import appointmentModel from "../models/appointmentModel.js";
import userModel from "../models/userModel.js";

// Add doctor
export const addDoctor = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      speciality,
      degree,
      experience,
      about,
      fees,
      address,
    } = req.body;

    const imageFile = req.file;

    //checking for all fields
    if (
      !name ||
      !email ||
      !password ||
      !speciality ||
      !degree ||
      !experience ||
      !about ||
      !fees ||
      !address
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill all fields",
      });
    }

    //validating email format
    if (!validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
    }

    //validating strong password
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password should be atleast 8 characters long",
      });
    }

    //hashing password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // ulpoad image to cloudinary
    const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
      resource_type: "image",
    });

    const imageUrl = imageUpload.secure_url;

    const doctorData = {
      name,
      email,
      image: imageUrl,
      password: hashedPassword,
      speciality,
      degree,
      experience,
      about,
      fees,
      address: JSON.parse(address),
      date: Date.now(),
    };

    const newDoctor = new doctorModel(doctorData);

    await newDoctor.save();

    res.status(201).json({
      success: true,
      message: "Doctor added successfully",
    });
  } catch (err) {
    console.error(`Failed to add doctor: ${err.message}`);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Admin login controller

export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please fill all fields",
      });
    }

    const admin = {
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD,
    };

    if (email !== admin.email || password !== admin.password) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign({ email: admin.email }, process.env.JWT_SECRET, {
      expiresIn: "5h",
    });

    res.status(200).json({
      success: true,
      message: "Admin logged in successfully",
      token,
    });
  } catch (err) {
    console.error(`Failed to login: ${err.message}`);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

//get all doctors data

export const getDoctors = async (req, res) => {
  try {
    const doctors = await doctorModel.find().select("-password");

    res.status(200).json({
      success: true,
      doctors,
    });
  } catch (err) {
    console.error(`Failed to get doctors: ${err.message}`);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

//get all appoitments

export const appointmentsAdmin = async (req, res) => {
  try {
    const appointments = await appointmentModel.find({});
    res.status(200).json({
      success: true,
      appointments,
    });
  } catch (err) {
    console.error(`Failed to fetch appoitments data: ${err.message}`);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

//cancel appoitment

export const appoitmentCancel = async (req, res) => {
  try {
    const { appointmentId } = req.body;

    const appointmentData = await appointmentModel.findById(appointmentId);

    await appointmentModel.findByIdAndUpdate(appointmentId, {
      cancelled: true,
    });

    // free doctor slot

    const { docId, slotDate, slotTime } = appointmentData;

    const doctorData = await doctorModel.findById(docId);

    let slots_booked = doctorData.slots_booked;

    console.log("slotes:", slots_booked);

    slots_booked[slotDate] = slots_booked[slotDate].filter(
      (e) => e != slotTime
    );

    await doctorModel.findByIdAndUpdate(docId, { slots_booked });

    res.status(200).json({
      success: true,
      message: "Appointment cancelled",
    });
  } catch (err) {
    console.log(err.name + ":" + err.message);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Dashboard data to display

export const adminDashboard = async (req, res) => {
  try {
    const doctors = await doctorModel.find({});
    const users = await userModel.find({});
    const appointments = await appointmentModel.find({});

    const dashData = {
      doctors: doctors.length,
      appointments: appointments.length,
      patients: users.length,
      latestAppointments: appointments.reverse().slice(0, 5),
    };

    return res.status(200).json({
      success: true,
      dashData,
    });
  } catch (err) {
    console.log(err.name + ":" + err.message);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
