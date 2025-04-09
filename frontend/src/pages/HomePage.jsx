import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useAuth from "../hook/useAuth";
import Navbar from "../components/Navbar";
import useAuthStore from "../stores/useAuthStore";
import Post from "../components/Post";
import { User } from "../../../backend/src/models/User";

const HomePage = () => {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => {
    setIsOpen(true);
    document.body.style.overflow = "hidden";
  };
  const closeModal = () => {
    setIsOpen(false);
    document.body.style.overflow = "auto";
  };

  const [user, setUser] = useState("evergreenmostly");

  const placeholderValue = `What's swimming through your mind, ${user}?`;
  useAuth();

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await fetch("http://localhost:5175/api/user/", {
          credentials: "include",
        });

        const data = await response.json();

        if (response.ok) {
          setUser(data.username);
        }
      } catch (error) {
        console.error("Session check failed", error);
      }
    };

    document.documentElement.scrollTop = 0;
    getUser();
  }, []);

  return (
    <div className="bg-background font-montagu h-full">
      <Navbar />

      {user && (
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
          />
          <Post
            User={user}
            Img="images/Towa.jpg"
            DateUpload={Date.now() + 100000000}
            ProfilePic="images/fishBackground.jpg"
          />

          {/* Modal */}
          {isOpen && (
            <div className="flex justify-center px-3 py-40 fixed inset-0 bg-gray-500/50">
              <div className="max-w-sm w-full bg-white rounded-lg drop-shadow-xl h-85">
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
                    className="focus:outline-none focus:ring-0 border-0 w-full resize-none h-30 px-0"
                    placeholder={placeholderValue}
                  />
                  <div className="flex border-2 border-gray-300 py-2 px-3 my-2 rounded-xl">
                    <p>Add to your Post</p>
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
      )}
    </div>
  );
};

export default HomePage;
