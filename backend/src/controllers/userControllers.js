import bcrypt from "bcryptjs";
import { User } from "../models/User.js";
import { Follow } from "../models/Follow.js";
import { uploadFile, deleteFile } from "../services/cloudinary.js";

export const logIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!password || !email) {
      return res.status(400).json({
        message: "Please provide the correct email address and password",
      });
    }

    const user = await User.findOne({ email }).select("+password").exec();

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!user || !passwordMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
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
  }
};

export const getCurrentUserDetails = async (req, res) => {
  const userId = req.session.userID;

  try {
    const user = await User.findById(userId).exec();
    return res.status(200).json({
      username: user.username,
      profile: user.profilePic,
    });
  } catch (error) {
    res.status(500).json({ error: "Couldn't get user" });
  }
};

export const getUserDetails = async (req, res) => {
  const { username } = req.params;
  const id = req.session.userID;

  try {
    let isMyProfile = false;

    const user = await User.findOne({ username }).exec();

    if (id === user._id.toString()) {
      isMyProfile = true;
    }

    return res.status(200).json({
      username: user.username,
      description: user.description,
      profile: user.profilePic,
      isMyProfile,
      followingCount: user.followingCount,
      followerCount: user.followerCount,
      birthDate: user.birthDate,
      currentLocation: user.currentLocation
    });
  } catch (e) {
    res.status(500).json({ error: "Couldn't get user" });
  }
};

export const logOut = (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).json({ message: "Logout failed" });

    res.clearCookie("sid");
    res.status(200).json({ message: "Logged out successfully" });
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

    return res.status(200).json(updatedUser);
  } catch (error) {
    next(error);
  }
};

export const editUser = async (req, res) => {
  const {
    currentUsername,
    birthDate,
    gender,
    currentLocation,
    description,
    image,
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

    const updateFields = {
      username: currentUsername,
      gender,
      currentLocation,
      description,
      birthDate,
    };

    const user = await User.findOne({ username: currentUsername }).exec();

    let imageData = {};

    if (image && !image.startsWith("https://res.cloudinary.com/")) {
      const results = await uploadFile(image, "Profile", "image");
      imageData = results;
      updateFields.profilePic = imageData;

      if (user?.profilePic?.publicId) {
        await deleteFile(user.profilePic.publicId, "Profile");
      }
    }

    const updatedUser = await User.findOneAndUpdate(
      { _id: userId },
      updateFields,
      { new: true }
    );

    return res.status(200).json(updatedUser);
  } catch (e) {
    console.error("Edit user error:", e);
    return res
      .status(500)
      .json({ error: "A server error occurred with this request" });
  }
};

export const followUser = async (req, res) => {
  const { username } = req.params;
  const userId = req.session.userID;

  try {
    const followee = await User.findOne({ username }).exec();

    const existing = await Follow.findOne({
      userId,
      followeeId: followee._id,
    });

    if (!existing) {
      await Follow.create({
        userId,
        followeeId: followee._id,
      });
      await User.findByIdAndUpdate(userId, { $inc: { followingCount: 1 } });
      await User.findByIdAndUpdate(followee._id, {
        $inc: { followerCount: 1 },
      });
      return res.status(200).json({ message: "Got Hooked" });
    } else {
      await Follow.findByIdAndDelete(existing._id);
      await User.findByIdAndUpdate(userId, { $inc: { followingCount: -1 } });
      await User.findByIdAndUpdate(followee._id, {
        $inc: { followerCount: -1 },
      });
      return res.status(200).json({ message: "Get Hooked" });
    }
  } catch (e) {
    console.error("Couldn't follow user:", e);
    return res
      .status(500)
      .json({ error: "A server error occurred with this request" });
  }
};

export const checkIfFollowed = async (req, res) => {
  const { username } = req.params;
  const userId = req.session.userID;

  try {
    const followee = await User.findOne({ username }).exec();

    if (followee) {
      const existing = await Follow.findOne({
        userId,
        followeeId: followee._id,
      });

      return res.status(200).json({ followed: !!existing });
    }

    return res.status(500).json({ error: "User does not exist" });
  } catch (e) {
    console.error("Couldn't check follow relationship:", e);
    return res
      .status(500)
      .json({ error: "Couldn't check follow relationship" });
  }
};