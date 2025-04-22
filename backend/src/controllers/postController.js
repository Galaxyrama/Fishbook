import { Post } from "../models/Post.js";
import { User } from "../models/User.js";
import { Like } from "../models/Like.js";
import { uploadPostFile, deleteFile } from "../services/cloudinary.js";

export const uploadPost = async (req, res) => {
  const { postTitle, postImage } = req.body;
  const userId = req.session.userID;

  try {
    let uploadImage = {};

    if (postImage) {
      const result = await uploadPostFile(postImage, "Fishbook");
      uploadImage = result;
    }

    const newPost = await Post.create({
      userId: userId,
      postTitle: postTitle ? postTitle : null,
      postImage: uploadImage ? uploadImage : null,
    });

    return res.status(201).json(newPost);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Couldn't create post" });
  }
};

export const editPost = async (req, res) => {
  const { postTitle, postImage } = req.body;
  const { postId } = req.params;

  try {
    let uploadImage = {};

    const post = await Post.findById(postId).exec();

    const updateFields = {
      postTitle,
    };

    //Uploads image if new image or video is provided
    if (postImage) {
      const result = await uploadPostFile(postImage, "Fishbook");
      uploadImage = result;
      updateFields.postImage = uploadImage;

      if (post?.postImage?.publicId)
        await deleteFile(post?.postImage?.publicId, "Fishbook");
    }

    if (!postImage && post?.postImage?.publicId) {
      await deleteFile(post?.postImage?.publicId, "Fishbook");
      updateFields.postImage = { url: null, publicId: null };
    }

    const updatedPost = await Post.findByIdAndUpdate(
      { _id: postId },
      updateFields,
      { new: true }
    );

    return res.status(200).json(updatedPost);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Couldn't edit the post" });
  }
};

export const getPosts = async (req, res) => {
  const userId = req.session.userID;

  try {
    const posts = await Post.find({})
      .populate("userId", "username profilePic.url")
      .sort({ createdAt: -1 });

    const postsWithSameUser = posts.map((post) => {
      const isSameUser = post.userId._id.toString() === userId;
      return { ...post.toObject(), same: isSameUser };
    });

    return res.status(200).json(postsWithSameUser);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Couldn't get posts" });
  }
};

export const getUserPosts = async (req, res) => {
  const { username } = req.params;

  try {
    const user = await User.findOne({ username }).exec();

    if (!user) {
      return res.status(400).json({ error: "Couldn't find the user" });
    }

    const posts = await Post.find({ userId: user._id }).sort({
      createdAt: -1,
    });

    return res.status(200).json(posts);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Couldn't get the user's posts" });
  }
};

export const getPost = async (req, res) => {
  const { postId } = req.params;
  const userId = req.session.userID;

  try {
    const post = await Post.findById(postId)
      .populate("userId", "username profilePic.url")
      .exec();

    let sameUser = false;

    if (post.userId._id == userId) sameUser = true;

    const existing = await Like.findOne({
      userId,
      refType: "Post",
      refId: postId,
    });

    return res.status(200).json({ post, liked: !!existing, sameUser });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Couldn't find the post" });
  }
};

export const checkIfUserLikedPost = async (req, res) => {
  const { postId } = req.params;
  const userId = req.session.userID;

  try {
    const liked = await Like.findOne({
      userId,
      refType: "Post",
      refId: postId,
    });

    return res.status(200).json({ liked: !!liked });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Couldn't check the like status" });
  }
};

export const likePost = async (req, res) => {
  const userId = req.session.userID;
  const { postId } = req.params;

  try {
    const existing = await Like.findOne({
      userId,
      refType: "Post",
      refId: postId,
    });

    if (!existing) {
      await Like.create({ userId, refType: "Post", refId: postId });
      await Post.findByIdAndUpdate(postId, { $inc: { likeCount: 1 } });
      return res.status(200).json({ liked: true });
    } else {
      await Like.findByIdAndDelete(existing._id);
      await Post.findByIdAndUpdate(postId, { $inc: { likeCount: -1 } });
      return res.status(200).json({ liked: false });
    }
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Couldn't like the post" });
  }
};

export const deletePost = async (req, res) => {
  const { postId } = req.params;

  try {
    const post = await Post.findById(postId).exec();

    await Post.findByIdAndDelete(postId);

    if (post?.postImage?.publicId) {
      await deleteFile(post?.postImage?.publicId, "Fishbook");
    }

    return res.status(200).json({ message: "Post deleted" });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Couldn't delete the post" });
  }
};