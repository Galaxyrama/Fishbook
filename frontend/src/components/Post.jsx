import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Tooltip } from "flowbite";
import VideoThumbnail from "./VideoThumbnail";
import ShareLinkComponent from "./ShareLinkComponent";
import DeletePostComponent from "./DeletePostComponent";
import EditPostComponent from "./EditPostComponent";

const Post = ({ Post, Home }) => {
  const date = new Date(Post.createdAt);
  const tooltipCommentId = `tooltip-comment-${Post._id}`;
  const tooltipLikeId = `tooltip-like-${Post._id}`;

  const [likeAmount, setLikeAmount] = useState(Post.likeCount);
  const [hasLiked, setHasLiked] = useState({});

  const modalRef = useRef(null);

  const [isVideo, setIsVideo] = useState(false);
  const [isImg, setIsImg] = useState(false);

  //For Modal
  const [isEdit, setIsEdit] = useState(false);
  const [isOpenModal, setIsOpenModal] = useState(false);

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
          `http://localhost:5175/api/post/${Post._id}/isLiked`,
          {
            credentials: "include",
          }
        );

        const data = await response.json();

        if (response.ok) {
          setHasLiked((prev) => ({
            ...prev,
            [Post._id]: data.liked,
          }));
        }
      } catch (e) {
        console.error(e);
      }
    };

    tooltipAppear();
    getLikeStatus();

    if (Post?.postImage?.url && Post.postImage.url.includes("image")) {
      setIsImg(true);
      setIsVideo(false);
    } else {
      setIsImg(false);
      setIsVideo(true);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [Post]);

  const handleLike = async () => {
    try {
      const response = await fetch(
        `http://localhost:5175/api/post/status/${Post._id}/like`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      const data = await response.json();

      if (response.ok) {
        if (data.liked) {
          setHasLiked((prev) => ({
            ...prev,
            [Post._id]: true,
          }));
          setLikeAmount((prev) => prev + 1);
        } else {
          setHasLiked((prev) => ({
            ...prev,
            [Post._id]: false,
          }));
          setLikeAmount((prev) => prev - 1);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  //Modal Functions
  const handleEditClick = () => {
    setIsEdit(true);
    setIsOpenModal(false);
    document.body.style.overflow = "hidden";
  };

  const handleOptions = () => setIsOpenModal((prev) => !prev);

  const closeModal = () => {
    setIsEdit(false);
    document.body.style.overflow = "auto";
  };

  return (
    <div className="font-montagu px-2 h-full">
      <div className="flex justify-center w-full pb-5">
        <div className="w-full max-w-3xl pb-2">
          <div className="flex gap-4 rounded-lg drop-shadow-xl py-6 bg-white px-4">
            <div className="w-12 flex-shrink-0">
              <Link to={`/profile/${Post.userId.username}`}>
                <img
                  src={Post?.userId?.profilePic?.url}
                  className="w-12 h-12 rounded-4xl mr-12 cursor-pointer border-1 border-gray-200"
                />
              </Link>
            </div>
            <div className="text-left pr-2 max-w-3xl w-full">
              <div className="flex justify-between">
                <Link to={`/profile/${Post.userId.username}`}>
                  <p className="text-xl font-semibold cursor-pointer inline-block hover:text-btn">
                    {Post.userId.username}
                  </p>
                </Link>
                {Post.same && (
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
                          <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                            <DeletePostComponent
                              PostId={Post._id}
                              GoToHome={Home}
                              Type={"post"}
                            />
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
                {Post?.postTitle && (
                  <Link to={`/${Post?.userId?.username}/status/${Post?._id}`}>
                    <p className="text-justify pb-3">{Post.postTitle}</p>
                  </Link>
                )}
                {/* Image Post */}
                {Post?.postImage?.url && isImg && (
                  <Link to={`/${Post.userId.username}/status/${Post._id}`}>
                    <img
                      src={Post?.postImage?.url}
                      className="mb-3 max-w-[680px] max-h-[600px] object-cover w-full rounded-md border border-gray-200"
                    />
                  </Link>
                )}
                {/* Video Post */}
                {Post?.postImage?.url && isVideo && (
                  <VideoThumbnail
                    videoSrc={Post?.postImage?.url}
                    postId={Post._id}
                    username={Post.userId.username}
                    type={"status"}
                  />
                )}

                <hr className="pt-3" />
              </div>

              <div className="flex justify-between mx-10">
                {/* Comments */}
                <Link to={`/${Post.userId.username}/status/${Post._id}`}>
                  <div
                    className="flex select-none cursor-pointer"
                    data-tooltip-target={tooltipCommentId}
                  >
                    <img src="/images/comment.png" className="w-6 h-6 mr-1" />
                    <p>{Post.commentCount}</p>
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
                      src={`/images/${
                        hasLiked[Post._id] ? "heart-liked" : "heart"
                      }.png`}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <p>{likeAmount}</p>
                </div>
                {/* Share Link */}
                <ShareLinkComponent
                  username={Post.userId.username}
                  id={Post._id}
                  type={"status"}
                />
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
        <EditPostComponent
          post={Post}
          onClose={closeModal}
          isImg={isImg}
          isVideo={isVideo}
          type={"post"}
        />
      )}
    </div>
  );
};

export default Post;
