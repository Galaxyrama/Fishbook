import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hook/useAuth";
import Navbar from "../components/Navbar";
import useAuthStore from "../stores/useAuthStore";
import Post from "../components/Post";
import { User } from "../../../backend/src/models/User";

const HomePage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [comment, setComment] = useState("");
  const textareaRef = useRef(null);

  const navigate = useNavigate();

  const openModal = () => {
    setIsOpen(true);
    document.body.style.overflow = "hidden";
  };
  const closeModal = () => {
    setIsOpen(false);
    document.body.style.overflow = "auto";
  };

  const [user, setUser] = useState("NaN");

  useAuth();

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await fetch("http://localhost:5175/api/user/", {
          credentials: "include",
        });

        const data = await response.json();

        if (response.ok) {
          if(data.gender == null || data.currentLocation == null) {
            navigate(`/setup/${data.username}`);
            return;
          }

          setUser(data.username);
        }
      } catch (error) {
        console.error("Session check failed", error);
      }
    };

    document.documentElement.scrollTop = 0;
    getUser();
  }, []);

  // dynamically changes the height of textarea
  const handlePostChange = (e) => {
    const value = e.target.value;
    setComment(value);

    const textarea = textareaRef.current;
    if (textarea) {
      console.log(comment.length);
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  return (
    <div className="bg-background font-montagu h-full">
      <Navbar />

      <div>
        <div className="flex justify-center w-full pb-5 pt-20 px-2">
          <div className="w-full max-w-3xl">
            <div className="flex items-center gap-4 rounded-lg drop-shadow-xl py-6 bg-white px-4">
              <div className="w-12 flex-shrink-0">
                <Link to={`/profile/${user}`}>
                  <img
                    src="/images/fishBackground.jpg"
                    className="w-12 h-12 rounded-4xl cursor-pointer"
                  />
                </Link>
              </div>
              <button
                className="py-3 bg-btn rounded-xl text-white px-5 sm:text-xl
                             cursor-pointer sm:pr-15 w-[670px] max-w-[670px] text-center"
                onClick={openModal}
              >
                What's swimming through your mind, {user}?
              </button>
            </div>
          </div>
        </div>

        <Post
          User="test"
          Img="images/post_sample.jpg"
          DateUpload={Date.now()}
          ProfilePic="images/fishBackground.jpg"
          LikeAmount={200}
        />
        <Post
          User={user}
          Img="images/Towa.jpg"
          DateUpload={Date.now() + 100000000}
          ProfilePic="images/fishBackground.jpg"
          LikeAmount={350}
        />

        {/* Modal for Create Post */}
        {isOpen && (
          <div className="flex justify-center items-center px-3 pt-40 pb-8 fixed inset-0 bg-gray-500/50 overflow-y-auto">
            <div className="max-w-xl w-full bg-white rounded-lg drop-shadow-xl max-h-full">
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
                      src="/images/fishBackground.jpg"
                      className="w-12 h-12 rounded-full"
                    />
                  </div>
                  <p className="text-xl">{user}</p>
                </div>
                <textarea
                  ref={textareaRef}
                  className="focus:outline-none focus:ring-0 border-0 w-full resize-none h-auto px-0"
                  placeholder={`What's swimming through your mind, ${user}?`}
                  onChange={handlePostChange}
                  rows={1}
                  maxLength={1250}
                />
                <div
                  className="flex border-2 border-gray-300 items-center 
                  justify-between py-2 px-3 my-2 rounded-xl"
                >
                  <p>Add to your Post</p>
                  <div className="flex gap-3">
                    <img
                      src="/images/photo.png"
                      className="w-10 h-10 cursor-pointer"
                    />
                    <img
                      src="/images/gif.png"
                      className="w-10 h-10 cursor-pointer"
                    />
                    <img
                      src="/images/video.png"
                      className="w-10 h-10 cursor-pointer"
                    />
                  </div>
                </div>
                <button
                  onClick={closeModal}
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
    </div>
  );
};

export default HomePage;
