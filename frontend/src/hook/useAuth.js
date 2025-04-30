import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import userProfile from "../stores/useProfile";

const useAuth = () => {
  const { deleteProfile, deleteUsername } = userProfile();

  const [user, setUser] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch("http://localhost:5175/api/user/session", {
          credentials: "include",
        });

        const data = await response.json();
        if (response.ok) {
          setUser(data.user);
        } else {
          deleteProfile();
          deleteUsername();
          navigate("/login");
        }
      } catch (error) {
        console.error("Session check failed", error);
      }
    };

    checkSession();
  }, []);

  return user;
};

export default useAuth;
