import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Tooltip } from "flowbite";
import VideoThumbnail from "./VideoThumbnail";

const Post = ({
  PostID,
  User,
  File,
  DateUpload,
  ProfilePic,
  LikeAmount,
  CommentAmount,
  PostTitle,
}) => {
  const date = new Date(DateUpload);
  const tooltipCommentId = `tooltip-comment-${PostID}`;
  const tooltipLikeId = `tooltip-like-${PostID}`;

  const [likeAmount, setLikeAmount] = useState(LikeAmount);
  const [hasLiked, setHasLiked] = useState();
  //to prevent visual bug on the like from showing incorrect numbers
  const [postLiked, setPostLiked] = useState();

  const [isOpen, setIsOpen] = useState(false);
  const [isVideo, setIsVideo] = useState(false);
  const [isImg, setIsImg] = useState(false);

  const formattedDate = date.toLocaleDateString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  });

  useEffect(() => {
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

    if (!File) return;

    if (File.includes("video")) {
      setIsVideo(true);
      setIsImg(false);
    } else {
      setIsImg(true);
      setIsVideo(false);
    }

    tooltipAppear();
    getLikeStatus();
  }, [File]);

  const handleShareLink = () => {
    navigator.clipboard.writeText(
      `${window.location.href}${User}/status/${PostID}`
    );
    setIsOpen(true);

    setTimeout(() => setIsOpen(false), 5000);
  };

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
        if(data.liked) {
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
              <Link to={`/profile/${User}`}>
                <p className="text-xl font-semibold cursor-pointer inline-block hover:text-btn">
                  {User}
                </p>
              </Link>
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
                    <img src={File} alt="" className="pb-3 w-full" />
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
                <div
                  className="flex select-none cursor-pointer"
                  onClick={handleShareLink}
                >
                  <img src="/images/share.png" className="w-g h-6 mr-1" />
                  <p>Share</p>
                </div>
              </div>
            </div>
          </div>
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
        {hasLiked ? "Unlike" : "Like"}
      </div>
    </div>
  );
};

export default Post;
