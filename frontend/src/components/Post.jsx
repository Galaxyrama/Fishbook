import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Tooltip } from "flowbite";
import VideoThumbnail from "./VideoThumbnail";
import ShareLinkComponent from "./ShareLinkComponent";
import DeletePostComponent from "./DeletePostComponent";

const Post = ({
  PostID,
  User,
  File,
  DateUpload,
  ProfilePic,
  LikeAmount,
  CommentAmount,
  PostTitle,
  SameUser,
}) => {
  const date = new Date(DateUpload);
  const tooltipCommentId = `tooltip-comment-${PostID}`;
  const tooltipLikeId = `tooltip-like-${PostID}`;

  const [likeAmount, setLikeAmount] = useState(LikeAmount);
  const [hasLiked, setHasLiked] = useState();

  const textareaRef = useRef(null);
  const modalRef = useRef(null);

  const [isOpen, setIsOpen] = useState(false);
  const [isVideo, setIsVideo] = useState(false);
  const [isImg, setIsImg] = useState(false);

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

  const formattedDate = date.toLocaleDateString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  });

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        closeModal();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

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

    const getLikeStatus = async () => {
      try {
        const response = await fetch(
          `http://localhost:5175/api/post/${PostID}/isLiked`,
          {
            credentials: "include",
          }
        );

        const data = await response.json();

        if (response.ok) {
          setHasLiked(data.liked);
        }
      } catch (e) {
        console.error(e);
      }
    };

    tooltipAppear();
    getLikeStatus();

    if (!File) return;

    if (File.includes("video")) {
      setIsVideo(true);
      setIsVideoModal(true);
      setIsImg(false);
      setIsImgModal(false);
    } else {
      setIsImg(true);
      setIsImgModal(true);
      setIsVideo(false);
      setIsVideoModal(false);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [File]);

  const handleLike = async () => {
    try {
      const response = await fetch(
        `http://localhost:5175/api/post/status/${PostID}/like`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      const data = await response.json();

      if (response.ok) {
        if (data.liked) {
          setHasLiked(true);
          setLikeAmount((prev) => prev + 1);
        } else {
          setHasLiked(false);
          setLikeAmount((prev) => prev - 1);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  //Modal Functions
  const handleEditClick = () => {
    setAddPost(postFile);
    setIsImgModal(isImg);
    setIsVideoModal(isVideo);
    setModalPostTitle(postTitle);
    setIsEdit(true);
    setIsOpenModal(false);
    document.body.style.overflow = "hidden";
    
  };

  const handleOptions = () => setIsOpenModal((prev) => !prev);

  const closeModal = () => {
    setIsEdit(false);
    document.body.style.overflow = "auto";
  };

  const handlePostChange = (e) => {
    const value = e.target.value;
    setModalPostTitle(value);

    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
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

    setIsImg(isImgModal);
    setIsVideo(isVideoModal);
    setAddPost("");
    setModalPostTitle("");
    closeModal();
  };

  const handlePostRemove = () => {
    setIsImgModal(false);
    setIsVideoModal(false);
    setAddPost("");
  };

  return (
    <div className="font-montagu px-2 h-full">
      <div className="flex justify-center w-full pb-5">
        <div className="w-full max-w-3xl pb-2">
          <div className="flex gap-4 rounded-lg drop-shadow-xl py-6 bg-white px-4">
            <div className="w-12 flex-shrink-0">
              <Link to={`/profile/${User}`}>
                <img
                  src={ProfilePic}
                  className="w-12 h-12 rounded-4xl mr-12 cursor-pointer border-1 border-gray-200"
                />
              </Link>
            </div>
            <div className="text-left pr-2 max-w-3xl w-full">
              <div className="flex justify-between">
                <Link to={`/profile/${User}`}>
                  <p className="text-xl font-semibold cursor-pointer inline-block hover:text-btn">
                    {User}
                  </p>
                </Link>
                {SameUser && (
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
                            alt="Edit"
                            className="w-5 h-5 mr-2"
                          />
                          <p>Edit Post</p>
                        </div>
                      </div>
                      <div
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      >
                        <DeletePostComponent PostId={PostID}/>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
              </div>
              <p className="pb-2 text-sm text-gray-500">{formattedDate}</p>

              <div>
                {/* Text Post */}
                {PostTitle && (
                  <Link to={`/${User}/status/${PostID}`}>
                    <p className="text-justify pb-3">{PostTitle}</p>
                  </Link>
                )}
                {/* Image Post */}
                {File && isImg && (
                  <Link to={`/${User}/status/${PostID}`}>
                    <img
                      src={File}
                      alt=""
                      className="mb-3 w-full rounded-md border-1 border-gray-200"
                    />
                  </Link>
                )}
                {/* Video Post */}
                {File && isVideo && (
                  <VideoThumbnail
                    videoSrc={File}
                    postId={PostID}
                    username={User}
                  />
                )}

                <hr className="pt-3" />
              </div>

              <div className="flex justify-between mx-10">
                {/* Comments */}
                <Link to={`/${User}/status/${PostID}`}>
                  <div
                    className="flex select-none cursor-pointer"
                    data-tooltip-target={tooltipCommentId}
                  >
                    <img src="/images/comment.png" className="w-6 h-6 mr-1" />
                    <p>{CommentAmount}</p>
                  </div>
                </Link>
                {/* Likes */}
                <div
                  className="flex select-none cursor-pointer"
                  data-tooltip-target={tooltipLikeId}
                  onClick={handleLike}
                >
                  <div className="w-6 h-6 flex items-center justify-center mr-1">
                    <img
                      src={
                        hasLiked
                          ? "/images/heart-liked.png"
                          : "/images/heart.png"
                      }
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <p>{likeAmount}</p>
                </div>
                {/* Share Link */}
                <ShareLinkComponent username={User} id={PostID} />
              </div>
            </div>
          </div>
        </div>
      </div>

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
        {hasLiked ? "Unlike" : "Like"}
      </div>

      {/* Modal for Edit Post */}
      {isEdit && (
        <div
          className="flex justify-center items-center px-3 pt-20 fixed inset-0
         bg-gray-500/50 overflow-y-auto z-[50] pointer-events-auto"
        >
          <div
            ref={modalRef}
            className="max-w-xl w-full bg-white rounded-lg drop-shadow-xl max-h-screen flex flex-col"
          >
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
                    src={ProfilePic}
                    className="w-12 h-12 rounded-full border-1 border-gray-200"
                  />
                </div>
                <p className="text-xl">{User}</p>
              </div>
              <div className="block py-1 overflow-y-auto max-h-[55vh]">
                <textarea
                  ref={textareaRef}
                  className="focus:outline-none focus:ring-0 border-0 w-full resize-none h-auto px-0"
                  placeholder={`Edit the post here`}
                  onChange={handlePostChange}
                  rows={1}
                  value={modalPostTitle}
                />
                {File && isImgModal && (
                  <div className="relative mr-2 border border-gray-200 rounded-md">
                    <img
                      src={File}
                      className="h-full w-full flex justify-center"
                    />
                    <img
                      className="absolute top-2 right-3 w-7 h-7 cursor-pointer"
                      src="/images/exit-btn.png"
                      onClick={handlePostRemove}
                    ></img>
                  </div>
                )}
                {File && isVideoModal && (
                  <div className="relative mr-2 border border-gray-200 rounded-md">
                    <video src={File} className="h-full flex justify-center" />
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

export default Post;
