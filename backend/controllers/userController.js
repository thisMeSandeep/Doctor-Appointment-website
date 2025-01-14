import validator from "validator";
import userModel from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { json } from "express";

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
