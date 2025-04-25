import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { Link, useParams } from "react-router-dom";
import CommentComponent from "../components/CommentComponent";
import useAuth from "../hook/useAuth";
import VideoThumbnail from "../components/VideoThumbnail";
import ShareLinkComponent from "../components/ShareLinkComponent";
import DeletePostComponent from "../components/DeletePostComponent";
import EditPostComponent from "../components/EditPostComponent";
import ReplyComponent from "../components/ReplyComponent";

const PostPage = () => {
  useAuth();

  const { username, id } = useParams();
  const tooltipCommentId = `tooltip-comment-${id}`;
  const tooltipLikeId = `tooltip-like-${id}`;

  //For Modal
  const [isEdit, setIsEdit] = useState(false);
  const [isOpenModal, setIsOpenModal] = useState(false);

  //For Post
  const [post, setPost] = useState();
  const [postFile, setPostFile] = useState("/images/placeholder-image.webp");
  const [postTitle, setPostTitle] = useState();
  const [dateUpload, setDateUpload] = useState();
  const [isLiked, setIsLiked] = useState(false);
  const [sameUser, setSameUser] = useState();
  const [likeAmount, setLikeAmount] = useState(0);
  const [isVideo, setIsVideo] = useState(false);
  const [isImg, setIsImg] = useState(false);

  //For comment
  const [comments, setComments] = useState([]);

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
          setSameUser(data.sameUser);
        }
      } catch (e) {
        console.error(e);
      }
    };

    const getComments = async () => {
      try {
        const response = await fetch(
          `http://localhost:5175/api/comment/${id}/Post`,
          {
            credentials: "include",
          }
        );

        const data = await response.json();

        if (response.ok) {
          setComments(data);
        }
      } catch (e) {
        console.error(e);
      }
    };

    getPost();
    getComments();
    tooltipAppear();
  }, []);

  useEffect(
    () => {
      formattedUpload(post?.createdAt);

      setPostTitle(post?.postTitle);
      setPostFile(post?.postImage?.url);

      if (post?.postImage?.url && post?.postImage?.url.includes("video")) {
        setIsVideo(true);
        setIsImg(false);
        return;
      } else {
        setIsImg(true);
        setIsVideo(false);
        return;
      }
    },
    [post],
    [comments]
  );

  const formattedUpload = (d) => {
    const date = new Date(d);

    const formattedDate = date.toLocaleDateString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    setDateUpload(formattedDate);
  };

  const handleOptions = () => setIsOpenModal((prev) => !prev);

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
    <div
      className={`font-montagu ${
        comments.length > 0 ? "h-full" : "h-screen"
      } bg-background`}
    >
      <Navbar />

      {/* Post block */}
      <div className="flex justify-center px-2 pt-20 pb-10">
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
            {sameUser && (
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
                          PostId={id}
                          GoToHome={true}
                          Type={"post"}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          {post?.postTitle && <p className="text-justify pb-3">{postTitle}</p>}
          {postFile && isImg && (
            <img
              src={postFile}
              className="w-full border border-gray-200 rounded-md"
            />
          )}
          {postFile && isVideo && (
            <VideoThumbnail
              videoSrc={postFile}
              postId={id}
              username={username}
              type={"status"}
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
            <ShareLinkComponent />
          </div>
          <hr />

          {/*  Reply or Comment */}
          <ReplyComponent type={"Post"} commentedOnId={id} />

          {comments.map((comment) => (
            <CommentComponent Comment={comment} key={comment._id} />
          ))}
          <hr className="pb-2" />
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
        {isLiked ? "Unlike" : "Like"}
      </div>

      {/* Modal for Edit Post */}
      {isEdit && (
        <EditPostComponent
          post={post}
          onClose={closeModal}
          isImg={isImg}
          isVideo={isVideo}
          type={"post"}
        />
      )}
    </div>
  );
};

export default PostPage;
