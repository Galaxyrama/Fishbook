import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const CommentComponent = ({ User, Img, DateUpload, ProfilePic }) => {
  const tooltipCommentId = `tooltip-comment-${User}-${DateUpload}`;
  const tooltipLikeId = `tooltip-like-${User}-${DateUpload}`;

  useEffect(() => {
    document.documentElement.scrollTop = 0;

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
  }, []);

  const handleShareLink = () => {
    navigator.clipboard.writeText(
      `${window.location.href}${username}/status/${id}`
    );
    setIsOpen(true);

    setTimeout(() => setIsOpen(false), 5000);
  };

  return (
    <div className="font-montagu">
      <hr />
      <div className="py-2 flex gap-3">
        <div className="flex-shrink-0 w-12">
          <Link to={`/profile/${User}`}>
            <img
              src="/images/fishBackground.jpg"
              className="w-12 h-12 rounded-full"
            />
          </Link>
        </div>
        <div className="block">
          <Link to={`/profile/${User}`}>
            <p className="font-medium hover:text-btn mt-1 inline-block">
              {User}
            </p>
          </Link>
          <p className="text-sm text-gray-500">{DateUpload}</p>
          <Link to={`/${User}/comment/1`}>
            <p className="text-justify mt-2 cursor-pointer">
              Lorem ipsum dolor sit, amet consectetur adipisicing elit. Fuga magni
              quia saepe harum accusantium mollitia explicabo eaque facere, sequi
              consequuntur sunt officia expedita! Quasi qui asperiores, optio
              distinctio in deserunt?
            </p>
          </Link>

          <div className="flex justify-between mr-10 py-2">
            {/* Comments */}
            <div
              className="flex select-none cursor-pointer"
              data-tooltip-target={tooltipCommentId}
            >
              <img src="/images/comment.png" alt="" className="w-6 h-6 mr-1" />
              <p>590</p>
            </div>
            {/* Likes */}
            <div
              className="flex select-none cursor-pointer"
              data-tooltip-target={tooltipLikeId}
            >
              <img src="/images/heart.png" alt="" className="w-6 h-6 mr-1" />
              <p>100</p>
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
    </div>
  );
};

export default CommentComponent;
