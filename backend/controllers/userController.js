import dontenv from "dotenv";
dontenv.config();
import validator from "validator";
import userModel from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";
import doctorModel from "../models/doctorModel.js";
import appointmentModel from "../models/appointmentModel.js";
import razorpay from "razorpay";

//register user

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    //validate email
    if (!validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Please provide valid email",
      });
    }

    //check for existing email
    let existingUser = await userModel.findOne({ email: email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already exists!",
      });
    }

    //check for password
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Please provide a strong password",
      });
    }

    //hash passoword
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
    });

    const user = await newUser.save(); //save new user details

    //creating token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    //sending response
    return res.status(200).json({
      success: true,
      message: "Registration Succesful",
      token,
    });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

//login user

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    //check for email and password
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User does not exist!",
      });
    }

    const matchPassword = await bcrypt.compare(password, user.password);

    if (!matchPassword) {
      return res.status(400).json({
        success: false,
        message: "Password didn't match!",
      });
    }

    //generate token for login user
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    //send response
    return res.status(200).json({
      success: true,
      message: "Login Successful",
      token,
    });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

//get user data

export const getProfile = async (req, res) => {
  try {
    const { userId } = req.body;

    const userData = await userModel.findById(userId).select("-password");

    res.status(200).json({
      success: true,
      message: "User data found",
      userData,
    });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

//update user Profile

export const updateProfile = async (req, res) => {
  try {
    const { userId, name, phone, address, dob, gender } = req.body;

    const imageFile = req.file;

    if (!name || !phone || !dob || !gender) {
      return res.status(400).json({
        success: false,
        message: "Data is missing",
      });
    }

    //update user data
    await userModel.findByIdAndUpdate(userId, {
      name,
      phone,
      address: JSON.parse(address),
      dob,
      gender,
    });

    if (imageFile) {
      //upload image to cloudinary
      const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
        resource_type: "image",
      });
      const imageURL = imageUpload.secure_url;

      await userModel.findByIdAndUpdate(userId, { image: imageURL });
    }

    return res.status(200).json({
      success: true,
      message: "Profile Updated",
    });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// book appointment controller

export const bookAppointment = async (req, res) => {
  try {
    const { userId, docId, slotDate, slotTime } = req.body;

    const docData = await doctorModel.findById(docId).select("-password"); //get doctor data

    //doctor not available
    if (!docData.available) {
      return res.status(404).json({
        success: false,
        message: "Doctor not available",
      });
    }

    let slots_booked = docData.slots_booked || {};

    // check for slot availability
    if (slots_booked[slotDate]) {
      if (slots_booked[slotDate].includes(slotTime)) {
        return res.status(404).json({
          success: false,
          message: "Slot not available",
        });
      } else {
        slots_booked[slotDate].push(slotTime);
      }
    } else {
      slots_booked[slotDate] = [slotTime];
    }

    const userData = await userModel.findById(userId).select("-password");

    delete docData.slots_booked;

    const appointmentData = {
      userId,
      doctorId: docId, // Update the key name to match your schema
      userData,
      docData,
      amount: docData.fees,
      slotTime,
      slotDate,
      date: Date.now(),
    };

    const newAppointment = new appointmentModel(appointmentData);
    //save new appointment
    await newAppointment.save();

    //save new slots data in doc data
    await doctorModel.findByIdAndUpdate(docId, { slots_booked });

    return res.status(200).json({
      success: true,
      message: "Appointment booked",
    });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// get user's appointments controller

export const ListAppointment = async (req, res) => {
  try {
    const { userId } = req.body;

    const appointments = await appointmentModel.find({ userId });

    if (appointments.length === 0) {
      return res.status(200).json({
        success: false,
        message: "No appointments",
      });
    }

    //return appointments
    return res.status(200).json({
      success: true,
      appointments,
    });
  } catch (err) {
    console.log(err.name + ":" + err.message);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

//cancel appoitment controller

export const cancelAppoitment = async (req, res) => {
  try {
    const { userId, appointmentId } = req.body;

    const appointmentData = await appointmentModel.findById(appointmentId);

    // console.log(appointmentData);

    // verify appopintment user
    if (appointmentData.userId !== userId) {
      return res.status(400).json({
        success: false,
        message: "Unauthorized action!",
      });
    }

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

//razorpay instance
const razorpayInstance = new razorpay({
  key_id: process.env.KEY_ID,
  key_secret: process.env.kEY_SECRET,
});

// Payment razorpay integration
export const paymentRazorpay = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    console.log(appointmentId);
    const appointmentData = await appointmentModel.findById(appointmentId);
    if (!appointmentData || appointmentData.cancelled) {
      return res.status(400).json({
        success: false,
        message: "Appointment cancelled or not found",
      });
    }

    //creating option for razorpay
    const options = {
      amount: appointmentData.amount * 100,
      currency: process.env.currency,
      receipt: appointmentId,
    };

    //create payment order
    const order = await razorpayInstance.orders.create(options);

    return res.status(200).json({
      success: true,
      order,
    });
  } catch (err) {
    console.log(err.name + ":" + err.message);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Razorpay payment verification

export const verifyRazorpay = async (req, res) => {
  try {
    const { razorpay_order_id } = req.body;

    const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id);

    if (orderInfo.status === "paid") {
      await appointmentModel.findByIdAndUpdate(orderInfo.receipt, {
        payment: true,
      });

      return res.status(200).json({
        success: true,
        message: "Payment Successful",
      });
    } else {
      return res.status(200).json({
        success: false,
        message: "Payment Failed",
      });
    }
  } catch (err) {
    console.log(err.name + ":" + err.message);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
