import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { FaTrashAlt } from "react-icons/fa";

const DeletePostComponent = ({ PostId, GoToHome, Type }) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const modalRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        closeModal();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleDeletePost = async () => {
    try {
      const response = await fetch(
        `http://localhost:5175/api/${Type}/status/${PostId}/delete`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (response.ok) {
        location.reload();

        if (GoToHome) navigate("/");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const openModal = () => {
    setIsDeleteModalOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setIsDeleteModalOpen(false);
    document.body.style.overflow = "auto";
  };

  //For the little notification below the screen
  const toast = isDeleteModalOpen && (
    <div
      className="flex justify-center items-center px-3 pt-20 
                 fixed inset-0 z-[50] bg-gray-500/50 pointer-events-auto font-montagu"
    >
      <div
        className="max-w-xl w-full bg-white rounded-lg drop-shadow-xl max-h-screen flex-col"
        ref={modalRef}
      >
        <div>
          {/* Header */}
          <div className="w-full relative text-center justify-center py-2">
            <h1 className="text-2xl">
              Delete {Type.charAt(0).toUpperCase() + String(Type).slice(1)}
            </h1>
            <img
              src="/images/exit-btn.png"
              onClick={closeModal}
              className="w-7 h-7 absolute right-3 top-2.5
                              transform -translatee-y-1/2
                              pointer-events-auto cursor-pointer"
            />
          </div>
          <hr className="py-1 border-[#ACACAC]" />
          <div className="py-1 px-3 text-xl">
            <p className="pb-5">Are you sure you want to delete the {Type}?</p>

            <div className="flex float-right gap-3 pb-2">
              <button className="cursor-pointer text-btn" onClick={closeModal}>
                Close
              </button>
              <button
                className="rounded-full cursor-pointer text-white bg-btn px-5"
                onClick={handleDeletePost}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <div className="flex text-red-500" onClick={openModal}>
        <FaTrashAlt className="w-5 h-5 mr-2 " />
        <p>Delete {Type.charAt(0).toUpperCase() + String(Type).slice(1)}</p>
      </div>

      {createPortal(toast, document.getElementById("toast-root"))}
    </div>
  );
};

export default DeletePostComponent;
