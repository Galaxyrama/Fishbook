import React, { useEffect, useRef, useState } from "react";
import Navbar from "../components/Navbar";
import { Link, useParams } from "react-router-dom";
import CommentComponent from "../components/CommentComponent";

const PostPage = () => {
  const { username, id } = useParams();
  const tooltipCommentId = `tooltip-comment-${username}-${id}`;
  const tooltipLikeId = `tooltip-like-${username}-${id}`;
  const textareaRef = useRef(null);

  const [isOpen, setIsOpen] = useState(false);
  const [comment, setComment] = useState("");

  const handleShareLink = () => {
    navigator.clipboard.writeText(
      `${window.location.href}${username}/status/${id}`
    );
    setIsOpen(true);

    setTimeout(() => setIsOpen(false), 5000);
  };

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

  return (
    <div className="font-montagu h-screen bg-background">
      <Navbar />

      {/* Post block */}
      <div className="flex justify-center px-2 pt-20">
        <div className="block px-5 max-w-3xl bg-white rounded-xl drop-shadow-xl">
          <div className="flex items-center justify-between py-3">
            <div className="flex gap-3 items-center">
              <Link to={`/profile/${username}`}>
                <img
                  src="/images/fishBackground.jpg"
                  className="w-12 h-12 rounded-full"
                />
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
            <p className="text-2xl select-none cursor-pointer hover:text-btn">
              •••
            </p>
          </div>
          <p className="text-justify">
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Sed quod
            explicabo.
          </p>
          <img src="/images/lmao.png" className="w-full" />
          <div className="flex text-gray-500 select-none py-3 text-[13px]">
            <p>Post Time</p>
            <p className="px-1">•</p>
            <p>Post Date</p>
          </div>
          <hr />
          <div className="flex justify-between mr-10 ml-15 py-2">
            {/* Comments */}
            <div
              className="flex select-none cursor-pointer"
              data-tooltip-target={tooltipCommentId}
            >
              <img src="/images/comment.png" className="w-6 h-6 mr-1" />
              <p>590</p>
            </div>
            {/* Likes */}
            <div
              className="flex select-none cursor-pointer"
              data-tooltip-target={tooltipLikeId}
            >
              <img src="/images/heart.png" alt="" className="w-6 h-6 mr-1" />
              <p>8770</p>
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
                  src="/images/fishBackground.jpg"
                  className="w-12 h-12 rounded-full inline-block"
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
        Like
      </div>
    </div>
  );
};

export default PostPage;
