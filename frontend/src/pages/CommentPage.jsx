import React, { useState, useEffect, useRef } from "react";
import Navbar from "../components/Navbar";
import { Link, useParams } from "react-router-dom";
import CommentComponent from "../components/CommentComponent";
import ReplyComponent from "../components/ReplyComponent";
import ShareLinkComponent from "../components/ShareLinkComponent";
import VideoThumbnail from "../components/VideoThumbnail";
import useAuth from "../hook/useAuth";
import DeletePostComponent from "../components/DeletePostComponent";
import EditPostComponent from "../components/EditPostComponent";

const CommentPage = () => {
  useAuth();

  const { username, id } = useParams();
  const tooltipCommentId = `tooltip-comment-${username}-${id}`;
  const tooltipLikeId = `tooltip-like-${username}-${id}`;

  const tooltipCommentId2 = `tooltip-comment-${username}-2`;
  const tooltipLikeId2 = `tooltip-like-${username}-2`;

  const [post, setPost] = useState();
  //the current comment that the user is looking at
  const [currentComment, setCurrentComment] = useState();
  const [comments, setComments] = useState([]); //all the comments
  const [sameUser, setSameUser] = useState();

  //for post
  const [isLikedPost, setIsLikedPost] = useState(false);
  const [postLikeCount, setPostLikeCount] = useState();
  const [isPostVideo, setIsPostVideo] = useState(false);
  const [isPostImg, setIsPostImg] = useState(false);

  const [type, setType] = useState();

  //for the current comment
  const [isLikedComment, setIsLikedComment] = useState(false);
  const [commentLikeCount, setCommentLikeCount] = useState();
  const [isCommentVideo, setIsCommentVideo] = useState(false);
  const [isCommentImg, setIsCommentImg] = useState(false);

  const [dateUpload, setDateUpload] = useState();

  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

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

    const getCommentAndPost = async () => {
      try {
        const res = await fetch(`http://localhost:5175/api/comment/${id}`, {
          credentials: "include",
        });

        const data = await res.json();

        if (res.ok) {
          setCurrentComment(data.comment);
          setPost(data.post);
          setSameUser(data.sameUser);
          setType(data.type);
        }
      } catch (e) {
        console.error(e);
      }
    };

    const getComments = async () => {
      try {
        const res = await fetch(
          `http://localhost:5175/api/comment/${id}/Comment`,
          { credentials: "include" }
        );

        const data = await res.json();

        if (res.ok) {
          setComments(data);
        }
      } catch (e) {
        console.error(e);
      }
    };

    getCommentAndPost();
    getComments();
    tooltipAppear();
  }, [id]);

  useEffect(() => {
    setCommentLikeCount(currentComment?.likeCount);
    setPostLikeCount(post?.likeCount);

    setDateUpload(formattedDateAndTime(currentComment?.createdAt));

    if (currentComment?.postImage?.url?.includes("image")) {
      setIsCommentImg(true);
      setIsCommentVideo(false);
    } else {
      setIsCommentVideo(true);
      setIsCommentImg(false);
    }

    if (post?.postImage?.url?.includes("image")) {
      setIsPostImg(true);
      setIsPostVideo(false);
    } else {
      setIsPostVideo(true);
      setIsPostImg(false);
    }

    const getLikeStatus = async (type, typeId, type2) => {
      try {
        const res = await fetch(
          `http://localhost:5175/api/${
            type === "status" ? "post" : "comment"
          }/${typeId}/isLiked`,
          {
            credentials: "include",
          }
        );

        const data = await res.json();

        if (res.ok) {
          if (type2 === "post") {
            setIsLikedPost(data.liked);
          } else {
            setIsLikedComment(data.liked);
          }
        }
      } catch (e) {
        console.error(e);
      }
    };

    if (currentComment && post) {
      getLikeStatus(type, post._id, "post");
      getLikeStatus("comment", currentComment._id, "comment");
    }
  }, [currentComment, post]);

  const formattedDate = (e) => {
    const date = new Date(e);

    const formattedDate = date.toLocaleDateString([], {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    });

    return formattedDate;
  };

  const formattedDateAndTime = (e) => {
    const date = new Date(e);

    const formattedDate = date.toLocaleDateString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    return formattedDate;
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

  return (
    <div className={`min-h-screen bg-background font-montagu`}>
      <Navbar />

      <div className="flex justify-center px-2 pt-20 pb-5">
        <div className="block px-5 max-w-3xl pt-2 bg-white rounded-xl drop-shadow-xl">
          {/* Post block */}
          <div className="flex py-2">
            <div className="flex-shrink-0 w-12 mr-3">
              <Link to={`/profile/${username}`}>
                <img
                  src={post?.userId?.profilePic?.url}
                  className="w-12 h-12 rounded-full border border-gray-200"
                />
              </Link>

              {/* Vertical divider */}
              <Link
                to={`/${post?.userId?.username}/${
                  currentComment?.commentedOnModel === "Post"
                    ? "status"
                    : "comment"
                }/${post?._id}`}
              >
                <div className="w-[4px] h-full bg-btn mx-5" />
              </Link>
            </div>
            <div className="block w-full">
              <div className="flex justify-between">
                <Link to={`/profile/${post?.userId?.username}`}>
                  <p className="text-xl font-semibold cursor-pointer inline-block hover:text-btn">
                    {post?.userId?.username}
                  </p>
                </Link>
              </div>
              <p className="flex text-gray-500 select-none mb-2">
                {formattedDate(post?.createdAt)}
              </p>
              <Link
                to={`/${post?.userId?.username}/${
                  currentComment?.commentedOnModel === "Post"
                    ? "status"
                    : "comment"
                }/${post?._id}`}
              >
                <p className="text-justify mb-2">{post?.postTitle}</p>
                {isPostImg && post?.postImage?.url && (
                  <img
                    src={post?.postImage?.url}
                    className="w-full rounded-sm border border-gray-200"
                  />
                )}
              </Link>

              {isPostVideo && post?.postImage?.url && (
                <VideoThumbnail videoSrc={post?.postImage?.url} />
              )}
              <div className="flex justify-between px-5 py-2">
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
                >
                  <img
                    src={`/images/${isLikedPost ? "heart-liked" : "heart"}.png`}
                    alt="like"
                    className="w-6 h-6 mr-1"
                  />
                  <p>{postLikeCount}</p>
                </div>
                {/* Share Link */}
                <ShareLinkComponent
                  type={"status"}
                  username={post?.userId?.username}
                  id={post?._id}
                />
              </div>
              <hr className="mt-2" />
            </div>
          </div>

          {/* Current comment block */}
          <div className="flex py-2 w-full">
            <div className="flex-shrink-0 w-12 mr-3 flex">
              <img
                src={currentComment?.userId?.profilePic?.url}
                className="w-12 h-12 rounded-full mr-3 border border-gray-200"
              />
            </div>
            <div className="flex w-full items-center justify-between">
              <Link to={`/profile/${username}`}>
                <p className="text-xl font-semibold cursor-pointer inline-block my-2 hover:text-btn">
                  {username}
                </p>
              </Link>
              {/* Three buttons */}
              {sameUser && (
                <div className="relative inline-block float-right">
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
            </div>
          </div>
          <div>
            <div className="block w-full">
              <p className="text-justify pb-2">{currentComment?.postTitle}</p>
              {currentComment?.postImage?.url && isCommentImg && (
                <img
                  src={currentComment?.postImage?.url}
                  className="border border-gray-200 rounded-sm w-full"
                />
              )}
              <div className="flex text-gray-500 select-none pt-2 text-[13px]">
                {dateUpload}
              </div>
            </div>
          </div>
          <hr className="mt-2" />
          <div className="flex justify-between sm:justify-around px-10 py-2">
            {/* Comments */}
            <div
              className="flex select-none cursor-pointer items-center"
              data-tooltip-target={tooltipCommentId2}
            >
              <img src="/images/comment.png" className="w-6 h-6 mr-1" />
              <p>{currentComment?.commentCount}</p>
            </div>
            {/* Likes */}
            <div
              className="flex select-none cursor-pointer items-center"
              data-tooltip-target={tooltipLikeId2}
            >
              <img
                src={`/images/${isLikedComment ? "heart-liked" : "heart"}.png`}
                alt=""
                className="w-6 h-6 mr-1"
              />
              <p>{commentLikeCount}</p>
            </div>
            {/* Share Link */}
            <ShareLinkComponent type={"status"} />
          </div>
          <hr />

          {/* Post comment block */}
          <ReplyComponent type={"Comment"} commentedOnId={id} />

          {comments.map((comment) => (
            <CommentComponent Comment={comment} key={comment._id} />
          ))}

          <hr className="py-2" />
        </div>
      </div>

      {/* Tooltip for Comment post*/}
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

      {/* Tooltip for Like post*/}
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

      {/* Tooltip for Comment for current comment*/}
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

      {/* Tooltip for Like for current comment*/}
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

      {isEdit && (
        <EditPostComponent
          post={currentComment}
          onClose={closeModal}
          isImg={isCommentImg}
          isVideo={isCommentVideo}
          type={"comment"}
        />
      )}
    </div>
  );
};

export default CommentPage;
