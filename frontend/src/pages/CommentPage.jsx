import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { useParams } from "react-router-dom";

const CommentPage = () => {
  const { username, id } = useParams();

  const tooltipCommentId = `tooltip-comment-${username}-${id}`;
  const tooltipLikeId = `tooltip-like-${username}-${id}`;

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
    <div className="h-screen bg-background font-montagu">
      <Navbar />
      <div>
        
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

export default CommentPage;
