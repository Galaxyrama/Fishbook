import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Tooltip } from "flowbite";
import useAuthStore from "../stores/useAuthStore";
import useIsOnSetup from "../stores/useIsOnSetup";

const Navbar = () => {
  const searchRef = useRef(null);
  const navigate = useNavigate();
  const { clearUserId } = useAuthStore();
  const { isOnSetup } = useIsOnSetup();

  const [isSearchOpen, setIsSearchOpen] = useState(false);

  //Makes it so that the tooltip is consistent
  useEffect(() => {
    const tooltipAppear = () => {
      const $targetE1 = document.getElementById("tooltip-logout");
      const $triggerE1 = document.querySelector(
        '[data-tooltip-target="tooltip-logout"]'
      );

      if ($targetE1 && $triggerE1) {
        new Tooltip($targetE1, $triggerE1);
      }
    };

    tooltipAppear();

    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        openSearch();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

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
        clearUserId();
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
            <img
              src="/images/arrow.png"
              className="w-6 h-6 cursor-pointer ml-2"
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
            <img
              id="searchBtn"
              src="/images/search.png"
              className="p-2 w-10 cursor-pointer"
              onClick={openSearch}
            />
          </div>
        )}
        <Link
          to="/"
          id="title"
          className={`absolute left-1/2 transform -translate-x-1/2 text-white 
                     text-4xl cursor-pointer transition-all duration-300 z-0`}
        >
          Fishbook
        </Link>
        <img
          src="/images/logout.png"
          onClick={handleLogout}
          className={`bg-white w-10 h-10 ml-auto sm:mr-8 rounded-3xl p-1
                      cursor-pointer pointer-events-auto
                      hover:bg-gray-100 mr-4 `}
          data-tooltip-target="tooltip-logout"
        />

        {/* Tooltip */}
        <div
          id="tooltip-logout"
          role="tooltip"
          className="absolute z-10 invisible 
                       inline-block px-3 py-2 text-sm 
                       font-medium text-btn 
                       bg-white rounded-lg shadow-sm 
                       opacity-0 transition-opacity 
                       duration-300 tooltip"
        >
          Click to Logout
          <div className="tooltip-arrow" data-popper-arrow></div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
