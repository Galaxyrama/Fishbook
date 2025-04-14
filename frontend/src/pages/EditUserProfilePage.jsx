import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useNavigate, useParams } from "react-router-dom";
import Cropper from "react-easy-crop";
import getCroppedImg from "../utils/cropImage.js";
import useAuth from "../hook/useAuth.js";

const EditUserProfilePage = () => {
  const [currentUsername, setUsername] = useState("");
  const [description, setDescription] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [gender, setGender] = useState("Male");
  const [currentLocation, setCurrentLocation] = useState("South Georgia");
  const [profilePicture, setProfilePicture] = useState(
    "/images/avatar-placeholder.png"
  );
  const [tempProfile, setTempProfile] = useState();
  const [error, setError] = useState("");

  const [openCropper, setOpenCropper] = useState(false);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

  const [countries, setCountries] = useState([]);

  const { username } = useParams();
  const navigate = useNavigate();

  useAuth();

  useEffect(() => {
    const getCountries = async () => {
      try {
        const response = await fetch("https://restcountries.com/v3.1/all");

        if (response.ok) {
          const data = await response.json();
          setCountries(data);
        }
      } catch (e) {
        console.error(e);
      }
    };

    const getUser = async () => {
      try {
        const response = await fetch(
          `http://localhost:5175/api/user/${username}`,
          {
            credentials: "include",
          }
        );

        const data = await response.json();

        if (response.ok) {
          setDescription(data.description);
          setGender(data.gender);
          setCurrentLocation(data.currentLocation);
          setProfilePicture(data.profile.url);

          const today = new Date(data.birthDate);
          const formatted = today.toISOString().split("T")[0];
          setBirthDate(formatted);
        }
      } catch (e) {
        console.error(e);
      }
    };

    getUser();
    getCountries();
    setUsername(username);
  }, []);

  //handles the submit
  const handleForm = async (e) => {
    e.preventDefault();
    setError("");

    const response = await fetch("http://localhost:5175/api/user/setup", {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        currentUsername,
        description,
        birthDate,
        gender,
        currentLocation,
        image: profilePicture,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      setError(data.error);
      throw new Error(data.message || "Edit failed");
    }

    navigate(`/profile/${username}`);
  };

  //handles when the user changes the image
  const handleImageChange = (e) => {
    const imageFile = e.target.files[0];
    if (imageFile) {
      const url = URL.createObjectURL(imageFile);
      setTempProfile(url);
      setOpenCropper(true);
    }
  };

  const onCropComplete = (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
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

  //handles when the user confirms the new image
  const showCroppedImage = async () => {
    try {
      const croppedImage = await getCroppedImg(
        tempProfile,
        croppedAreaPixels,
        0
      );

      const base64Image = await convertBlobToBase64(croppedImage);
      setProfilePicture(base64Image);
      console.log(base64Image);

      setOpenCropper(false);
    } catch (e) {
      console.error(e);
    }
  };

  const closeModal = () => {
    setOpenCropper(false);
    setTempProfile("");
    setProfilePicture("/images/avatar-placeholder.png");
  };

  return (
    <div className="bg-background font-montagu min-h-screen py-20">
      <Navbar />
      <div className="block sm:flex">
        <div className="mt-5 ml-5 w-sm">
          <h1 className="text-center text-3xl text-dark-blue font-semibold">
            Edit Account
          </h1>
          <div className="flex flex-col items-center mt-4">
            <div className="w-40 flex-shrink-0">
              <label htmlFor="fileUpload" className="cursor-pointer">
                <img
                  src={
                    profilePicture
                      ? profilePicture
                      : "/images/avatar-placeholder.png"
                  }
                  className="h-40 w-40 rounded-full justify-center cursor-pointer"
                  htmlFor="fileUpload"
                />
              </label>
            </div>
            <div className="mt-5">
              <input
                type="file"
                className="text-white py-2 px-5 
                            bg-btn rounded-xl cursor-pointer
                            text-[0px] hidden"
                id="fileUpload"
                accept="image/png, image/jpeg"
                onChange={handleImageChange}
              />
              <label
                htmlFor="fileUpload"
                className="cursor-pointer
               bg-btn text-white px-4 py-2 rounded-md"
              >
                Change Image
              </label>
            </div>
          </div>
        </div>
        <div className="mt-12 px-5 w-full">
          <form onSubmit={handleForm}>
            <div className="container">
              {/* Username */}
              <label
                htmlFor="username"
                className="inline-block mb-2 mt-5 text-medium-blue"
              >
                Username
              </label>
              <div className="relative">
                <img
                  src="/images/user.png"
                  className="absolute left-4 top-1/2 transform -translate-y-3 w-6 h-6"
                />
                <input
                  type="text"
                  placeholder="Enter your username"
                  name="username"
                  id="username"
                  className="rounded-xl border-1 px-12 py-4 w-full"
                  required
                  onChange={(e) => setUsername(e.target.value)}
                  value={currentUsername}
                />
              </div>

              {/* Description */}
              <label
                htmlFor="description"
                className="inline-block mb-2 mt-5 text-medium-blue"
              >
                Profile Description
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder={`Hello everyone! I’m ${currentUsername}, here to fish with you all!`}
                  name="description"
                  id="description"
                  className="rounded-xl border-1 py-4 w-full"
                  maxLength={150}
                  required
                  onChange={(e) => setDescription(e.target.value)}
                  value={description}
                />
              </div>

              {/* Birthdate */}
              <div className="block">
                <label
                  htmlFor="birthDate"
                  className="inline-block mb-2 mt-5 text-medium-blue"
                >
                  Birth Date
                </label>
                <div className="relative">
                  <img
                    src="/images/calendar.png"
                    className="absolute left-4 top-1/2 transform -translate-y-3 w-6 h-6"
                  />
                  <input
                    type="date"
                    placeholder="Enter your username"
                    name="birthDate"
                    id="birthDate"
                    className="rounded-xl border-1 pl-12 py-4 w-full"
                    required
                    onChange={(e) => setBirthDate(e.target.value)}
                    value={birthDate}
                  />
                </div>
              </div>

              {/* Gender */}
              <label
                htmlFor="gender"
                className="inline-block mb-2 mt-5 text-medium-blue"
              >
                Gender
              </label>
              <div className="relative">
                <img
                  src="/images/gender.png"
                  className="absolute left-4 top-1/2 transform -translate-y-3 w-6 h-6"
                />
                <select
                  name="gender"
                  id="gender"
                  className="rounded-xl border-1 px-12 py-4 w-full"
                  required
                  onChange={(e) => setGender(e.target.value)}
                  value={gender}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="null">Prefer not to answer</option>
                </select>
              </div>

              {/* Current location */}
              <div>
                <label
                  htmlFor="location"
                  className="inline-block mb-2 mt-5 text-medium-blue"
                >
                  Country
                </label>
                <div className="relative">
                  <img
                    src="/images/location.png"
                    className="absolute left-4 top-1/2 transform -translate-y-3 w-6 h-6"
                  />
                  <select
                    type="text"
                    placeholder="Select your current country"
                    name="location"
                    id="location"
                    className="rounded-xl border-1 px-12 py-4 w-full"
                    required
                    onChange={(e) => setCurrentLocation(e.target.value)}
                    value={currentLocation}
                  >
                    {countries.map((item, index) => (
                      <option value={item.name.common} key={index}>
                        {item.name.common}
                      </option>
                    ))}
                  </select>
                </div>
                {error && (
                  <p className="text-red-500 pt-2 text-center">{error}</p>
                )}
              </div>

              <button
                type="submit"
                className="bg-btn text-white w-full cursor-pointer
                                  mt-5 py-3 rounded-xl text-xl mb-7"
              >
                Confirm
              </button>
            </div>
          </form>
        </div>
      </div>

      {openCropper && (
        <div className="fixed w-full inset-0 pt-15">
          <div className="relative w-full h-[800px]">
            <Cropper
              image={tempProfile}
              crop={crop}
              zoom={zoom}
              cropShape="round"
              aspect={1}
              onCropChange={setCrop}
              onCropComplete={onCropComplete}
              onZoomChange={setZoom}
            />
          </div>
          <div>
            <div className="justify-center flex gap-4 mt-4 z-10">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer"
                onClick={showCroppedImage}
              >
                Save Image
              </button>
              <button
                className="bg-gray-300 text-black px-4 py-2 rounded cursor-pointer"
                onClick={closeModal}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditUserProfilePage;
