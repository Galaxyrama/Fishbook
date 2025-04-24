import React, { useState } from "react";
import { createPortal } from "react-dom";

const ShareLinkComponent = ({ username, id, type }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleShareLink = () => {
    navigator.clipboard.writeText(
      `${type === "status" ? window.location.href : "localhost:5173/"}${
        username ? username : ""
      }${username && id ? `/${type}/` : ""}${id ? id : ""}`
    );
    setIsOpen(true);

    setTimeout(() => setIsOpen(false), 5000);
  };

  const toast = isOpen && (
    <div className="z-50 bottom-4 left-1/2 transform -translate-x-1/2 text-center w-60 fixed">
      <p className="text-white bg-btn py-2 rounded-md">Copied to clickboard</p>
    </div>
  );

  return (
    <div>
      <div
        className="flex select-none cursor-pointer"
        onClick={handleShareLink}
      >
        <img src="/images/share.png" className="w-g h-6 mr-1" />
        <p>Share</p>
      </div>

      {createPortal(toast, document.getElementById("toast-root"))}
    </div>
  );
};

export default ShareLinkComponent;
