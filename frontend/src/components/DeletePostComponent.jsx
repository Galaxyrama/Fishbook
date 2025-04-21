import React from "react";

const DeletePostComponent = ({ PostId }) => {
  const handleDeletePost = async () => {
    try {
      const response = await fetch(
        `http://localhost:5175/api/post/${PostId}/delete`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const data = await response.json();

      if (response.ok) {
        navigate("/");
      }
    } catch (e) {
      console.error(e);
    }
  };

  return <div>DeletePostComponent</div>;
};

export default DeletePostComponent;
