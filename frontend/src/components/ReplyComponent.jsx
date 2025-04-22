import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";

const ReplyComponent = () => {
  const textareaRef = useRef(null);

  const [currentUser, setCurrentUser] = useState([]);

  const [comment, setComment] = useState("");
  const [isCommentClicked, setIsCommentClicked] = useState(false);
  const [isImgReply, setIsImgReply] = useState(false);
  const [isVideoReply, setIsVideoReply] = useState(false);
  const [fileReply, setFileReply] = useState();

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await fetch(`http://localhost:5175/api/user/`, {
          credentials: "include",
        });

        const data = await response.json();

        if (response.ok) {
          setCurrentUser(data);
        }
      } catch (e) {
        console.error(e);
      }
    };

    getUser();
  }, []);

  // dynamically changes the height of textarea
  const handleCommentChange = (e) => {
    setComment(e.target.value);

    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  return (
    <div>
      {/* Post comment block */}
      <div className="flex py-3">
        <div className="w-12 flex-shrink-0">
          <Link to={`/profile/${currentUser?.username}`}>
            <img
              src={currentUser?.profile?.url}
              className="w-12 h-12 rounded-full inline-block border-1 border-gray-200"
            />
          </Link>
        </div>
        <div className="block w-full">
          <textarea
            ref={textareaRef}
            className={`focus:ring-0 pt-4 border-0 w-full resize-none h-auto`}
            placeholder="Post your reply"
            onChange={handleCommentChange}
            onClick={() => setIsCommentClicked(true)}
            value={comment}
            maxLength={1500}
            rows={1}
          />
          {fileReply &&
            isImgReply(
              <div className="relative mr-1">
                <img src={fileReply} alt="Photo" />
                <img
                  className="absolute top-2 right-3 w-7 h-7 cursor-pointer"
                  src="/images/exit-btn.png"
                  alt="Remove"
                />
              </div>
            )}
          {fileReply &&
            isVideoReply(
              <div className="relative mr-1">
                <video src={fileReply} alt="Video" />
                <img
                  className="absolute top-2 right-3 w-7 h-7 cursor-pointer"
                  src="/images/exit-btn.png"
                  alt="Remove"
                />
              </div>
            )}
          {isCommentClicked && (
            <div className="flex gap-3 float-right">
              {/* Add Image */}
              <label htmlFor="imgUpload">
                <img
                  src="/images/photo.png"
                  className="w-8 h-8 cursor-pointer"
                  alt="Photo"
                />
              </label>

              <input
                type="file"
                className="text-white py-2 px-5 
                      bg-btn rounded-xl cursor-pointer
                      text-[0px] hidden"
                id="imgUpload"
                accept="image/png, image/jpeg"
              />

              {/* Add Gif */}
              <label htmlFor="gifUpload">
                <img
                  src="/images/gif.png"
                  className="w-8 h-8 cursor-pointer"
                  alt="Gif"
                />
              </label>

              <input
                type="file"
                className="text-white py-2 px-5 
                      bg-btn rounded-xl cursor-pointer
                      text-[0px] hidden"
                id="gifUpload"
                accept="image/gif"
              />

              {/* Video upload */}
              <label htmlFor="videoUpload">
                <img
                  src="/images/video.png"
                  className="w-8 h-8 cursor-pointer"
                  alt="Video"
                />
              </label>

              <input
                type="file"
                className="text-white py-2 px-5 
                      bg-btn rounded-xl cursor-pointer
                      text-[0px] hidden"
                id="videoUpload"
                accept="video/mp4"
              />
            </div>
          )}
        </div>
        <div className="pt-2">
          <button className="inline-block bg-btn h-10 text-white px-5 rounded-full cursor-pointer">
            Reply
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReplyComponent;
