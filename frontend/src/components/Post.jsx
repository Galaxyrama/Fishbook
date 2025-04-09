import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Tooltip } from "flowbite";

const Post = ({ User, Img, DateUpload, ProfilePic, LikeAmount }) => {
  const date = new Date(DateUpload);
  const tooltipCommentId = `tooltip-comment-${User}-${DateUpload}`;
  const tooltipLikeId = `tooltip-like-${User}-${DateUpload}`;

  const [likeAmount, setLikeAmount] = useState(LikeAmount);
  const [hasLiked, setHasLiked] = useState(false);
  const [heartImg, setHeartImg] = useState("/images/heart.png");
  const [tooltipLike, setTooltipLike] = useState("Like");

  const [isOpen, setIsOpen] = useState(false);

  const formattedDate = date.toLocaleDateString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  });

  const handleShareLink = () => {
    navigator.clipboard.writeText(`${window.location.href}${User}/status/1`);
    setIsOpen(true);

    setTimeout(() => setIsOpen(false), 5000);
  };

  const handleLike = () => {
    if(!hasLiked) { 
      setLikeAmount(likeAmount + 1); 
      setHasLiked(true);
      setHeartImg("/images/heart-liked.png");
      setTooltipLike("Unlike");
    } else {
      setLikeAmount(likeAmount - 1); 
      setHasLiked(false);
      setHeartImg("/images/heart.png");
      setTooltipLike("Like");
    }
  }

  useEffect(() => {
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

  return (
    <div className="font-montagu px-2 h-full">
      <div className="flex justify-center w-full pb-5">
        <div className="w-full max-w-3xl pb-2">
          <div className="flex gap-4 rounded-lg drop-shadow-xl py-6 bg-white px-4 ">
            <div className="w-12 flex-shrink-0">
              <Link to={`/profile/${User}`}>
                <img
                  src={ProfilePic}
                  alt=""
                  className="w-12 h-12 rounded-4xl mr-12 cursor-pointer"
                />
              </Link>
            </div>
            <div className="text-left pr-2 max-w-3xl">
              <Link to={`/profile/${User}`}>
                <p className="text-xl font-semibold cursor-pointer inline-block hover:text-btn">
                  {User}
                </p>
              </Link>
              <p className="pb-2 text-sm text-gray-500">{formattedDate}</p>

              <div>
                {/* Text Post */}
                <Link to={`/${User}/status/1`}>
                  <p className="text-justify pb-3 cursor-pointer">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Quidem, eaque maxime. Ex, earum vitae, blanditiis
                    perferendis voluptate eaque dolore porro magni facilis
                    consequuntur totam omnis odio perspiciatis recusandae
                    mollitia quo?
                  </p>
                </Link>
                {/* Image Post */}
                {Img && <img src={Img} alt="" className="pb-3 w-full" />}

                <hr className="pt-3" />

                <div className="flex justify-between mx-10">
                  {/* Comments */}
                  <Link to={`/${User}/status/1`}>
                    <div
                      className="flex select-none cursor-pointer"
                      data-tooltip-target={tooltipCommentId}
                    >
                      <img
                        src="/images/comment.png"
                        alt=""
                        className="w-6 h-6 mr-1"
                      />
                      <p>590</p>
                    </div>
                  </Link>
                  {/* Likes */}
                  <div
                    className="flex select-none cursor-pointer"
                    data-tooltip-target={tooltipLikeId}
                    onClick={handleLike}
                  >
                    <img
                      src={heartImg}
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
        {tooltipLike}
      </div>
    </div>
  );
};

export default Post;
