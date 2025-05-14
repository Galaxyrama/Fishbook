import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { BsFileEarmarkImage } from "react-icons/bs";
import { HiGif } from "react-icons/hi2";
import { FaFileVideo } from "react-icons/fa";

const ReplyComponent = ({ type, commentedOnId }) => {
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

  const handleAddPost = (e) => {
    const addFile = e.target.files[0];
    const maxSizeInMb = 50 * 1024 * 1024;

    console.log(addFile);

    if (!addFile) return;

    //sets the largest file size to 50mb
    if (addFile.size > maxSizeInMb) {
      alert("File is too large. Maximum allowed size is 50mb");
      return;
    }

    const mimeType = addFile.type;

    if (mimeType.startsWith("image/")) {
      setIsImgReply(true);
      setIsVideoReply(false);
    } else if (mimeType.startsWith("video/")) {
      setIsImgReply(false);
      setIsVideoReply(true);
    } else {
      console.log("Unsupported file type");
    }

    const url = URL.createObjectURL(addFile);
    setFileReply(url);
  };

  //converts the blob url into a base64 string
  const convertBlobToBase64 = async (blobUrl) => {
    const response = await fetch(blobUrl);
    const blob = await response.blob();

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const handleRemoveFile = () => {
    setFileReply("");
    setIsImgReply(false);
    setIsVideoReply(false);
  };

  const handleCommentUpload = async () => {
    if (!fileReply && !comment) return;

    let base64 = null;

    if (fileReply) {
      base64 = await convertBlobToBase64(fileReply);
    }

    const response = await fetch(
      `http://localhost:5175/api/comment/${type}/upload`,
      {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postTitle: comment,
          postFile: base64,
          commentedOnId,
        }),
      }
    );

    const data = await response.json();

    if (response.ok) {
      console.log(data);
      location.reload();
    }
  };

  return (
    <div>
      {/* Post comment block */}
      <div className="flex py-3 w-full">
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
            placeholder="Post your comment"
            onChange={handleCommentChange}
            onClick={() => setIsCommentClicked(true)}
            value={comment}
            maxLength={1500}
            rows={1}
          />
          {fileReply && isImgReply && (
            <div className="relative mr-1">
              <img
                src={fileReply}
                alt="Photo"
                className="h-full flex w-full my-2 ml-2 justify-center 
                            border border-gray-200 rounded-sm"
              />
              <img
                className="absolute top-2 right-1 w-7 h-7 cursor-pointer"
                src="/images/exit-btn.png"
                alt="Remove"
                onClick={handleRemoveFile}
              />
            </div>
          )}
          {fileReply && isVideoReply && (
            <div className="relative mr-1">
              <video
                src={fileReply}
                alt="Video"
                className="h-full flex w-full my-2 ml-2 justify-center 
                            border border-gray-200 rounded-sm"
              />
              <img
                className="absolute top-2 right-3 w-7 h-7 py-5 cursor-pointer"
                src="/images/exit-btn.png"
                alt="Remove"
                onClick={handleRemoveFile}
              />
            </div>
          )}
          {isCommentClicked && (
            <div className="flex gap-3 float-right">
              {/* Add Image */}
              <label htmlFor="imgUpload">
                <BsFileEarmarkImage
                  className="w-8 h-8 cursor-pointer"
                  color="#7fcdff"
                />
              </label>

              <input
                type="file"
                className="text-white py-2 px-5 
                      bg-btn rounded-xl cursor-pointer
                      text-[0px] hidden"
                id="imgUpload"
                accept="image/png, image/jpeg"
                onChange={handleAddPost}
              />

              {/* Add Gif */}
              <label htmlFor="gifUpload">
                <HiGif className="w-8 h-8 cursor-pointer" color="#7fcdff" />
              </label>

              <input
                type="file"
                className="text-white py-2 px-5 
                      bg-btn rounded-xl cursor-pointer
                      text-[0px] hidden"
                id="gifUpload"
                accept="image/gif"
                onChange={handleAddPost}
              />

              {/* Video upload */}
              <label htmlFor="videoUpload">
                <FaFileVideo
                  className="w-8 h-8 cursor-pointer"
                  color="#7fcdff"
                />
              </label>

              <input
                type="file"
                className="text-white py-2 px-5 
                      bg-btn rounded-xl cursor-pointer
                      text-[0px] hidden"
                id="videoUpload"
                accept="video/mp4"
                onChange={handleAddPost}
              />
            </div>
          )}
        </div>
        <div className="pt-2">
          <button
            className="inline-block bg-btn h-10 text-white px-4 rounded-full cursor-pointer"
            onClick={handleCommentUpload}
          >
            Comment
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReplyComponent;
