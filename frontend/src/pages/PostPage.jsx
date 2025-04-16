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

  const [post, setPost] = useState();
  const [dateUpload, setDateUpload] = useState();
  const [isLiked, setIsLiked] = useState(false);
  const [likeAmount, setLikeAmount] = useState(0);

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
        }
      } catch (e) {
        console.error(e);
      }
    };

    getPost();
    tooltipAppear();
  }, []);

  useEffect(() => {
    formattedUpload(post?.createdAt);

    if (post?.postImage?.url.includes("video")) {
      setIsVideo(true);
      setIsImg(false);
      return;
    } else {
      setIsImg(true);
      setIsVideo(false);
      return;
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
        if(data.liked) {
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
            <p className="text-2xl select-none cursor-pointer hover:text-btn">
              •••
            </p>
          </div>{" "}
          {post?.postTitle && <p className="text-justify pb-3">{post?.postTitle}</p>}
          {post?.postImage && isImg && (
            <img src={post?.postImage.url} className="w-full"/>
          )}
          {post?.postImage && isVideo && (
            <VideoThumbnail
              videoSrc={post?.postImage.url}
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
    </div>
  );
};

export default PostPage;
