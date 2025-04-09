import React, { useState, useEffect, useRef } from "react";
import Navbar from "../components/Navbar";
import { Link, useParams } from "react-router-dom";
import CommentComponent from "../components/CommentComponent";

const CommentPage = () => {
  const { username, id } = useParams();
  const tooltipCommentId = `tooltip-comment-${username}-${id}`;
  const tooltipLikeId = `tooltip-like-${username}-${id}`;

  const tooltipCommentId2 = `tooltip-comment-${username}-2`;
  const tooltipLikeId2 = `tooltip-like-${username}-2`;

  const textareaRef = useRef(null);

  const [isOpen, setIsOpen] = useState(false);
  const [comment, setComment] = useState("");

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
    navigator.clipboard.writeText(`localhost:5173/Test/status/${id}`);
    setIsOpen(true);

    setTimeout(() => setIsOpen(false), 5000);
  };

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
    <div className="h-full bg-background font-montagu">
      <Navbar />

      {/* Post block */}
      <div className="flex justify-center px-2 pt-20">
        <div className="block px-5 max-w-3xl pt-2 bg-white rounded-xl drop-shadow-xl">
          <div className="flex py-2">
            <div className="flex-shrink-0 w-12 mr-3">
              <Link to={`/profile/Test`}>
                <img
                  src="/images/fishBackground.jpg"
                  className="w-12 h-12 rounded-full"
                />
              </Link>

              {/* Vertical divider */}
              <Link to={`/test/status/1`}>
                <div className="w-[4px] h-full bg-btn mx-5" />
              </Link>
            </div>
            <div className="block">
              <p className="text-xl font-semibold cursor-pointer inline-block hover:text-btn">
                Test
              </p>
              <p className="flex text-gray-500 select-none">{Date.now()}</p>
              <Link to={`/test/status/1`}>
                <p className="text-justify">
                  Lorem ipsum dolor, sit amet consectetur adipisicing elit. Sed
                  quod explicabo.
                </p>
                <img src="/images/lmao.png" className="w-full" />
              </Link>
              <div className="flex justify-between py-2 mr-10">
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
                  <img
                    src="/images/heart.png"
                    alt=""
                    className="w-6 h-6 mr-1"
                  />
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
              <hr className="mt-2" />
            </div>
          </div>

          {/* Second block */}
          <div className="flex py-2">
            <div className="flex-shrink-0 w-12 mr-3">
              <img
                src="/images/fishBackground.jpg"
                className="w-12 h-12 rounded-full"
              />
            </div>
            <div className="block">
              <p className="text-xl font-semibold cursor-pointer inline-block my-2 hover:text-btn">
                User2
              </p>
              <p className="text-justify">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Voluptatem architecto alias quo quaerat voluptatum esse
                laudantium minus enim molestias assumenda magnam maxime iste,
                est dolorem, suscipit, at debitis tempora sunt!
              </p>
              <div className="flex text-gray-500 select-none py-3 text-[13px]">
                <p>Post Time</p>
                <p className="px-1">•</p>
                <p>Post Date</p>
              </div>
            </div>
          </div>
          <hr className="mt-2" />
          <div className="flex justify-between sm:justify-around ml-13  mr-10 py-2">
            {/* Comments */}
            <div
              className="flex select-none cursor-pointer items-center"
              data-tooltip-target={tooltipCommentId2}
            >
              <img src="/images/comment.png" className="w-6 h-6 mr-1" />
              <p>590</p>
            </div>
            {/* Likes */}
            <div
              className="flex select-none cursor-pointer items-center"
              data-tooltip-target={tooltipLikeId2}
            >
              <img src="/images/heart.png" alt="" className="w-6 h-6 mr-1" />
              <p>8770</p>
            </div>
            {/* Share Link */}
            <div
              className="flex select-none cursor-pointer items-center"
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

          <CommentComponent User={"User4"} DateUpload={Date.now()} />

          <hr className="py-2" />
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

      {/* Tooltip for Comment */}
      <div
        id={tooltipCommentId2}
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
        id={tooltipLikeId2}
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
