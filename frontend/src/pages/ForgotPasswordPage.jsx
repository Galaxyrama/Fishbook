import React, { useState } from "react";
import LoginRegisterRightSide from "../components/LoginRegisterRightSide";
import { Link, useNavigate } from "react-router-dom";
import { FaLock } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";

const ForgotPasswordPage = () => {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setError("");

    const response = await fetch(
      "http://localhost:5175/api/user/forgot-password",
      {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      setError(data.message);
    } else {
      navigate("/login");
    }
  };

  return (
    <>
      <div className="content-center sm:flex">
        <div className="flex justify-center min-h-screen items-center w-full font-montagu bg-background sm:mt-0">
          <div className="p-8 max-w-3xl">
            <p className="mb-10 text-center text-light-blue text-6xl">
              Fishbook
            </p>
            <p className="mb-5 text-dark-blue font-semibold text-3xl">
              Forgot Password
            </p>
            <p className="mb-5 text-base text-light-blue">
              Forgot your password? Reset it now and get back to connecting with
              fellow fish enthusiasts on Fishbook!
            </p>
            <form className="margin-auto mb-3" onSubmit={handleForgotPassword}>
              <div className="container">
                <label
                  htmlFor="email"
                  className="inline-block mb-3 text-medium-blue"
                >
                  Email Address
                </label>
                <div className="relative">
                  <MdEmail className="absolute left-4 top-1/2 transform -translate-y-3 w-6 h-6" />
                  <input
                    type="email"
                    placeholder="Enter your email"
                    name="email"
                    id="email"
                    className="rounded-xl border-1 px-12 py-4 w-full"
                    required
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                  />
                </div>

                <label
                  htmlFor="password"
                  className="inline-block mt-6 mb-3 text-medium-blue"
                >
                  New Password
                </label>
                <div className="relative">
                  <FaLock className="absolute left-4 top-1/2 transform -translate-y-6 w-6 h-6" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your new password"
                    name="password"
                    id="password"
                    className="rounded-xl border-1 px-12 py-4 w-full mb-5"
                    required
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                  />
                  <img
                    src={showPassword ? "images/show.png" : "images/hide.png"}
                    value={showPassword}
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-4 top-1/2 transform -translate-y-6 w-6 h-6"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-btn text-white 
                        p-4 rounded-2xl mt-4 mb-4 cursor-pointer"
              >
                Reset Password
              </button>

              {error && (
                <p className="text-red-700 text-center py-2">{error}</p>
              )}

              <div className="container flex text-dark-blue justify-center mt-1">
                <Link to="/login">Back to SIGN IN</Link>
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

export default ForgotPasswordPage;
