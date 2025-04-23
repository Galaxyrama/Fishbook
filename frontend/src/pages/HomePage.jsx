import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hook/useAuth";
import Navbar from "../components/Navbar";
import Post from "../components/Post";

const HomePage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const textareaRef = useRef(null);

  const navigate = useNavigate();

  const [username, setUsername] = useState("N/A");
  const [profilePicture, setProfilePicture] = useState("");
  const [posts, setPosts] = useState([]);

  const [postTitle, setPostTitle] = useState("");
  const [addPost, setAddPost] = useState("");
  const [isImage, setIsImage] = useState(false);
  const [isVideo, setIsVideo] = useState(false);

  const [uploaded, setUploaded] = useState(); //just need the state to keep changing

  const openModal = () => {
    setIsOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setIsOpen(false);
    document.body.style.overflow = "auto";
  };

  useAuth();

  useEffect(
    () => {
      const getUser = async () => {
        try {
          const response = await fetch("http://localhost:5175/api/user/", {
            credentials: "include",
          });

          const data = await response.json();

          if (response.ok) {
            if (data.profile.url == null) {
              navigate(`/setup/${data.username}`);
              return;
            }

            setUsername(data.username);
            setProfilePicture(data.profile.url);
          }
        } catch (error) {
          console.error("Session check failed", error);
        }
      };

      const getPosts = async () => {
        try {
          const response = await fetch("http://localhost:5175/api/post/", {
            credentials: "include",
          });

          const data = await response.json();

          if (response.ok) {
            setPosts(data);
          }
        } catch (e) {
          console.error(e);
        }
      };

      document.documentElement.scrollTop = 0;
      getUser();
      getPosts();
    },
    [],
    [uploaded]
  );

  // dynamically changes the height of textarea
  const handlePostChange = (e) => {
    const value = e.target.value;
    setPostTitle(value);

    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
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
    if (!addPost && !postTitle) return;

    let base64 = null;

    if (addPost) {
      base64 = await convertBlobToBase64(addPost);
    }

    const response = await fetch("http://localhost:5175/api/post/upload", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        postTitle,
        postImage: base64,
      }),
    });

    const data = await response.json();
    console.log(data);

    closeModal();
    setAddPost("");
    setPostTitle("");
    setUploaded((prev) => !prev);
    location.reload();
  };

  const handleAddPost = (e) => {
    const addFile = e.target.files[0];
    const maxSizeInMB = 50;
    const maxSizeInByte = maxSizeInMB * 1024 * 1024;

    if (!addFile) return;

    //sets the largest file size to 50mb
    if (addFile.size > maxSizeInByte) {
      alert("File is too large. Maximum allowed size is 50mb");
      return;
    }

    const mimeType = addFile.type;

    if (mimeType.startsWith("image/")) {
      setIsImage(true);
      setIsVideo(false);
    } else if (mimeType.startsWith("video/")) {
      setIsImage(false);
      setIsVideo(true);
    } else {
      console.log("Unsupported file type");
    }

    const url = URL.createObjectURL(addFile);
    setAddPost(url);
  };

  const handlePostRemove = () => {
    setIsImage(false);
    setIsVideo(false);
    setAddPost("");
  };

  return (
    <div className="bg-background font-montagu h-full">
      <Navbar />

      {username && profilePicture && (
        <div>
          <div className="flex justify-center w-full pb-5 pt-20 px-2">
            <div className="w-full max-w-3xl">
              <div className="flex items-center gap-4 rounded-lg drop-shadow-xl py-6 bg-white px-4">
                <div className="w-12 flex-shrink-0">
                  <Link to={`/profile/${username}`}>
                    <img
                      src={profilePicture}
                      className="w-12 h-12 rounded-4xl border-1 border-gray-200"
                    />
                  </Link>
                </div>
                <button
                  className="py-3 bg-btn rounded-xl text-white px-5 sm:text-xl
                             cursor-pointer sm:pr-15 w-[670px] max-w-[670px] text-center"
                  onClick={openModal}
                >
                  What's swimming through your mind, {username}?
                </button>
              </div>
            </div>
          </div>

          {posts &&
            posts.map((post) => (
              <Post Post={post} Home={true} key={post._id} />
            ))}

          {/* Modal for Create Post */}
          {isOpen && (
            <div className="flex justify-center items-center px-3 pt-40 pb-8 fixed inset-0 bg-gray-500/50 overflow-y-auto">
              <div className="max-w-xl w-full bg-white rounded-lg drop-shadow-xl max-h-screen flex flex-col">
                {/* Header */}
                <div className="w-full relative text-center justify-center py-2">
                  <h1 className="text-2xl">Create Post</h1>
                  <img
                    src="/images/exit-btn.png"
                    onClick={closeModal}
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
                        src={profilePicture}
                        className="w-12 h-12 rounded-full border-1 border-gray-200"
                      />
                    </div>
                    <p className="text-xl">{username}</p>
                  </div>
                  <div className="block py-1 overflow-y-auto max-h-[55vh]">
                    <textarea
                      ref={textareaRef}
                      className="focus:outline-none focus:ring-0 border-0 w-full resize-none h-auto px-0"
                      placeholder={`What's swimming through your mind, ${username}?`}
                      onChange={handlePostChange}
                      maxLength={1500}
                      rows={1}
                      value={postTitle}
                    />
                    {addPost && isImage && (
                      <div className="relative mr-1">
                        <img
                          src={addPost}
                          className="h-full w-full flex justify-center border border-gray-200 rounded-md"
                        />
                        <img
                          className="absolute top-2 right-3 w-7 h-7 cursor-pointer"
                          src="/images/exit-btn.png"
                          onClick={handlePostRemove}
                        ></img>
                      </div>
                    )}
                    {addPost && isVideo && (
                      <div className="relative mr-1">
                        <video
                          src={addPost}
                          className="h-full flex justify-center"
                        />
                        <img
                          className="absolute top-2 right-3 w-7 h-7 cursor-pointer"
                          src="/images/exit-btn.png"
                          alt="Remove"
                          onClick={handlePostRemove}
                        />
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
                      <label htmlFor="imgUpload">
                        <img
                          src="/images/photo.png"
                          className="w-10 h-10 cursor-pointer"
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
                        onChange={handleAddPost}
                      />

                      {/* Gif upload */}
                      <label htmlFor="gifUpload">
                        <img
                          src="/images/gif.png"
                          className="w-10 h-10 cursor-pointer"
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
                        onChange={handleAddPost}
                      />

                      {/* Video upload */}
                      <label htmlFor="videoUpload">
                        <img
                          src="/images/video.png"
                          className="w-10 h-10 cursor-pointer"
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
          )}
        </div>
      )}
    </div>
  );
};

export default HomePage;
