import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ShareLinkComponent from "./ShareLinkComponent";
import DeletePostComponent from "./DeletePostComponent";
import EditPostComponent from "./EditPostComponent";
import VideoThumbnail from "./VideoThumbnail";
import { FaPen } from "react-icons/fa6";

const CommentComponent = ({ Comment }) => {
  const tooltipCommentId = `tooltip-comment-${Comment.userId._id}`;
  const tooltipLikeId = `tooltip-like-${Comment.userId._id}`;

  const [dateUpload, setDateUpload] = useState();

  const [isLiked, setIsLiked] = useState({});
  const [likeAmount, setLikeAmount] = useState(Comment.likeCount);

  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [isVideo, setIsVideo] = useState(false);
  const [isImg, setIsImg] = useState(false);

  useEffect(() => {
    document.documentElement.scrollTop = 0;

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

    if (Comment?.postImage?.url && Comment?.postImage?.url.includes("image")) {
      setIsImg(true);
      setIsVideo(false);
    } else {
      setIsImg(false);
      setIsVideo(true);
    }

    const getLikeStatus = async () => {
      try {
        const response = await fetch(
          `http://localhost:5175/api/comment/${Comment._id}/isLiked`,
          {
            credentials: "include",
          }
        );

        const data = await response.json();

        if (response.ok) {
          setIsLiked((prev) => ({
            ...prev,
            [Comment._id]: data.liked,
          }));
        }
      } catch (e) {
        console.error(e);
      }
    };

    tooltipAppear();
    getLikeStatus();
    formattedDate();
  }, []);

  const formattedDate = () => {
    const date = new Date(Comment.createdAt);

    const formattedDate = date.toLocaleDateString([], {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    });

    setDateUpload(formattedDate);
  };

  const handleOptions = () => setIsOpenModal((prev) => !prev);

  const handleEditClick = () => {
    setIsEdit(true);
    setIsOpenModal(false);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setIsEdit(false);
    document.body.style.overflow = "auto";
  };

  const handleLike = async () => {
    try {
      const response = await fetch(
        `http://localhost:5175/api/comment/${Comment._id}/like`,
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

  return (
    <div className="font-montagu w-full">
      <hr className="pb-3" />
      <div className="py-2 flex gap-3 w-full">
        <div className="flex-shrink-0 w-12">
          <Link to={`/profile/${Comment.userId.username}`}>
            <img
              src={Comment?.userId?.profilePic?.url}
              className="w-12 h-12 rounded-full border border-gray-200"
            />
          </Link>
        </div>
        <div className="block w-full">
          <Link to={`/profile/${Comment.userId.username}`}>
            <p className="font-medium hover:text-btn mt-1 inline-block">
              {Comment.userId.username}
            </p>
          </Link>
          {Comment.same && (
            <div className="relative inline-block float-right">
              <p
                className="text-2xl select-none cursor-pointer hover:text-btn"
                onClick={handleOptions}
              >
                •••
              </p>
              {isOpenModal && (
                <div className="absolute z-1 rounded bg-white right-0 w-52">
                  <div className="absolute right-3 -top-2 w-3 h-3 rotate-45 bg-white border-l border-t border-gray-200" />
                  <div className="border border-gray-200 rounded shadow bg-white w-52">
                    <div
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={handleEditClick}
                    >
                      <div className="flex">
                        <FaPen className="w-5 h-5 mr-2" />
                        <p>Edit Comment</p>
                      </div>
                    </div>
                    <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                      <DeletePostComponent
                        PostId={Comment._id}
                        GoToHome={true}
                        Type={"comment"}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          <p className="text-sm text-gray-500">{dateUpload}</p>
          <Link to={`/${Comment.userId.username}/comment/${Comment._id}`}>
            <p className="text-justify my-2 cursor-pointer">
              {Comment.postTitle}
            </p>
            {Comment?.postImage?.url && isImg && (
              <img
                src={Comment?.postImage?.url}
                className="w-full border border-gray-200 rounded-sm"
              />
            )}
          </Link>
          {Comment?.postImage?.url && isVideo && (
            <VideoThumbnail
              videoSrc={Comment?.postImage?.url}
              postId={Comment._id}
              type={"comment"}
              username={Comment.userId.username}
            />
          )}

          <div className="flex sm:justify-between justify-evenly pt-3 pb-1 sm:pr-8 w-full">
            {/* Comments */}
            <Link to={`/${Comment.userId.username}/comment/${Comment._id}`}>
              <div
                className="flex select-none cursor-pointer"
                data-tooltip-target={tooltipCommentId}
              >
                <img
                  src="/images/comment.png"
                  alt=""
                  className="w-6 h-6 mr-1"
                />
                <p>{Comment.commentCount}</p>
              </div>
            </Link>
            {/* Likes */}
            <div
              className="flex select-none cursor-pointer"
              data-tooltip-target={tooltipLikeId}
              onClick={handleLike}
            >
              <img
                src={
                  isLiked[Comment._id]
                    ? "/images/heart-liked.png"
                    : "/images/heart.png"
                }
                alt=""
                className="w-6 h-6 mr-1"
              />
              <p>{likeAmount}</p>
            </div>
            {/* Share Link */}
            <ShareLinkComponent
              username={Comment.userId.username}
              id={Comment._id}
              type={"comment"}
            />
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
        Like
      </div>

      {isEdit && (
        <EditPostComponent
          post={Comment}
          onClose={closeModal}
          isImg={isImg}
          isVideo={isVideo}
          type={"comment"}
        />
      )}
    </div>
  );
};

export default CommentComponent;
