import bcrypt from "bcryptjs";
import { User } from "../models/User.js";
import { uploadProfile } from "../services/cloudinary.js";

export const logIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!password || !email) {
      return res.status(400).json({
        message: "Please provide the correct email address and password!",
      });
    }

    const user = await User.findOne({ email }).select("+password").exec();

    if (!user) {
      return res
        .status(400)
        .json({ message: "Email or Password is incorrect!" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(400).json({ message: "Password is incorrect!" });
    }

    req.session.userID = user._id;

    res.status(200).json({ message: "Login successful", user });
  } catch (error) {
    next(error);
  }
};

export const signUp = async (req, res, next) => {
  const { username, email } = req.body;
  const passwordRaw = req.body.password;

  try {
    if (!username || !passwordRaw || !email) {
      return res.status(400).json({
        message: "Please provide an username, email address and password!",
      });
    }

    const existUsername = await User.findOne({ username }).exec();

    if (existUsername) {
      return res.status(400).json({ message: "Username already existed" });
    }

    const existEmail = await User.findOne({ email }).exec();

    if (existEmail) {
      return res.status(400).json({ message: "Email already existed" });
    }

    const passwordHashed = await bcrypt.hash(passwordRaw, 10);

    const newUser = await User.create({
      username: username,
      email: email,
      password: passwordHashed,
    });

    res.status(201).json(newUser);
  } catch (error) {
    next(error);
    console.log("test");
  }
};

export const getUserDetails = async (req, res, next) => {
  const userId = req.session.userID;

  try {
    const user = await User.findById(userId).exec();
    return res.status(200).json({
      username: user.username,
      gender: user.gender,
      currentLocation: user.currentLocation,
      birthDate: user.birthDate,
      desctiption: user.description,
    });
  } catch (error) {
    next(error);
  }
};

export const logOut = (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).json({ message: "Logout failed" });

    res.clearCookie("sid");
    res.json({ message: "Logged out successfully" });
  });
};

export const authenticateUser = (req, res) => {
  if (req.session.userID) {
    res.json({ user: { id: req.session.userID } });
  } else {
    res.status(401).json({ message: "Not logged in" });
  }
};

export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const passwordRaw = req.body.password;

    if (!email || !passwordRaw) {
      return res.status(400).json({
        message: "Please provide the correct email address and password!",
      });
    }

    const passwordHashed = await bcrypt.hash(passwordRaw, 10);

    const updatedUser = await User.findOneAndUpdate(
      { email },
      { $set: { password: passwordHashed } },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(400).json({ message: "User not found" });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    next(error);
  }
};

export const editUser = async (req, res, next) => {
  const {
    currentUsername,
    image,
    birthDate,
    gender,
    currentLocation,
    description,
  } = req.body;

  const userId = req.session.userID;

  try {
    if (!description) {
      return res
        .status(400)
        .json({ error: "Profile description should not be empty" });
    }

    const inputBirthDate = new Date(birthDate);

    if (inputBirthDate > Date.now()) {
      return res
        .status(400)
        .json({ error: "Birthdate lapses the current date." });
    }

    let imageData = {};

    if (image) {
      const results = await uploadProfile(image, "Profile");
      imageData = results;
    }

    const updatedUser = await User.findOneAndUpdate(
      { _id: userId },
      {
        username: currentUsername,
        profilePic: imageData,
        gender,
        currentLocation,
        description,
        birthDate,
      },
      { new: true }
    );

    res.status(200).json(updatedUser);
  } catch (e) {
    res
      .status(500)
      .json({ error: "A server error occurred with this request" });
  }
};
