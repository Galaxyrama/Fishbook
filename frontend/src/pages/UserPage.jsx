import React, { useState, useEffect } from "react";
import Post from "../components/Post";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import useAuth from "../hook/useAuth";

const UserPage = () => {
  const { username } = useParams();
  const navigate = useNavigate();

  const [profilePic, setProfilePic] = useState("");
  const [description, setDescription] = useState("");

  const [casts, setCasts] = useState(1);
  const [hookers, setHookers] = useState(0);
  const [hooked, setHooked] = useState(0);

  useAuth();

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await fetch(
          `http://localhost:5175/api/user/${username}`,
          {
            credentials: "include",
          }
        );

        const data = await response.json();

        if (!response.ok) {
          navigate("*");
          return;
        }

        setProfilePic(data.profile.url);
        setDescription(data.description);
      } catch (e) {
        console.error(e);
      }
    };

    document.documentElement.scrollTop = 0;
    getUser();
  });

  return (
    <div className=" bg-background h-full font-montagu">
      <Navbar />
      <div className="flex w-full justify-center pt-25 sm:px-16">
        <div className="block w-full max-w-3xl justify-center">
          <div className="block sm:flex w-full">
            <div className="flex justify-center">
              <div className="w-40 flex-shrink-0">
                <img
                  src={
                    profilePic ? profilePic : "/images/avatar-placeholder.png"
                  }
                  className="w-40 h-40 rounded-full"
                />
              </div>
            </div>
            <div className="block w-full text-center sm:ml-5 px-3">
              <div className="sm:px-10 py-5 flex justify-evenly text-xl sm:text-2xl sm:gap-10">
                <div className="block">
                  <p>{casts}</p>
                  <p className="text-[#4B4B4B]">Casts</p>
                </div>
                <div className="block">
                  <p>{hookers}</p>
                  <p className="text-[#4B4B4B]">Hookers</p>
                </div>
                <div className="block">
                  <p>{hooked}</p>
                  <p className="text-[#4B4B4B]">Hooked</p>
                </div>
              </div>
              <button
                className="w-full rounded-xl py-3 bg-btn text-white
                                 cursor-pointer"
              >
                Get Hooked
              </button>
            </div>
          </div>
          <div className="text-center mt-3 sm:mt-5">
            <h1 className="text-[40px] sm:text-left">{username}</h1>
            <p className="text-[18px] text-[#4B4B4B] sm:text-left">
              {description}
            </p>
          </div>
        </div>
      </div>

      <hr className="my-5 border-gray-600" />

      <Post
        User={username}
        Img="/images/Towa.jpg"
        DateUpload={Date.now()}
        ProfilePic="/images/fishBackground.jpg"
      />
    </div>
  );
};

export default UserPage;
