import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { BsFileEarmarkImage } from "react-icons/bs";
import { HiGif } from "react-icons/hi2";
import { FaFileVideo } from "react-icons/fa";

const EditPostComponent = ({ post, onClose, isImg, isVideo, type }) => {
  const modalRef = useRef(null);
  const textareaRef = useRef(null);

  const [postTitle, setPostTitle] = useState(post.postTitle);
  const [file, setFile] = useState(post?.postImage?.url || "");
  const [isImgModal, setIsImgModal] = useState(isImg);
  const [isVideoModal, setIsVideoModal] = useState(isVideo);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [post]);

  const handlePostChange = (e) => {
    setPostTitle(e.target.value);

    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  const handleAddPost = async (e) => {
    const addFile = e.target.files[0];
    const maxSize = 50 * 1024 * 1024;

    if (!addFile) return;

    //sets the largest file size to 50mb
    if (addFile.size > maxSize) {
      alert("File is too large. Maximum allowed size is 50mb");
      return;
    }

    const mimeType = addFile.type;

    if (mimeType.startsWith("image/")) {
      setIsImgModal(true);
      setIsVideoModal(false);
    } else if (mimeType.startsWith("video/")) {
      setIsImgModal(false);
      setIsVideoModal(true);
    } else {
      console.log("Unsupported file type");
    }

    const url = URL.createObjectURL(addFile);
    setFile(url);
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

  const handlePostUpload = async () => {
    if (!file && !postTitle) return;

    let base64Image = null;

    if (file) {
      base64Image = await convertBlobToBase64(file);
    }

    const response = await fetch(
      `http://localhost:5175/api/${type}/edit/${post._id}`,
      {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postTitle,
          postImage: base64Image,
        }),
      }
    );

    if (response.ok) {
      location.reload();
    }
  };

  const handlePostRemove = () => {
    setIsImgModal(false);
    setIsVideoModal(false);
    setFile("");
  };

  const toast = (
    <div
      className="flex justify-center items-center px-3 pt-20 fixed inset-0
           bg-gray-500/50 overflow-y-auto z-[100] pointer-events-auto "
    >
      <div
        ref={modalRef}
        className="max-w-xl w-full bg-white rounded-lg drop-shadow-xl max-h-screen flex flex-col"
      >
        {/* Header */}
        <div className="w-full relative text-center justify-center py-2">
          <h1 className="text-2xl">
            Edit {type.charAt(0).toUpperCase() + String(type).slice(1)}
          </h1>
          <img
            src="/images/exit-btn.png"
            onClick={onClose}
            className="w-7 h-7 absolute right-3 top-2.5
                  transform -translatee-y-1/2
                  pointer-events-auto cursor-pointer"
          />
        </div>
        <hr className="py-1 border-[#ACACAC]" />

        {/* Content */}
        <div className="block px-3 py-1">
          <div className="flex items-center gap-2">
            <div className="w-12 flex-shrink-0">
              <img
                src={post?.userId?.profilePic?.url}
                className="w-12 h-12 rounded-full border-1 border-gray-200"
              />
            </div>
            <p className="text-xl">{post?.userId?.username}</p>
          </div>
          <div className="block py-1 overflow-y-auto max-h-[55vh]">
            <textarea
              ref={textareaRef}
              className="focus:outline-none focus:ring-0 border-0 w-full resize-none h-auto px-0"
              placeholder={`Edit the post here`}
              onChange={handlePostChange}
              rows={1}
              value={postTitle}
            />
            {file && isImgModal && (
              <div className="relative mr-2 border border-gray-200 rounded-md">
                <img src={file} className="h-full w-full flex justify-center" />
                <img
                  className="absolute top-2 right-3 w-7 h-7 cursor-pointer"
                  src="/images/exit-btn.png"
                  onClick={handlePostRemove}
                ></img>
              </div>
            )}
            {file && isVideoModal && (
              <div className="relative mr-2 border border-gray-200 rounded-md">
                <video src={file} className="h-full flex justify-center" />
                <img
                  className="absolute top-2 right-3 w-7 h-7 cursor-pointer"
                  src="/images/exit-btn.png"
                  onClick={handlePostRemove}
                ></img>
              </div>
            )}
          </div>
          <div
            className="flex border-2 border-gray-300 items-center 
      justify-between py-2 px-3 my-2 rounded-xl"
          >
            <p>Add to your Post</p>

            {/* Image Upload */}
            <div className="flex gap-3">
              <label htmlFor="imgUpload" className="cursor-pointer">
                <BsFileEarmarkImage
                  className="w-10 h-10 cursor-pointer"
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

              {/* Gif upload */}
              <label htmlFor="gifUpload" className="cursor-pointer">
                <HiGif className="w-10 h-10 cursor-pointer" color="#7fcdff" />
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
                  className="w-10 h-10 cursor-pointer"
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
          </div>
          <button
            onClick={handlePostUpload}
            className="cursor-pointer w-full bg-btn text-white rounded-xl
                    py-2 mb-2"
          >
            Post
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div>{createPortal(toast, document.getElementById("toast-root"))}</div>
  );
};

export default EditPostComponent;
