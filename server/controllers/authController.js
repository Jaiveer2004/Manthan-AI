import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { request } from "express";
import jwt from "jsonwebtoken";

// For google login
import { OAuth2Client } from "google-auth-library";
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const registerUser = async (request, response) => {
  try {
    const { name, email, password } = request.body;

    // Checking if user already exists:
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return response.status(400).json({ message: "User Already Exists" })
    }

    // Now hash the password for new user
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Now, save the new user
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    response.status(200).json({ message: "User Registered Successfully!" });
  } catch (err) {
    console.log(`Error Occured while creating new user: ${err}`);
    response.status(500).json({ message: "Internal Server Error" });
  }
};

export const loginUser = async (request, response) => {
  try {
    const { email, password } = request.body;

    // Check if user exists
    const user = await User.findOne({ email });

    if (!user) {
      return response.status(404).json({ message: "User not found" });
    }

    // Check if password is correct or not
    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch) {
      return response.status(404).json({message: "Password is incorrect"});
    }

    // If all good, create a JWT for the user
    const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    response.json({
      message: "Login Successfull",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    console.log("Login Error: ", err);
    response.status(500).json({message: "Internal Server Error"});
  }
};

export const googleLogin = async (request, response) => {
  try {
    const { token } = request.body;

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, picture } = payload;
    
    let user = await User.findOne({email});

    // If user not found:
    if(!user) {
      const newUser = await User.create({
        name, 
        email,
        password: "GOOGLE_AUTH",
      });
    }

     // Create a JWT Token:
      const jwtToken = jwt.sign({id: user._id}, process.env.JWT_SECRET, {
        expiresIn: "24h",
      });
      
      response.json({
      message: "Login Successfull",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        picture,
      },
    });


  } catch (err) {
    console.error("Google login error:", err);
    response.status(400).json({ message: "Google authentication failed" });
  }
};