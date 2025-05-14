import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import useIsOnSetup from "../stores/useIsOnSetup";
import userProfile from "../stores/useProfile";
import { IoPersonSharp, IoSearch } from "react-icons/io5";
import { IoIosLogOut } from "react-icons/io";
import { FaArrowLeft } from "react-icons/fa6";

const Navbar = () => {
  const searchRef = useRef(null);
  const navigate = useNavigate();
  const { isOnSetup } = useIsOnSetup();
  const user = userProfile();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isOpenModal, setIsOpenModal] = useState(false);

  //Makes it so that the tooltip is consistent
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        openSearch();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    if (user.currentUsername && user.currentProfile) {
      return;
    } else {
      const getUser = async () => {
        try {
          const res = await fetch(`http://localhost:5175/api/user`, {
            credentials: "include",
          });

          const data = await res.json();

          if (res.ok) {
            user.changeUsername(data.username);

            const img = new Image();
            img.src = data.profile.url;
            img.onload = () => {
              user.changeProfile(data.profile.url);
            };
          }
        } catch (e) {
          console.error(e);
        }
      };

      getUser();
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:5175/api/user/logout", {
        credentials: "include",
      });

      if (response.ok) {
        user.deleteUsername();
        user.deleteProfile();
        navigate("/login");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const openSearch = () => {
    setIsSearchOpen((prev) => !prev);
  };

  return (
    <div className="font-montagu relative">
      {isSearchOpen && (
        <div
          className="fixed top-0 left-0 flex justify-center bg-white py-4 z-50 pl-3"
          ref={searchRef}
        >
          <div className="flex items-center">
            <FaArrowLeft
              className="w-6 h-6 cursor-pointer ml-2"
              color="#7fcdff"
              onClick={openSearch}
            />
            <input
              type="text"
              name="search"
              id="search"
              maxLength={"15"}
              className="rounded-full mx-5 border-btn z-10 bg-gray-100 ring-btn"
              placeholder="Seach User"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  navigate(`/profile/${e.target.value}`);
                }
              }}
            />
          </div>
        </div>
      )}
      <div
        className="w-full flex fixed top-0 left-0 items-center 
                   text-center py-4 bg-btn z-40"
      >
        {!isOnSetup && (
          <div className="bg-white ml-8 rounded-full">
            <IoSearch
              id="searchBtn"
              className="p-2 w-10 h-10 cursor-pointer"
              color="#7fcdff"
              onClick={openSearch}
            />
          </div>
        )}
        <Link
          to="/"
          id="title"
          className={`absolute left-1/2 transform -translate-x-1/2 text-white 
                     text-4xl cursor-pointer transition-all duration-300`}
        >
          Fishbook
        </Link>
        <div className="relative m-auto mr-4 pl-30">
          <img
            src={`${
              !isOnSetup
                ? user.currentProfile
                : "/images/avatar-placeholder.png"
            }`}
            onClick={() => setIsOpenModal((prev) => !prev)}
            className={`w-10 h-10 ml-auto sm:mr-8 rounded-3xl
                      cursor-pointer pointer-events-auto
                    border border-gray-200 mr-4`}
          />
          {isOpenModal && (
            <div className="absolute top-full right-4 sm:right-10 bg-white rounded-md shadow-md z-50 text-left">
              <Link to={`/profile/${user.currentUsername}`}>
                <div className="flex items-center py-2 p-1 hover:bg-gray-100 cursor-pointer rounded-t-md">
                  <IoPersonSharp className="w-6 h-6 mr-2" />
                  <p className="cursor-pointer rounded-t-md ">Your Profile</p>
                </div>
              </Link>
              <div
                className="flex items-center p-2 hover:bg-gray-100 cursor-pointer rounded-b-md"
                onClick={handleLogout}
              >
                <IoIosLogOut className="w-7 h-7 mr-2" color="red" />
                <p className=" text-red-500">Log out</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
