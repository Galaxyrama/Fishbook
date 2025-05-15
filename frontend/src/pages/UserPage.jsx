import React, { useState, useEffect } from "react";
import Post from "../components/Post";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import useAuth from "../hook/useAuth";
import PostSkeleton from "../components/PostSkeleton";
import UserPageSkeleton from "../components/UserPageSkeleton";

const UserPage = () => {
  useAuth();

  const { username } = useParams();
  const navigate = useNavigate();

  const [profilePic, setProfilePic] = useState("");
  const [description, setDescription] = useState("");
  const [btnText, setBtnText] = useState("");
  const [myProfile, setMyProfile] = useState(false);
  const [isFollowing, setIsFollowing] = useState();
  const [posts, setPosts] = useState([]);

  const [casts, setCasts] = useState(0);
  const [hookers, setHookers] = useState(0);
  const [hooked, setHooked] = useState(0);

  const [isLoading, setIsLoading] = useState(true);
  const [isUserLoading, setIsUserLoading] = useState(true);

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
          navigate("/404");
          return;
        }

        if (!data.profile.url) {
          navigate(`/setup/${data.username}`);
        }

        setProfilePic(data.profile.url);
        setDescription(data.description);
        setMyProfile(data.isMyProfile);
        setHookers(data.followerCount);
        setHooked(data.followingCount);
        setIsUserLoading(false);

        setBtnText(data.isMyProfile ? "Edit Account" : "Get Hooked");
      } catch (e) {
        console.error(e);
      }
    };

    const getUserPosts = async () => {
      try {
        const response = await fetch(
          `http://localhost:5175/api/post/${username}`,
          {
            credentials: "include",
          }
        );

        const data = await response.json();

        if (response.ok) {
          setPosts(data);
          setCasts(data.length);
          setIsLoading(false);
          return;
        }
      } catch (e) {
        console.error(e);
      }
    };

    const checkIfFollowed = async () => {
      try {
        const response = await fetch(
          `http://localhost:5175/api/user/${username}/follow`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        const data = await response.json();

        if (response.ok) {
          setIsFollowing(data.followed);
        }
      } catch (e) {
        console.error(e);
      }
    };

    document.documentElement.scrollTop = 0;
    getUser();
    getUserPosts();
    checkIfFollowed();
  }, [username]);

  useEffect(() => {
    if (!myProfile) setBtnText(isFollowing ? "Got Hooked" : "Get Hooked");
  }, [isFollowing, myProfile]);

  const handleButton = async () => {
    if (myProfile) {
      navigate(`/edit/${username}`);
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5175/api/user/${username}/follow`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      const data = await response.json();
      if (response.ok) {
        setHookers((prev) => (isFollowing ? prev - 1 : prev + 1));
        setBtnText(data.message);
        setIsFollowing((prev) => !prev);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className={`bg-background min-h-screen font-montagu`}>
      <Navbar />
      {isUserLoading ? (
        <UserPageSkeleton />
      ) : (
        <div className="flex w-full justify-center pt-25 sm:px-16">
          <div className="block w-full max-w-3xl justify-center">
            <div className="block sm:flex w-full">
              <div className="flex justify-center">
                <div className="w-40 flex-shrink-0">
                  <img src={profilePic} className="w-40 h-40 rounded-full" />
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
                {btnText && (
                  <button
                    className="w-full rounded-xl py-3 bg-btn text-white
                                 cursor-pointer"
                    onClick={handleButton}
                  >
                    {btnText}
                  </button>
                )}
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
      )}

      <hr className="my-5 border-gray-600" />

      {isLoading
        ? Array.from({ length: 3 }).map((_, index) => (
            <PostSkeleton key={index} revealParts={false} />
          ))
        : posts &&
          posts.map((post) => <Post Post={post} Home={false} key={post._id} />)}
    </div>
  );
};

export default UserPage;
