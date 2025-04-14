import React, { useEffect, useState } from "react";
import LoginRegisterRightSide from "../components/LoginRegisterRightSide";
import { Link, useNavigate } from "react-router-dom";

const RegistrationPage = () => {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (confirmPassword === password) {
      const response = await fetch("http://localhost:5175/api/user/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      if(response.ok) {
        navigate("/login");
      }
    } else {
      setError("Passwords do not match!");
    }
  };

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch("http://localhost:5175/api/user/session", {
          credentials: "include",
        });

        if (response.ok) {
          navigate("/");
        }
      } catch (error) {
        console.log("Session check failed", error);
      }
    };

    checkSession();
  }, []);

  return (
    <>
      <div className="m-auto sm:flex">
        <div className="flex justify-center items-center min-h-screen w-full font-montagu bg-background sm:mt-0">
          <div className="p-8">
            <p className="mb-10 text-light-blue text-6xl text-center">
              Fishbook
            </p>
            <p className="mb-5 text-dark-blue font-semibold text-3xl">
              Create your account
            </p>
            <p className="mb-5 text-base text-light-blue">
              Join Fishbook today and dive into the latest updates from fellow
              fish enthusiasts!
            </p>

            <form className="margin-auto mb-3" onSubmit={handleRegister}>
              <div className="container">
                {/* The username */}
                <label
                  htmlFor="user"
                  className="inline-block mb-3 text-medium-blue"
                >
                  Username
                </label>
                <div className="relative mb-5">
                  <img
                    src="images/user.png"
                    className="absolute left-4 top-1/2 transform -translate-y-3 w-6 h-6"
                  />
                  <input
                    type="text"
                    placeholder="Enter a username"
                    name="user"
                    id="user"
                    className="rounded-xl border-1 px-12 py-4 w-full"
                    maxLength="15"
                    onChange={(e) => setUsername(e.target.value)}
                    value={username}
                  />
                </div>

                {/* The email address */}
                <label
                  htmlFor="email"
                  className="inline-block mb-3 text-medium-blue"
                >
                  Email Address
                </label>
                <div className="relative">
                  <img
                    src="images/email.png"
                    className="absolute left-4 top-1/2 transform -translate-y-5.5 w-6 h-6"
                  />
                  <input
                    type="email"
                    placeholder="Enter your email"
                    name="email"
                    id="email"
                    className="rounded-xl border-1 px-12 py-4 w-full mb-5"
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                  />
                </div>

                {/* The password */}
                <label
                  htmlFor="password"
                  className="inline-block mb-3 text-medium-blue"
                >
                  Password
                </label>
                <div className="relative">
                  <img
                    src="images/padlock.png"
                    className="absolute left-4 top-1/2 transform -translate-y-6 w-6 h-6"
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    name="password"
                    id="password"
                    className="rounded-xl border-1 px-12 py-4 w-full mb-5"
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                  />
                  <img
                    src={showPassword ? "images/show.png" : "images/hide.png"}
                    value={showPassword}
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-4 top-1/2 transform -translate-y-5.5 w-6 h-6"
                  />
                </div>

                {/* The confirm password */}
                <label
                  htmlFor="confirmPassword"
                  className="inline-block mb-3 text-medium-blue"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <img
                    src="images/padlock.png"
                    className="absolute left-4 top-1/2 transform -translate-y-6 w-6 h-6"
                  />
                  <input
                    type={showPassword2 ? "text" : "password"}
                    placeholder="Confirm your password"
                    name="password"
                    id="confirmPassword"
                    className="rounded-xl border-1 px-12 py-4 w-full mb-5"
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    value={confirmPassword}
                  />
                  <img
                    src={showPassword2 ? "images/show.png" : "images/hide.png"}
                    value={showPassword2}
                    onClick={() => setShowPassword2((prev) => !prev)}
                    className="absolute right-4 top-1/2 transform -translate-y-5.5 w-6 h-6"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-btn text-white 
                p-4 rounded-2xl mt-4 mb-4 cursor-pointer"
              >
                Create Account
              </button>

              {error && (
                <p className="text-red-700 text-center py-2">{error}</p>
              )}

              <div className="container flex text-dark-blue justify-center mt-1">
                <p className="mr-2">Already have an account? </p>
                <Link to="/login" className="underline font-semibold">
                  Sign in
                </Link>
              </div>
            </form>
          </div>
        </div>

        <div className="hidden w-full sm:block">
          <LoginRegisterRightSide />
        </div>
      </div>
    </>
  );
};

export default RegistrationPage;
