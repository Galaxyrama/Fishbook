import React, { useEffect, useRef, useState } from "react";
import Navbar from "../components/Navbar";
import { Link, useParams } from "react-router-dom";
import CommentComponent from "../components/CommentComponent";
import useAuth from "../hook/useAuth";
import VideoThumbnail from "../components/VideoThumbnail";

const PostPage = () => {
  const { username, id } = useParams();
  const tooltipCommentId = `tooltip-comment-${id}`;
  const tooltipLikeId = `tooltip-like-${id}`;
  const textareaRef = useRef(null);

  const [isOpen, setIsOpen] = useState(false);
  const [comment, setComment] = useState("");

  //For Modal
  const [isEdit, setIsEdit] = useState(false);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [addPost, setAddPost] = useState();
  const [isImgModal, setIsImgModal] = useState();
  const [isVideoModal, setIsVideoModal] = useState();
  const [modalPostTitle, setModalPostTitle] = useState();

  //For Post
  const [post, setPost] = useState();
  const [postFile, setPostFile] = useState();
  const [postTitle, setPostTitle] = useState();
  const [dateUpload, setDateUpload] = useState();
  const [isLiked, setIsLiked] = useState(false);
  const [likeAmount, setLikeAmount] = useState(0);
  const [sameUser, setSameUser] = useState(false);
  const [isVideo, setIsVideo] = useState(false);
  const [isImg, setIsImg] = useState(false);

  const handleShareLink = () => {
    navigator.clipboard.writeText(
      `${window.location.href}${username}/status/${id}`
    );
    setIsOpen(true);

    setTimeout(() => setIsOpen(false), 5000);
  };

  useAuth();

  useEffect(() => {
    document.documentElement.scrollTop = 0;

    //The tooltip about comment and like
    const tooltipAppear = () => {
      const $targetE1 = document.getElementById(tooltipCommentId);
      const $triggerE1 = document.querySelector(
        `[data-tooltip-target="${tooltipCommentId}"]`
      );

      const $targetE2 = document.getElementById(tooltipLikeId);
      const $triggerE2 = document.querySelector(
        `[data-tooltip-target="${tooltipLikeId}"]`
      );

      if ($targetE1 && $triggerE1) {
        new Tooltip($targetE1, $triggerE1);
      }

      if ($targetE2 && $triggerE2) {
        new Tooltip($targetE2, $triggerE2);
      }
    };

    //Gets the post data
    const getPost = async () => {
      try {
        const response = await fetch(
          `http://localhost:5175/api/post/status/${id}`,
          {
            credentials: "include",
          }
        );

        const data = await response.json();

        if (response.ok) {
          setPost(data.post);
          setLikeAmount(data.post.likeCount);
          setIsLiked(data.liked);
          setSameUser(data.sameUser);
        }
      } catch (e) {
        console.error(e);
      }
    };

    getPost();
    tooltipAppear();
  }, [], [postFile], [postTitle]);

  useEffect(() => {
    formattedUpload(post?.createdAt);

    setPostTitle(post?.postTitle);
    setPostFile(post?.postImage?.url);

    if (post?.postImage?.url) {
      if (post?.postImage?.url.includes("video")) {
        setIsVideo(true);
        setIsImg(false);
        return;
      } else {
        setIsImg(true);
        setIsVideo(false);
        return;
      }
    }
  }, [post]);

  // dynamically changes the height of textarea
  const handleCommentChange = (e) => {
    const value = e.target.value;
    setComment(value);

    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  const formattedUpload = (d) => {
    const date = new Date(d);

    const formattedDate = date.toLocaleDateString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    setDateUpload(formattedDate);
  };

  const handleOptions = () => setIsOpenModal((prev) => !prev);

  const handleLike = async () => {
    try {
      const response = await fetch(
        `http://localhost:5175/api/post/status/${id}/like`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      const data = await response.json();

      if (response.ok) {
        if (data.liked) {
          setIsLiked(true);
          setLikeAmount((prev) => prev + 1);
        } else {
          setIsLiked(false);
          setLikeAmount((prev) => prev - 1);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  //converts the blob url into a base64 string
  const convertBlobToBase64 = async (blobUrl) => {
    const response = await fetch(blobUrl);
    const blob = await response.blob();

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const handleEditClick = () => {
    setAddPost(post?.postImage.url);
    setIsImgModal(isImg);
    setIsVideoModal(isVideo);
    setModalPostTitle(postTitle);
    setIsEdit(true);
    setIsOpenModal(false);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setIsEdit(false);
    document.body.style.overflow = "auto";
  };

  const handleAddPost = (e) => {
    const addFile = e.target.files[0];
    const maxSizeInMB = 50;
    const maxSizeInByte = maxSizeInMB * 1024 * 1024;

    if (!addFile) return;

    //sets the largest file size to 50mb
    if (addFile.size > maxSizeInByte) {
      alert("File is too large. Maximum allowed size is 50mb");
      return;
    }

    const mimeType = addFile.type;

    if (mimeType.startsWith("image/")) {
      setIsImgModal(true);
      setIsVideoModal(false);
    } else if (mimeType.startsWith("video/")) {
      setIsImgModal(false);
      setIsVideoModal(true);
    } else {
      console.log("Unsupported file type");
    }

    const url = URL.createObjectURL(addFile);
    setAddPost(url);
  };

  const handlePostRemove = () => {
    setIsImgModal(false);
    setIsVideoModal(false);
    setAddPost("");
  };

  const handleDeletePost = () => {};

  // dynamically changes the height of textarea
  const handlePostChange = (e) => {
    const value = e.target.value;
    setModalPostTitle(value);

    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  const handlePostUpload = async () => {
    if (!addPost && !modalPostTitle) return;

    let base64 = null;

    if (addPost) {
      base64 = await convertBlobToBase64(addPost);
    }

    const response = await fetch(`http://localhost:5175/api/post/edit/${id}`, {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        modalPostTitle,
        postImage: base64,
      }),
    });

    const data = await response.json();
    if (response.ok) {
      console.log(data);
      setPostFile(addPost);
      setPostTitle(modalPostTitle);
    }

    closeModal();
    setAddPost("");
    setModalPostTitle("");
  };

  return (
    <div className="font-montagu h-full bg-background">
      <Navbar />

      {/* Post block */}
      <div className="flex justify-center px-2 pt-20">
        <div className="block px-5 max-w-3xl bg-white rounded-xl drop-shadow-xl">
          <div className="flex items-center justify-between py-3">
            <div className="flex gap-3 items-center">
              <Link to={`/profile/${username}`}>
                {post?.userId?.profilePic?.url && (
                  <img
                    src={post.userId?.profilePic.url}
                    className="w-12 h-12 rounded-full border-1 border-gray-200"
                  />
                )}
              </Link>
              <Link to={`/profile/${username}`}>
                <p
                  className="text-xl font-semibold cursor-pointer
                               inline-block max-w-max hover:text-btn"
                >
                  {username}
                </p>
              </Link>
            </div>
            {sameUser && (
              <div className="relative inline-block">
                <p
                  className="text-2xl select-none cursor-pointer hover:text-btn"
                  onClick={handleOptions}
                >
                  •••
                </p>
                {isOpenModal && (
                  <div className="absolute z-1 rounded bg-white right-0 w-41">
                    <div className="absolute right-3 -top-2 w-3 h-3 rotate-45 bg-white border-l border-t border-gray-200" />
                    <div className="border border-gray-200 rounded shadow bg-white w-41">
                      <div
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={handleEditClick}
                      >
                        <div className="flex">
                          <img
                            src="/images/edit.png"
                            alt="Delete"
                            className="w-5 h-5 mr-2"
                          />
                          <p>Edit Post</p>
                        </div>
                      </div>
                      <div
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={handleDeletePost}
                      >
                        <div className="flex">
                          <img
                            src="/images/delete.png"
                            alt="Delete"
                            className="w-5 h-5 mr-2"
                          />
                          <p>Delete Post</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          {post?.postTitle && <p className="text-justify pb-3">{postTitle}</p>}
          {postFile && isImg && (
            <img src={postFile} className="w-full rounded-mg" />
          )}
          {postFile && isVideo && (
            <VideoThumbnail
              videoSrc={postFile}
              postId={id}
              username={username}
            />
          )}
          <div className="flex text-gray-500 select-none py-3 text-[13px]">
            <p>{dateUpload}</p>
          </div>
          <hr />
          <div className="flex justify-between mr-10 ml-15 py-2">
            {/* Comments */}
            <div
              className="flex select-none cursor-pointer"
              data-tooltip-target={tooltipCommentId}
            >
              <img src="/images/comment.png" className="w-6 h-6 mr-1" />
              <p>{post?.commentCount}</p>
            </div>
            {/* Likes */}
            <div
              className="flex select-none cursor-pointer"
              data-tooltip-target={tooltipLikeId}
              onClick={handleLike}
            >
              <img
                src={isLiked ? "/images/heart-liked.png" : "/images/heart.png"}
                className="w-6 h-6 mr-1"
              />
              <p>{likeAmount}</p>
            </div>
            {/* Share Link */}
            <div
              className="flex select-none cursor-pointer"
              onClick={handleShareLink}
            >
              <img src="/images/share.png" className="w-g h-6 mr-1" />
              <p>Share</p>
            </div>
          </div>
          <hr />
          {/* Post comment block */}
          <div className="flex py-3">
            <div className="w-12 flex-shrink-0">
              <Link to={`/profile/${username}`}>
                <img
                  src={post?.userId?.profilePic.url}
                  className="w-12 h-12 rounded-full inline-block border-1 border-gray-200"
                />
              </Link>
            </div>
            <textarea
              ref={textareaRef}
              className={`focus:ring-0 pt-4 border-0 w-full resize-none h-auto`}
              placeholder="Post your comment"
              onChange={handleCommentChange}
              value={comment}
              rows={1}
            />
            <div className="pt-2">
              <button className="inline-block bg-btn h-10 text-white px-5 rounded-full cursor-pointer">
                Reply
              </button>
            </div>
          </div>
          <CommentComponent User={"User2"} DateUpload={Date.now()} />
          <CommentComponent User={"User3"} DateUpload={Date.now()} />
          <hr className="pb-3" />
        </div>
      </div>

      {/* Modal for sharing link */}
      {isOpen && (
        <div className="z-50 bottom-4 left-1/2 transform -translate-x-1/2 text-center w-60 fixed">
          <p className="text-white bg-btn py-2 rounded-md">
            Copied to clickboard
          </p>
        </div>
      )}

      {/* Tooltip for Comment */}
      <div
        id={tooltipCommentId}
        role="tooltip"
        className="absolute z-10 invisible 
                   inline-block px-3 py-2 text-sm 
                   font-medium bg-btn 
                   text-white rounded-lg shadow-sm 
                   opacity-0 transition-opacity 
                   duration-300 tooltip"
      >
        Comment
      </div>

      {/* Tooltip for Like */}
      <div
        id={tooltipLikeId}
        role="tooltip"
        className="absolute z-10 invisible
                   inline-block px-3 py-2 text-sm 
                   font-medium bg-btn 
                   text-white rounded-lg shadow-sm 
                   opacity-0 transition-opacity 
                   duration-300 tooltip"
      >
        {isLiked ? "Unlike" : "Like"}
      </div>

      {/* Modal for Edit Post */}
      {isEdit && (
        <div className="flex justify-center items-center px-3 pt-40 pb-8 fixed inset-0 bg-gray-500/50 overflow-y-auto">
          <div className="max-w-xl w-full bg-white rounded-lg drop-shadow-xl max-h-screen flex flex-col">
            {/* Header */}
            <div className="w-full relative text-center justify-center py-2">
              <h1 className="text-2xl">Edit Post</h1>
              <img
                src="/images/exit-btn.png"
                onClick={closeModal}
                className="w-7 h-7 absolute right-3 top-2.5
                              transform -translatee-y-1/2
                              pointer-events-auto cursor-pointer"
              />
            </div>
            <hr className="py-1 border-[#ACACAC]" />

            {/* Content */}
            <div className="block px-3 py-1">
              <div className="flex items-center gap-2">
                <div className="w-12 flex-shrink-0">
                  <img
                    src={post?.userId?.profilePic?.url}
                    className="w-12 h-12 rounded-full border-1 border-gray-200"
                  />
                </div>
                <p className="text-xl">{username}</p>
              </div>
              <div className="block pr-3 py-1 overflow-y-auto max-h-[55vh]">
                <textarea
                  ref={textareaRef}
                  className="focus:outline-none focus:ring-0 border-0 w-full resize-none h-auto px-0"
                  placeholder={`Edit the post here`}
                  onChange={handlePostChange}
                  rows={1}
                  value={modalPostTitle}
                />
                {addPost && isImgModal && (
                  <div className="relative">
                    <img
                      src={addPost}
                      className="h-full w-full flex justify-center"
                    />
                    <img
                      className="absolute top-2 right-3 w-7 h-7 cursor-pointer"
                      src="/images/exit-btn.png"
                      onClick={handlePostRemove}
                    ></img>
                  </div>
                )}
                {addPost && isVideoModal && (
                  <div className="relative">
                    <video
                      src={addPost}
                      className="h-full flex justify-center"
                    />
                    <img
                      className="absolute top-2 right-3 w-7 h-7 cursor-pointer"
                      src="/images/exit-btn.png"
                      onClick={handlePostRemove}
                    ></img>
                  </div>
                )}
              </div>
              <div
                className="flex border-2 border-gray-300 items-center 
                  justify-between py-2 px-3 my-2 rounded-xl"
              >
                <p>Add to your Post</p>

                {/* Image Upload */}
                <div className="flex gap-3">
                  <label htmlFor="imgUpload" className="cursor-pointer">
                    <img
                      src="/images/photo.png"
                      className="w-10 h-10 cursor-pointer"
                    />
                  </label>
                  <input
                    type="file"
                    className="text-white py-2 px-5 
                            bg-btn rounded-xl cursor-pointer
                            text-[0px] hidden"
                    id="imgUpload"
                    accept="image/png, image/jpeg"
                    onChange={handleAddPost}
                  />

                  {/* Gif upload */}
                  <label htmlFor="gifUpload" className="cursor-pointer">
                    <img
                      src="/images/gif.png"
                      className="w-10 h-10 cursor-pointer"
                    />
                  </label>
                  <input
                    type="file"
                    className="text-white py-2 px-5 
                            bg-btn rounded-xl cursor-pointer
                            text-[0px] hidden"
                    id="gifUpload"
                    accept="image/gif"
                    onChange={handleAddPost}
                  />

                  {/* Video upload */}
                  <label htmlFor="videoUpload">
                    <img
                      src="/images/video.png"
                      className="w-10 h-10 cursor-pointer h"
                    />
                  </label>
                  <input
                    type="file"
                    className="text-white py-2 px-5 
                            bg-btn rounded-xl cursor-pointer
                            text-[0px] hidden"
                    id="videoUpload"
                    accept="video/mp4"
                    onChange={handleAddPost}
                  />
                </div>
              </div>
              <button
                onClick={handlePostUpload}
                className="cursor-pointer w-full bg-btn text-white rounded-xl
                                py-2 mb-2"
              >
                Post
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostPage;
